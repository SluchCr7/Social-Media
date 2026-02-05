const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { Music } = require("../Modules/Music");
const { User } = require("../Modules/User");
const { cloudUpload } = require("../Config/cloudUpload");
const { cloudUploadMusic } = require("../Config/cloudUploadMusic");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { Post } = require("../Modules/Post");
const { postPopulate } = require("../Populates/Populate");
const { io } = require("../Config/socket");
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

    // 🔔 Socket Emit
    io.emit("music:create", newMusic);

    res.status(201).json(newMusic);
  } catch (error) {
    console.error("❌ Error creating music:", error);
    res.status(500).json({ message: error.message });
  }
});



// ✅ جلب كل الأغاني مع دعم التصفية حسب النوع
const getAllMusic = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12; // زيادة الليميت الافتراضي قليلاً
  const skip = (page - 1) * limit;
  const genre = req.query.genre;

  const query = {};
  if (genre && genre !== "All") {
    query.genre = genre;
  }

  const [music, total] = await Promise.all([
    Music.find(query)
      .populate('owner', 'username profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Music.countDocuments(query)
  ]);

  res.status(200).json({
    page,
    limit,
    totalMusic: total,
    totalPages: Math.ceil(total / limit),
    music,
  });
});

// ✅ بحث عن الموسيقى
const searchMusic = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  const searchRegex = new RegExp(q, 'i');
  const music = await Music.find({
    $or: [
      { title: searchRegex },
      { artist: searchRegex },
      { album: searchRegex },
      { genre: searchRegex },
      { tags: { $in: [searchRegex] } }
    ]
  })
    .populate('owner', 'username profilePhoto')
    .limit(20)
    .lean();

  res.status(200).json(music);
});

// ✅ جلب التريند والأكثر شعبية
const getTopCharts = asyncHandler(async (req, res) => {
  const trending = await Music.find({ isTrending: true })
    .populate('owner', 'username profilePhoto')
    .sort({ listenCount: -1 })
    .limit(5)
    .lean();

  const popular = await Music.find({ isPopular: true })
    .populate('owner', 'username profilePhoto')
    .sort({ 'likes.length': -1 })
    .limit(10)
    .lean();

  res.status(200).json({ trending, popular });
});

// ✅ جلب موسيقى مشابهة (توصيات)
const getRecommendedMusic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const music = await Music.findById(id);
  if (!music) return res.status(404).json({ message: "Music not found" });

  const recommendations = await Music.find({
    genre: music.genre,
    _id: { $ne: music._id }
  })
    .populate('owner', 'username profilePhoto')
    .limit(6)
    .lean();

  res.status(200).json(recommendations);
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

  // التحقق من الملكية
  const music = await Music.findById(id);
  if (!music) return res.status(404).json({ message: "Music not found" });
  if (!music.owner.equals(req.user._id)) {
    return res.status(403).json({ message: "Access denied. You are not the owner." });
  }

  const { error } = musicValidation.validate(req.body);
  if (error)
    return res.status(400).json({ message: error.details[0].message });

  const updated = await Music.findByIdAndUpdate(id, req.body, { new: true })
    .populate("owner", "username profilePhoto");

  // 🔔 Socket Emit
  io.emit("music:update", updated);
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

  // التحقق من الملكية
  if (!music.owner.equals(req.user._id)) {
    return res.status(403).json({ message: "Access denied. You are not the owner." });
  }

  // حذف من Cloudinary (يفضل استخدام await)
  try {
    if (music.url) {
      // هنا نحتاج لدالة لحذف الموسيقى من كلاوديناري، سنفترض وجودها أو منطقها
      // const publicId = ...
      // await cloudinary.uploader.destroy(publicId, { resource_type: 'video' }); 
    }
  } catch (err) {
    console.warn("Cloudinary removal failed:", err);
  }

  await Music.findByIdAndDelete(id);

  // 🔔 Socket Emit
  io.emit("music:delete", id);

  res.json({ message: "Music deleted successfully" });
});

const toggleLike = asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id)
    .populate("owner", "username profilePhoto BlockedNotificationFromUsers");

  if (!music) return res.status(404).json({ message: "Music not found" });

  const hasLiked = music.likes.includes(req.user._id);

  if (hasLiked) {
    music.likes.pull(req.user._id);
  } else {
    music.likes.push(req.user._id);

    // إرسال إشعار إذا لم يكن المستخدم نفسه
    if (!music.owner._id.equals(req.user._id)) {
      const isBlocked = music.owner.BlockedNotificationFromUsers?.some(
        (blockedId) => blockedId.equals(req.user._id)
      );

      if (!isBlocked) {
        await sendNotificationHelper({
          sender: req.user._id,
          receiver: music.owner._id,
          content: "liked your music 🎵",
          type: "like",
          actionRef: music._id,
          actionModel: "Music",
        });
      }
    }
  }

  // تحديث حالة الشهرة بناءً على عدد اللايكات
  await music.updatePopularity({ threshold: 5 }); // خفضنا الـ threshold للتجربة أو نجعله دايناميك

  // تحديث الحالة ليكون "تريند" لو تجاوز عدد معين من اللايكات في وقت قصير (هنا تبسيط)
  if (music.likes.length >= 10) {
    music.isTrending = true;
  }

  await music.save();

  // ✅ أعد البيانات كاملة
  const updatedMusic = await Music.findById(req.params.id)
    .populate("owner", "username profilePhoto")
    .lean();

  // 🔔 Socket Emit
  io.emit("music:update", updatedMusic);

  res.status(200).json({
    success: true,
    message: hasLiked ? "Like removed" : "Music liked",
    music: updatedMusic,
  });
});


// ✅ إضافة مشاهدة
const addView = asyncHandler(async (req, res) => {
  const musicId = req.params.id;

  const music = await Music.findById(musicId);
  if (!music) return res.status(404).json({ message: "Music not found" });

  // استخدام $inc لزيادة المشاهدات بدلاً من $addToSet لو كنا نريد عد المرات وليس المستخدمين الفريدين
  // أو البقاء على $addToSet لو كان المطلوب مستخدمين فريدين. 
  // الموديل الحالي views هو Number في Music.js (line 41).

  const updatedMusic = await Music.findByIdAndUpdate(
    musicId,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("owner", "username profilePhoto");



  // 🔔 Socket Emit
  io.emit("music:update", updatedMusic);

  res.status(200).json(updatedMusic);
});

const addListen = asyncHandler(async (req, res) => {
  const musicId = req.params.id;

  const music = await Music.findById(musicId);
  if (!music) {
    return res.status(404).json({ message: "Music not found" });
  }

  // ✅ زيادة عدد المشاهدات (الاستماعات) بمقدار 1
  const updatedMusic = await Music.findByIdAndUpdate(
    musicId,
    { $inc: { listenCount: 1 } },
    { new: true }
  ).populate("owner", "username profilePhoto");



  // 🔔 Socket Emit
  io.emit("music:update", updatedMusic);

  res.status(200).json(updatedMusic);
});

const shareMusicAsPost = asyncHandler(async (req, res) => {
  const { id: musicId } = req.params;
  const { customText } = req.body;

  // ✅ التحقق من وجود الموسيقى
  const music = await Music.findById(musicId);
  if (!music) {
    return res.status(404).json({ message: "Music not found" });
  }

  // ✅ إنشاء بوست جديد مرتبط بالموسيقى
  const sharedPost = await Post.create({
    text: customText?.trim() || "",
    owner: req.user._id,
    isShared: true,
    music: music._id,
  });

  // ✅ populate للبيانات المرتبطة
  const populatedPost = await Post.findById(sharedPost._id)
    .populate(postPopulate);

  return res.status(201).json({
    message: "Music shared successfully as a post",
    post: populatedPost,
  });
});

module.exports = {
  createMusic,
  getAllMusic,
  getMusicById,
  updateMusic,
  deleteMusic,
  toggleLike,
  addView,
  addListen,
  shareMusicAsPost,
  searchMusic,
  getTopCharts,
  getRecommendedMusic
};

