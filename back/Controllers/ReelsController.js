const Reel = require('../Modules/Reel');
const { cloudRemove } = require('../Config/cloudUpload'); // خاصة بالصور
const { cloudUploadVideo } = require('../Config/cloudUploadVideo'); // خاصة بالفيديوهات
const { Notification } = require('../Modules/Notification');
const asyncHandler = require("express-async-handler");

// رفع Reel جديد
const createReel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video file uploaded" });

    const uploadResult = await cloudUploadVideo(req.file);

    const newReel = new Reel({
      videoUrl: uploadResult.secure_url,
      thumbnailUrl: uploadResult.secure_url, // ممكن تعمل دالة generate thumbnail بعدين
      caption: req.body.caption || "",
      owner: req.user._id,
    });

    await newReel.save();

    res.status(201).json({ message: "Reel uploaded successfully", reel: newReel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

const likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (reel.likes.includes(req.user._id)) {
      await Reel.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } }
      );
    } else {
      // إضافة لايك
      await Reel.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: req.user._id } }
      );

      // إنشاء إشعار لصاحب البوست
      // ✅ إرسال إشعار فقط إذا اللايك ليس على بوستك
      if (!reel.owner.equals(req.user._id)) {
        const newNotify = new Notification({
          content: "liked your reel",
          type: "like",
          sender: req.user._id,
          receiver: reel.owner,
          actionRef: reel._id,
          actionModel: "Reel",
        });
        await newNotify.save();

        // إرسال الإشعار عبر السوكيت إذا كان متصل
        const receiverSocketId = getReceiverSocketId(post.owner);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("notification", newNotify);
        }
      }
    }
  // جلب البوست كامل بعد التعديل مع كل populate
  const updatedPost = await Reel.findById(req.params.id)
    .populate("owner", "username profileName profilePhoto")
    // .populate({
    //   path: "comments",
    //   populate: { path: "owner", select: "username profileName profilePhoto" },
    // });

  res.status(200).json(updatedPost);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const viewReel = asyncHandler(async (req, res) => {
  const reelId = req.params.id;

  // البحث عن البوست
  const reel = await Reel.findById(reelId);
  if (!reel) {
    return res.status(404).json({ message: "Reel not found" });
  }

  // إضافة المستخدم الحالي لقائمة المشاهدات إذا لم يكن موجوداً مسبقاً
  const updatedReel = await Reel.findByIdAndUpdate(
    reelId,
    { $addToSet: { views: req.user._id } }, // $addToSet يمنع التكرار
    { new: true }
  )
    .populate('owner', 'username profilePhoto')
    .populate('views', 'username profilePhoto') // المستخدمين الذين شاهدوا البوست
    res.status(200).json({
      reel: updatedReel
    });
});

module.exports = { createReel, deleteReel, getAllReels,likeReel,viewReel };
