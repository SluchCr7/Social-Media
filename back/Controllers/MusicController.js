const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { Music } = require("../Modules/Music");
const { User } = require("../Modules/User");
const { cloudUpload } = require("../Config/cloudUpload");
const { cloudUploadMusic } = require("../Config/cloudUploadMusic");

const createMusic = asyncHandler(async (req, res) => {
  try {
    const audioFile = req.files?.audio?.[0];
    if (!audioFile) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    // ✅ استدعاء ديناميكي للمكتبة داخل الدالة
    const mm = await import("music-metadata");

    // 🎧 قراءة metadata من Buffer مباشرة
    let durationInSeconds = 0;
    try {
      const metadata = await mm.parseBuffer(audioFile.buffer, "audio/mpeg");
      durationInSeconds = Math.round(metadata.format.duration || 0);
    } catch (err) {
      console.warn("⚠️ Failed to read metadata:", err.message);
    }

    // ☁️ رفع الصوت
    const audioUpload = await cloudUploadMusic(audioFile);
    if (!audioUpload?.secure_url) {
      return res.status(500).json({ message: "Audio upload failed" });
    }

    // ☁️ رفع الصورة (اختياري)
    let coverUrl = null;
    if (req.files.image?.[0]) {
      const coverUpload = await cloudUpload(req.files.image[0]);
      coverUrl = coverUpload.secure_url;
    }

    // 📝 إنشاء وثيقة الموسيقى
    const newMusic = new Music({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album || "Single",
      genre: req.body.genre || "Other",
      url: audioUpload.secure_url,
      cover: coverUrl,
      duration: durationInSeconds,
      owner: req.user._id,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      releaseDate: Date.now(),
      language: req.body.language || "Unknown",
    });

    await newMusic.save();

    // 🔼 تحديث مستوى المستخدم
    const user = await User.findById(req.user._id);
    user.userLevelPoints += 10;
    user.updateLevelRank();
    await user.save();

    await newMusic.populate("owner", "username profilePhoto");

    res.status(201).json(newMusic);
  } catch (error) {
    console.error("❌ Error creating music:", error);
    res.status(500).json({ message: error.message });
  }
});



// ✅ جلب كل الأغاني
const getAllMusic = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [music, total] = await Promise.all([
    Music.find()
      .populate('owner', 'username profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Music.countDocuments()
  ]);

  res.status(200).json({
    page,
    limit,
    totalMusic: total,
    totalPages: Math.ceil(total / limit),
    music,
  });
});

// ✅ جلب أغنية واحدة
const getMusicById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid music ID" });

  const music = await Music.findById(id)
    .populate("owner", "username profilePhoto");
  if (!music)
    return res.status(404).json({ message: "Music not found" });

  res.json(music);
});

// ✅ تحديث أغنية
const updateMusic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid music ID" });

  const { error } = musicValidation.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message });

  const updated = await Music.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated)
    return res.status(404).json({ message: "Music not found" });

  res.json(updated);
});

// ✅ حذف أغنية
const deleteMusic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid music ID" });

  const music = await Music.findById(id);
  if (!music)
    return res.status(404).json({ message: "Music not found" });

  // حذف من Cloudinary
  if (music.url) await cloudRemoveMusic(music.url);
  await Music.findByIdAndDelete(id);

  res.json({ message: "Music deleted successfully" });
});

// ✅ لايك/إلغاء لايك
const toggleLike = asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);
  if (!music) return res.status(404).json({ message: "Music not found" });

  const userId = req.user._id;
  const alreadyLiked = music.likes.includes(userId);

  if (alreadyLiked) {
    // إزالة اللايك
    music.likes.pull(userId);
  } else {
    // إضافة اللايك
    music.likes.push(userId);

    // إرسال إشعار للمالك إذا كان المستخدم ليس هو المالك
    if (!music.owner.equals(userId)) {
      await sendNotificationHelper({
        sender: userId,
        receiver: music.owner,
        content: "liked your music",
        type: "like",
        actionRef: music._id,
        actionModel: "Music",
      });
    }
  }

  // تحديث الشعبية باستخدام الـmethod الجديدة
  await music.updatePopularity({ threshold: 50 }); // يمكن تعديل threshold حسب الحاجة

  // تعبئة بيانات المالك للعرض
  await music.populate("owner", "username profilePhoto");

  res.status(200).json(music);
});


// ✅ إضافة مشاهدة
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

module.exports = {
  createMusic,
  getAllMusic,
  getMusicById,
  updateMusic,
  deleteMusic,
  toggleLike,
  addView,
};
