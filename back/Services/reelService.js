const mongoose = require("mongoose");
const Reel = require("../Modules/Reel");
const { cloudRemoveVideo, cloudUploadVideo } = require("../Config/cloudUploadVideo");
const { io } = require("../Config/socket");
const { User } = require("../Modules/User");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { reelPopulate } = require("../Populates/Populate");

const response = (status, body) => ({ status, body });
const validId = (id) => mongoose.isValidObjectId(id);
const MAX_PAGE = 10000;
const MAX_LIMIT = 30;

const parseBoundedInteger = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
};

const getLegacyPublicId = (videoUrl) => {
  try {
    const uploadPath = new URL(videoUrl).pathname.split("/upload/")[1];
    if (!uploadPath) return null;
    const segments = uploadPath.split("/");
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    if (versionIndex < 0 || versionIndex === segments.length - 1) return null;
    return segments.slice(versionIndex + 1).join("/").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const notifyReelOwner = async ({ ownerId, senderId, reelId, action }) => {
  if (ownerId.equals(senderId)) return;
  const reelOwner = await User.findById(ownerId).select("BlockedNotificationFromUsers");
  if (!reelOwner) return;
  const blockedUsers = reelOwner.BlockedNotificationFromUsers || [];
  if (blockedUsers.some((blockedId) => blockedId.equals(senderId))) return;

  await sendNotificationHelper({
    sender: senderId,
    receiver: ownerId,
    content: `${action} your reel`,
    type: action === "liked" ? "like" : "share",
    actionRef: reelId,
    actionModel: "Reel",
  });
};

const createReel = async ({ file, caption, userId }) => {
  if (!file) return response(400, { message: "No video file uploaded" });
  if (!file.mimetype?.startsWith("video/")) return response(400, { message: "Only video files are allowed" });
  const safeCaption = caption ?? "";
  if (typeof safeCaption !== "string" || safeCaption.length > 2200) {
    return response(400, { message: "Caption must be 2200 characters or fewer" });
  }

  const uploadResult = await cloudUploadVideo(file);
  if (!uploadResult?.secure_url || !uploadResult?.public_id || uploadResult.resource_type !== "video") {
    return response(400, { message: "Uploaded file is not a valid video" });
  }

  const newReel = await Reel.create({
    videoUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    thumbnailUrl: uploadResult.secure_url
      .replace("/video/upload/", "/video/upload/so_0/")
      .replace(/\.[^/.]+$/, ".jpg"),
    caption: safeCaption.trim(),
    owner: userId,
  });

  try {
    const user = await User.findById(userId);
    if (user) {
      user.userLevelPoints += 10;
      user.updateLevelRank();
      await user.save();
    }
  } catch (error) {
    console.error("Reel was created, but the uploader's points could not be updated:", error);
  }

  await newReel.populate(reelPopulate);
  io.emit("reel:create", newReel);
  return response(201, newReel);
};

const deleteReel = async ({ id, userId }) => {
  if (!validId(id)) return response(400, { message: "Invalid reel ID" });
  const reel = await Reel.findById(id);
  if (!reel) return response(404, { message: "Reel not found" });
  if (reel.owner.toString() !== userId.toString()) {
    return response(403, { message: "Unauthorized" });
  }

  const publicId = reel.publicId || getLegacyPublicId(reel.videoUrl);
  if (!publicId) return response(500, { message: "Unable to identify the uploaded video for deletion" });
  const hasOtherReferences = await Reel.exists({
    _id: { $ne: reel._id },
    $or: [{ publicId }, { videoUrl: reel.videoUrl }],
  });
  if (!hasOtherReferences) await cloudRemoveVideo(publicId);
  await reel.deleteOne();
  await User.updateMany(
    { savedReels: reel._id },
    { $pull: { savedReels: reel._id } }
  );
  io.emit("reel:delete", id);
  return response(200, { message: "Reel deleted successfully" });
};

const getAllReels = async ({ page: pageQuery, limit: limitQuery }) => {
  const page = parseBoundedInteger(pageQuery, 1, 1, MAX_PAGE);
  const limit = parseBoundedInteger(limitQuery, 10, 1, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const [reels, totalReels] = await Promise.all([
    Reel.find()
      .populate(reelPopulate)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Reel.countDocuments(),
  ]);

  return response(200, {
    page,
    limit,
    totalReels,
    totalPages: Math.ceil(totalReels / limit),
    reels,
  });
};

const likeReel = async ({ id, userId }) => {
  if (!validId(id)) return response(400, { message: "Invalid reel ID" });
  const reel = await Reel.findById(id).select("owner likes").lean();
  if (!reel) return response(404, { message: "Reel not found" });

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const wasLiked = (reel.likes || []).some((likedBy) => likedBy.toString() === userObjectId.toString());
  const updatedReel = await Reel.findOneAndUpdate(
    { _id: id },
    [{
      $set: {
        likes: {
          $cond: [
            { $in: [userObjectId, { $ifNull: ["$likes", []] }] },
            {
              $filter: {
                input: { $ifNull: ["$likes", []] },
                as: "likedBy",
                cond: { $ne: ["$$likedBy", userObjectId] },
              },
            },
            { $concatArrays: [{ $ifNull: ["$likes", []] }, [userObjectId]] },
          ],
        },
      },
    }],
    { new: true }
  ).populate(reelPopulate);

  if (!wasLiked) {
    try {
      await notifyReelOwner({ ownerId: reel.owner, senderId: userObjectId, reelId: reel._id, action: "liked" });
    } catch (error) {
      console.error("Failed to notify reel owner about a like:", error);
    }
  }

  if (!updatedReel) return response(404, { message: "Reel not found" });
  io.emit("reel:update", updatedReel);
  return response(200, updatedReel);
};

const viewReel = async ({ id, userId }) => {
  if (!validId(id)) return response(400, { message: "Invalid reel ID" });
  const reel = await Reel.findById(id).select("owner").lean();
  if (!reel) return response(404, { message: "Reel not found" });

  const update = await Reel.updateOne(
    { _id: id, owner: { $ne: userId }, views: { $ne: userId } },
    { $addToSet: { views: userId } }
  );
  const [view] = await Reel.aggregate([
    { $match: { _id: reel._id } },
    { $project: { _id: 1, viewsCount: { $size: { $ifNull: ["$views", []] } } } },
  ]);
  if (!view) return response(404, { message: "Reel not found" });

  const viewResult = { _id: view._id, viewsCount: view.viewsCount, counted: update.modifiedCount === 1 };
  if (viewResult.counted) io.emit("reel:view", viewResult);
  return response(200, viewResult);
};

const shareReel = async ({ id, userId }) => {
  if (!validId(id)) return response(400, { message: "Invalid reel ID" });
  const originalReel = await Reel.findById(id).populate("owner", "username profileName profilePhoto");
  if (!originalReel) return response(404, { message: "Reel not found" });

  const sharedReel = new Reel({
    videoUrl: originalReel.videoUrl,
    publicId: originalReel.publicId,
    thumbnailUrl: originalReel.thumbnailUrl,
    caption: originalReel.caption,
    originalPost: originalReel._id,
    owner: userId,
    isShared: true,
  });

  await sharedReel.save();
  await sharedReel.populate(reelPopulate);
  io.emit("reel:create", sharedReel);
  try {
    await notifyReelOwner({
      ownerId: originalReel.owner._id,
      senderId: new mongoose.Types.ObjectId(userId),
      reelId: sharedReel._id,
      action: "shared",
    });
  } catch (error) {
    console.error("Failed to notify reel owner about a share:", error);
  }
  return response(201, sharedReel);
};

module.exports = { createReel, deleteReel, getAllReels, likeReel, viewReel, shareReel };
