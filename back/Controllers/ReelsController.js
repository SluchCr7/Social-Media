const Reel = require('../Modules/Reel');
const { cloudRemove } = require('../Config/cloudUpload'); // خاصة بالصور
const { cloudUploadVideo } = require('../Config/cloudUploadVideo'); // خاصة بالفيديوهات
const { getReceiverSocketId, io } = require("../Config/socket");
const { Notification } = require("../Modules/Notification");
const asyncHandler = require("express-async-handler");
const { User} = require('../Modules/User')
const {sendNotificationHelper} = require("../utils/SendNotification");
const { reelPopulate } = require('../Populates/Populate');

const createReel = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No video file uploaded" });

  const uploadResult = await cloudUploadVideo(req.file);

  const newReel = await Reel.create({
    videoUrl: uploadResult.secure_url,
    thumbnailUrl: uploadResult.secure_url,
    caption: req.body.caption || "",
    owner: req.user._id,
  });

  const user = await User.findById(req.user._id);
  user.userLevelPoints += 10;
  user.updateLevelRank();
  await user.save();

  await newReel.populate(reelPopulate);

  res.status(201).json(newReel);
});


// حذف Reel
const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (reel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ الفيديوهات لازم تتحذف باستخدام resource_type: 'video'
    const publicId = reel.videoUrl.split('/').pop().split('.')[0];
    await cloudRemove(publicId, 'video');

    await reel.remove();

    res.status(200).json({ message: "Reel deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// جلب جميع Reels مع Pagination
const getAllReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
    const pages = Math.ceil(totalReels / limit);

    res.status(200).json({
      page,
      limit,
      totalReels,
      totalPages: pages,
      reels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// لايك / أنلايك
const likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (reel.likes.includes(req.user._id)) {
      await Reel.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } });
    } else {
      await Reel.findByIdAndUpdate(req.params.id, { $push: { likes: req.user._id } });
      if (!reel.owner.equals(req.user._id)) {
        const reelOwner = await User.findById(reel.owner).select('BlockedNotificationFromUsers');
        const isBlocked = reelOwner.BlockedNotificationFromUsers.some(
          id => id.toString() === req.user._id.toString()
        );

        if (!isBlocked) {
          await sendNotificationHelper({
            sender: req.user._id,
            receiver: reel.owner,
            content: 'liked your reel',
            type: 'like',
            actionRef: reel._id,
            actionModel: 'Reel',
          });
        }
      }
    }

    const updatedReel = await Reel.findById(req.params.id)
      .populate(reelPopulate);

    res.status(200).json(updatedReel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// مشاهدة Reel
const viewReel = asyncHandler(async (req, res) => {
  const reelId = req.params.id;

  const reel = await Reel.findById(reelId);
  if (!reel) return res.status(404).json({ message: "Reel not found" });

  const updatedReel = await Reel.findByIdAndUpdate(
    reelId,
    { $addToSet: { views: req.user._id } },
    { new: true }
  )
    .populate(reelPopulate)
    .populate("views", "username profilePhoto");

  res.status(200).json(updatedReel);
});

const shareReel = asyncHandler(async (req, res) => {
  const originalPost = await Reel.findById(req.params.id).populate(
    "owner",
    "username profileName profilePhoto"
  );

  if (!originalPost) {
    return res.status(404).json({ message: "Reel not found" });
  }

  const sharedReel = new Reel({
      videoUrl: originalPost.videoUrl,
      thumbnailUrl: originalPost.thumbnailUrl,
      caption: originalPost.caption,
      originalPost: originalPost._id,
      owner: req.user._id,
  });
  if (!originalPost.owner.equals(req.user._id)) {
    const reelOwner = await User.findById(originalPost.owner).select('BlockedNotificationFromUsers');
    const isBlocked = reelOwner.BlockedNotificationFromUsers.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isBlocked) {
      await sendNotificationHelper({
        sender: req.user._id,
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

  // ✅ رجع بوست كامل فقط
  res.status(201).json(sharedReel);
});



module.exports = { createReel, deleteReel, getAllReels,likeReel,viewReel,shareReel };
