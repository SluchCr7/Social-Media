const Reel = require("../Modules/Reel");
const { cloudRemove } = require("../Config/cloudUpload");
const { cloudUploadVideo } = require("../Config/cloudUploadVideo");
const { io } = require("../Config/socket");
const { User } = require("../Modules/User");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { reelPopulate } = require("../Populates/Populate");

const response = (status, body) => ({ status, body });

const createReel = async ({ file, caption, userId }) => {
  if (!file) return response(400, { message: "No video file uploaded" });

  const uploadResult = await cloudUploadVideo(file);
  const newReel = await Reel.create({
    videoUrl: uploadResult.secure_url,
    thumbnailUrl: uploadResult.secure_url,
    caption: caption || "",
    owner: userId,
  });

  const user = await User.findById(userId);
  user.userLevelPoints += 10;
  user.updateLevelRank();
  await user.save();

  await newReel.populate(reelPopulate);
  io.emit("reel:create", newReel);
  return response(201, newReel);
};

const deleteReel = async ({ id, userId }) => {
  const reel = await Reel.findById(id);
  if (!reel) return response(404, { message: "Reel not found" });
  if (reel.owner.toString() !== userId.toString()) {
    return response(403, { message: "Unauthorized" });
  }

  const publicId = reel.videoUrl.split('/').pop().split('.')[0];
  await cloudRemove(publicId, 'video');
  await reel.remove();
  io.emit("reel:delete", id);
  return response(200, { message: "Reel deleted successfully" });
};

const getAllReels = async ({ page: pageQuery, limit: limitQuery }) => {
  const page = parseInt(pageQuery) || 1;
  const limit = parseInt(limitQuery) || 10;
  const skip = (page - 1) * limit;

  const reels = await Reel.find()
    .populate('owner', 'username profileName profilePhoto')
    .populate({
      path: 'originalPost',
      populate: { path: 'owner', select: 'username profileName profilePhoto' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalReels = await Reel.countDocuments();
  return response(200, {
    page,
    limit,
    totalReels,
    totalPages: Math.ceil(totalReels / limit),
    reels,
  });
};

const likeReel = async ({ id, userId }) => {
  const reel = await Reel.findById(id);
  if (!reel) return response(404, { message: "Reel not found" });

  if (reel.likes.includes(userId)) {
    await Reel.findByIdAndUpdate(id, { $pull: { likes: userId } });
  } else {
    await Reel.findByIdAndUpdate(id, { $push: { likes: userId } });
    if (!reel.owner.equals(userId)) {
      const reelOwner = await User.findById(reel.owner).select('BlockedNotificationFromUsers');
      const isBlocked = reelOwner.BlockedNotificationFromUsers.some(
        blockedId => blockedId.toString() === userId.toString()
      );
      if (!isBlocked) {
        await sendNotificationHelper({
          sender: userId,
          receiver: reel.owner,
          content: 'liked your reel',
          type: 'like',
          actionRef: reel._id,
          actionModel: 'Reel',
        });
      }
    }
  }

  const updatedReel = await Reel.findById(id).populate(reelPopulate);
  io.emit("reel:update", updatedReel);
  return response(200, updatedReel);
};

const viewReel = async ({ id, userId }) => {
  const reel = await Reel.findById(id);
  if (!reel) return response(404, { message: "Reel not found" });

  const updatedReel = await Reel.findByIdAndUpdate(
    id,
    { $addToSet: { views: userId } },
    { new: true }
  )
    .populate(reelPopulate)
    .populate("views", "username profilePhoto");

  io.emit("reel:update", updatedReel);
  return response(200, updatedReel);
};

const shareReel = async ({ id, userId }) => {
  const originalPost = await Reel.findById(id).populate(
    "owner",
    "username profileName profilePhoto"
  );
  if (!originalPost) return response(404, { message: "Reel not found" });

  const sharedReel = new Reel({
    videoUrl: originalPost.videoUrl,
    thumbnailUrl: originalPost.thumbnailUrl,
    caption: originalPost.caption,
    originalPost: originalPost._id,
    owner: userId,
  });

  if (!originalPost.owner.equals(userId)) {
    const reelOwner = await User.findById(originalPost.owner).select('BlockedNotificationFromUsers');
    const isBlocked = reelOwner.BlockedNotificationFromUsers.some(
      blockedId => blockedId.toString() === userId.toString()
    );
    if (!isBlocked) {
      await sendNotificationHelper({
        sender: userId,
        receiver: originalPost.owner,
        content: 'shared your reel',
        type: 'share',
        actionRef: sharedReel._id,
        actionModel: 'Reel',
      });
    }
  }

  await sharedReel.save();
  await sharedReel.populate(reelPopulate);
  io.emit("reel:create", sharedReel);
  return response(201, sharedReel);
};

module.exports = { createReel, deleteReel, getAllReels, likeReel, viewReel, shareReel };
