const mongoose = require("mongoose");
const { Music, musicValidation } = require("../Modules/Music");
const { User } = require("../Modules/User");
const { cloudUpload } = require("../Config/cloudUpload");
const { cloudUploadMusic } = require("../Config/cloudUploadMusic");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { Post } = require("../Modules/Post");
const { postPopulate } = require("../Populates/Populate");
const { io } = require("../Config/socket");

const response = (status, body) => ({ status, body });

const normalizeGenre = (genre) => {
  const supportedGenres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Lo-Fi", "Electronic", "Ambient", "Trap", "Other"];
  return supportedGenres.includes(genre) ? genre : "Other";
};

const normalizeMusicPayload = (item) => {
  if (!item) return null;
  const title = typeof item.title === "string" ? item.title.trim() : "";
  const artist = typeof item.artist === "string" ? item.artist.trim() : "";
  const url = typeof item.url === "string" ? item.url.trim() : "";
  if (!title || !artist || !url) return null;

  return {
    ...item,
    title,
    artist,
    album: typeof item.album === "string" && item.album.trim() ? item.album.trim() : "Single",
    genre: normalizeGenre(item.genre),
    cover: typeof item.cover === "string" && item.cover.trim() ? item.cover : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
    language: typeof item.language === "string" && item.language.trim() ? item.language : "Unknown",
  };
};

const createMusic = async ({ files, body, userId }) => {
  const audioFile = files?.audio?.[0];
  if (!audioFile) return response(400, { message: "Audio file is required" });
  if (!userId) return response(401, { message: "Authentication required" });

  const mm = await import("music-metadata");
  let durationInSeconds = 0;
  try {
    const metadata = await mm.parseBuffer(audioFile.buffer, "audio/mpeg");
    durationInSeconds = Math.round(metadata.format.duration || 0);
  } catch (err) {
    console.warn("⚠️ Failed to read metadata:", err.message);
  }

  const audioUpload = await cloudUploadMusic(audioFile);
  if (!audioUpload?.secure_url) {
    return response(500, { message: "Audio upload failed" });
  }

  let coverUrl = null;
  if (files.image?.[0]) {
    const coverUpload = await cloudUpload(files.image[0]);
    coverUrl = coverUpload.secure_url;
  }

  const newMusic = new Music({
    title: body.title,
    artist: body.artist,
    album: body.album || "Single",
    genre: normalizeGenre(body.genre),
    url: audioUpload.secure_url,
    cover: coverUrl,
    duration: durationInSeconds,
    owner: userId,
    tags: Array.isArray(body.tags) ? body.tags : [],
    releaseDate: Date.now(),
    language: body.language || "Unknown",
  });

  await newMusic.save();
  const user = await User.findById(userId);
  user.userLevelPoints += 10;
  user.updateLevelRank();
  await user.save();
  await newMusic.populate("owner", "username profilePhoto");
  io.emit("music:create", newMusic);

  const responseMusic = normalizeMusicPayload(newMusic.toObject ? newMusic.toObject() : newMusic);
  return response(201, responseMusic || newMusic);
};

const getAllMusic = async ({ page: pageQuery, limit: limitQuery, genre }) => {
  const page = parseInt(pageQuery) || 1;
  const limit = parseInt(limitQuery) || 12;
  const skip = (page - 1) * limit;
  const query = {};
  if (genre && genre !== "All") query.genre = genre;

  const [music, total] = await Promise.all([
    Music.find(query)
      .populate('owner', 'username profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Music.countDocuments(query)
  ]);
  const normalizedMusic = (music || []).map(normalizeMusicPayload).filter(Boolean);
  return response(200, {
    page,
    limit,
    totalMusic: total,
    totalPages: Math.ceil(total / limit),
    music: normalizedMusic,
  });
};

const searchMusic = async (q) => {
  if (!q) return response(200, []);

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
  return response(200, (music || []).map(normalizeMusicPayload).filter(Boolean));
};

const getTopCharts = async () => {
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
  return response(200, {
    trending: (trending || []).map(normalizeMusicPayload).filter(Boolean),
    popular: (popular || []).map(normalizeMusicPayload).filter(Boolean),
  });
};

const getRecommendedMusic = async (id) => {
  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });

  const recommendations = await Music.find({
    genre: music.genre,
    _id: { $ne: music._id }
  })
    .populate('owner', 'username profilePhoto')
    .limit(6)
    .lean();
  return response(200, (recommendations || []).map(normalizeMusicPayload).filter(Boolean));
};

const getMusicById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response(400, { message: "Invalid music ID" });
  }
  const music = await Music.findById(id).populate("owner", "username profilePhoto");
  if (!music) return response(404, { message: "Music not found" });
  return response(200, music);
};

const updateMusic = async ({ id, body, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response(400, { message: "Invalid music ID" });
  }

  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });
  if (!music.owner.equals(userId)) {
    return response(403, { message: "Access denied. You are not the owner." });
  }

  const { error } = musicValidation.validate(body, { abortEarly: false });
  if (error) return response(400, { message: error.details[0].message });

  const payload = {
    ...body,
    genre: body.genre ? normalizeGenre(body.genre) : undefined,
  };
  const updated = await Music.findByIdAndUpdate(id, payload, { new: true })
    .populate("owner", "username profilePhoto");
  io.emit("music:update", updated);
  return response(200, updated);
};

const deleteMusic = async ({ id, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response(400, { message: "Invalid music ID" });
  }

  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });
  if (!music.owner.equals(userId)) {
    return response(403, { message: "Access denied. You are not the owner." });
  }

  try {
    if (music.url) {
      // Cloud media removal is intentionally not performed here.
    }
  } catch (err) {
    console.warn("Cloudinary removal failed:", err);
  }

  await Music.findByIdAndDelete(id);
  io.emit("music:delete", id);
  return response(200, { message: "Music deleted successfully" });
};

const toggleLike = async ({ id, userId }) => {
  const music = await Music.findById(id)
    .populate("owner", "username profilePhoto BlockedNotificationFromUsers");
  if (!music) return response(404, { message: "Music not found" });

  const hasLiked = music.likes.includes(userId);
  if (hasLiked) {
    music.likes.pull(userId);
  } else {
    music.likes.push(userId);
    if (!music.owner._id.equals(userId)) {
      const isBlocked = music.owner.BlockedNotificationFromUsers?.some(
        (blockedId) => blockedId.equals(userId)
      );
      if (!isBlocked) {
        await sendNotificationHelper({
          sender: userId,
          receiver: music.owner._id,
          content: "liked your music 🎵",
          type: "like",
          actionRef: music._id,
          actionModel: "Music",
        });
      }
    }
  }

  await music.updatePopularity({ threshold: 5 });
  if (music.likes.length >= 10) music.isTrending = true;
  await music.save();

  const updatedMusic = await Music.findById(id)
    .populate("owner", "username profilePhoto")
    .lean();
  io.emit("music:update", updatedMusic);
  return response(200, {
    success: true,
    message: hasLiked ? "Like removed" : "Music liked",
    music: updatedMusic,
  });
};

const addView = async (id) => {
  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });
  const updatedMusic = await Music.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username profilePhoto");
  io.emit("music:update", updatedMusic);
  return response(200, updatedMusic);
};

const addListen = async (id) => {
  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });
  const updatedMusic = await Music.findByIdAndUpdate(
    id,
    { $inc: { listenCount: 1 } },
    { new: true }
  ).populate("owner", "username profilePhoto");
  io.emit("music:update", updatedMusic);
  return response(200, updatedMusic);
};

const shareMusicAsPost = async ({ id, customText, userId }) => {
  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });

  const sharedPost = await Post.create({
    text: customText?.trim() || "",
    owner: userId,
    isShared: true,
    music: music._id,
  });
  const populatedPost = await Post.findById(sharedPost._id)
    .populate(postPopulate);
  return response(201, {
    message: "Music shared successfully as a post",
    post: populatedPost,
  });
};

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
