const Reel = require('../Modules/Reel');
const { cloudUpload, cloudRemove } = require('../Config/cloudUpload'); // المسار حسب مشروعك

// رفع Reel جديد
const createReel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No video file uploaded" });

    const uploadResult = await cloudUpload(req.file);

    const newReel = new Reel({
      videoUrl: uploadResult.secure_url,
      thumbnailUrl: uploadResult.secure_url,
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

    const publicId = reel.videoUrl.split('/').pop().split('.')[0];
    await cloudRemove(publicId);

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

    res.status(200).json({
      page,
      limit,
      totalReels,
      totalPages: Math.ceil(totalReels / limit),
      reels
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createReel, deleteReel, getAllReels };
