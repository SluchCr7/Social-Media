const {Music,musicValidation} = require('../Modules/Music');
const mongoose = require('mongoose');
const {cloudUploadMusic, cloudRemoveMusic} = require('../Config/cloudUploadMusic');
const { User } = require('../Modules/User');
const { sendNotificationHelper } = require('../utils/SendNotification');
// ✅ إضافة أغنية جديدة
const asyncHandler = require("express-async-handler");

const createMusic = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No Music file uploaded" });

  const uploadResult = await cloudUploadMusic(req.file);
     
  const newMusic = new Music({
    url: uploadResult.secure_url,
    cover: uploadResult.secure_url || "",
    owner: req.user._id,
    genre: req.body.genre,
    title: req.body.title,
    artist: req.body.artist,
    album : req.body.album,
  });
    await newMusic.save();
  const user = await User.findById(req.user._id);
  user.userLevelPoints += 10;
  user.updateLevelRank();
  await user.save();

  await newMusic.populate("owner", "username profilePhoto");

  res.status(201).json(newMusic);
});


// ✅ الحصول على كل الأغاني
const getAllMusic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const music = await Music.find()
      .populate('owner', 'username profileName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalMusic = await Music.countDocuments();
    const pages = Math.ceil(totalMusic / limit);

    res.status(200).json({
      page,
      limit,
      totalMusic,
      totalPages: pages,
      music,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ الحصول على أغنية واحدة
const getMusicById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

        const music = await Music.findById(id).populate("owner", "username profilePhoto");
        if (!music) return res.status(404).json({ error: "Music not found" });

        res.json(music);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ تحديث بيانات أغنية
const updateMusic = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

        const { error } = musicValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updated = await Music.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Music not found" });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ حذف أغنية
const deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

        const deleted = await Music.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Music not found" });

        res.json({ message: "Music deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const toggleLike = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ message: "Music not found" });

    if (music.likes.includes(req.user._id)) {
      await Music.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } });
    } else {
      await Music.findByIdAndUpdate(req.params.id, { $push: { likes: req.user._id } });

      if (!music.owner.equals(req.user._id)) {
        await sendNotificationHelper({
          sender: req.user._id,
          receiver: music.owner,
          content: "liked your Music",
          type: "like",
          actionRef: music._id,
          actionModel: "Music",
        });
      }
    }

    const updatedMusic = await Music.findById(req.params.id)
      .populate("owner", "username profilePhoto");

    res.status(200).json(updatedMusic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addView = asyncHandler(async (req, res) => {
  const musicId = req.params.id;

  const music = await Music.findById(musicId);
  if (!music) return res.status(404).json({ message: "Music not found" });

  const updatedMusic = await Music.findByIdAndUpdate(
    musicId,
    { $addToSet: { views: req.user._id } },
    { new: true }
  )
    .populate("owner", "username profilePhoto")
    .populate("views", "username profilePhoto");

  res.status(200).json(updatedMusic);
});


module.exports = {addView , toggleLike, deleteMusic, updateMusic, getMusicById, getAllMusic, createMusic}