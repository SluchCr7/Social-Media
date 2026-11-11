const mongoose = require("mongoose");
const { Music, musicValidation } = require("../Modules/Music");
const { User } = require("../Modules/User");
const { cloudRemoveMusic, cloudUploadMusic } = require("../Config/cloudUploadMusic");
const { cloudUpload, cloudRemove } = require("../Config/cloudUpload");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { Post } = require("../Modules/Post");
const { postPopulate } = require("../Populates/Populate");
const { io } = require("../Config/socket");

const response = (status, body) => ({ status, body });
const MAX_PAGE = 10000;
const MAX_LIMIT = 50;
const MAX_AUDIO_SIZE = 25 * 1024 * 1024;
const MAX_ARTWORK_SIZE = 8 * 1024 * 1024;
const DEFAULT_COVER = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80";

const normalizeGenre = (genre) => {
  const supportedGenres = ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Lo-Fi", "Electronic", "Ambient", "Trap", "Other"];
  return supportedGenres.includes(genre) ? genre : "Other";
};

const parseBoundedInteger = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getCloudinaryPublicId = (url) => {
  try {
    const uploadPath = new URL(url).pathname.split("/upload/")[1];
    if (!uploadPath) return null;
    const segments = uploadPath.split("/");
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    if (versionIndex < 0 || versionIndex === segments.length - 1) return null;
    return segments.slice(versionIndex + 1).join("/").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
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
    cover: typeof item.cover === "string" && item.cover.trim() ? item.cover : DEFAULT_COVER,
    language: typeof item.language === "string" && item.language.trim() ? item.language : "Unknown",
  };
};

const createMusic = async ({ files, body, userId }) => {
  const audioFile = files?.audio?.[0];
  if (!audioFile) return response(400, { message: "Audio file is required" });
  if (!userId) return response(401, { message: "Authentication required" });
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const artist = typeof body?.artist === "string" ? body.artist.trim() : "";
  if (!title || title.length > 120) return response(400, { message: "Title is required and must be 120 characters or fewer" });
  if (!artist || artist.length > 120) return response(400, { message: "Artist is required and must be 120 characters or fewer" });
  if (audioFile.size > MAX_AUDIO_SIZE) return response(413, { message: "Audio file must be 25 MB or smaller" });
  if (files?.image?.[0]?.size > MAX_ARTWORK_SIZE) {
    return response(413, { message: "Artwork must be 8 MB or smaller" });
  }

  let audioUpload;
  let coverUpload;
  let newMusic;
  let musicCreated = false;
  try {
    const mm = await import("music-metadata");
    let durationInSeconds = 0;
    try {
      const metadata = await mm.parseBuffer(audioFile.buffer, { mimeType: audioFile.mimetype });
      durationInSeconds = Math.round(metadata.format.duration || 0);
    } catch (error) {
      console.warn("Music metadata could not be read; continuing with unknown duration:", error.message);
    }

    audioUpload = await cloudUploadMusic(audioFile);
    if (!audioUpload?.secure_url || !audioUpload?.public_id) {
      throw new Error("Audio upload failed");
    }

    if (files?.image?.[0]) {
      coverUpload = await cloudUpload(files.image[0]);
      if (!coverUpload?.secure_url || !coverUpload?.public_id) {
        throw new Error("Artwork upload failed");
      }
    }

    const rawTags = body?.tags ?? body?.["tags[]"] ?? [];
    const tags = (Array.isArray(rawTags) ? rawTags : [rawTags])
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.trim().slice(0, 40))
      .filter(Boolean)
      .slice(0, 20);
    newMusic = await Music.create({
      title,
      artist,
      album: typeof body.album === "string" && body.album.trim() ? body.album.trim().slice(0, 120) : "Single",
      genre: normalizeGenre(body.genre),
      url: audioUpload.secure_url,
      publicId: audioUpload.public_id,
      cover: coverUpload?.secure_url || DEFAULT_COVER,
      coverPublicId: coverUpload?.public_id,
      duration: durationInSeconds,
      owner: userId,
      tags,
      releaseDate: Date.now(),
      language: typeof body.language === "string" && body.language.trim() ? body.language.trim().slice(0, 40) : "Unknown",
    });
    musicCreated = true;

    try {
      const user = await User.findById(userId);
      if (user) {
        user.userLevelPoints += 10;
        user.updateLevelRank();
        await user.save();
      }
    } catch (error) {
      console.error("Music was uploaded, but uploader points could not be updated:", error);
    }

    await newMusic.populate("owner", "username profilePhoto");
    io.emit("music:create", newMusic);
    return response(201, normalizeMusicPayload(newMusic.toObject()));
  } catch (error) {
    if (musicCreated) {
      console.error("Music was created, but response enrichment failed:", error);
      return response(201, normalizeMusicPayload(newMusic.toObject()));
    }
    if (audioUpload?.public_id) {
      try {
        await cloudRemoveMusic(audioUpload.public_id);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded audio after music creation failed:", cleanupError);
      }
    }
    if (coverUpload?.public_id) {
      try {
        await cloudRemove(coverUpload.public_id);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded artwork after music creation failed:", cleanupError);
      }
    }
    throw error;
  }
};

const getAllMusic = async ({ page: pageQuery, limit: limitQuery, genre }) => {
  const page = parseBoundedInteger(pageQuery, 1, 1, MAX_PAGE);
  const limit = parseBoundedInteger(limitQuery, 12, 1, MAX_LIMIT);
  const skip = (page - 1) * limit;
  const query = {};
  if (genre && genre !== "All") {
    const supportedGenre = normalizeGenre(genre);
    if (supportedGenre !== genre) return response(400, { message: "Unsupported music genre" });
    query.genre = supportedGenre;
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
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  if (!query) return response(200, []);

  const searchRegex = new RegExp(escapeRegex(query), "i");
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
  const popular = await Music.aggregate([
    { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
    { $sort: { likesCount: -1, listenCount: -1, createdAt: -1 } },
    { $limit: 10 },
  ]);
  await Music.populate(popular, { path: "owner", select: "username profilePhoto" });
  return response(200, {
    trending: (trending || []).map(normalizeMusicPayload).filter(Boolean),
    popular: (popular || []).map(normalizeMusicPayload).filter(Boolean),
  });
};

const getRecommendedMusic = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return response(400, { message: "Invalid music ID" });
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

  const { error, value } = musicValidation.validate(body, { abortEarly: false });
  if (error) return response(400, { message: error.details[0].message });

  const payload = {
    ...value,
    ...(value.genre ? { genre: normalizeGenre(value.genre) } : {}),
  };
  const updated = await Music.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true })
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

  await Music.findByIdAndDelete(id);
  try {
    await User.updateMany(
      { myMusicPlaylist: { $in: [id, new mongoose.Types.ObjectId(id)] } },
      { $pull: { myMusicPlaylist: { $in: [id, new mongoose.Types.ObjectId(id)] } } }
    );
  } catch (error) {
    console.error("Music was deleted, but saved playlists could not be cleaned up:", error);
  }
  io.emit("music:delete", id);
  const audioPublicId = music.publicId || getCloudinaryPublicId(music.url);
  if (audioPublicId) {
    try {
      await cloudRemoveMusic(audioPublicId);
    } catch (error) {
      console.error("Music was deleted, but Cloudinary audio cleanup failed:", error);
    }
  }
  if (music.coverPublicId) {
    try {
      await cloudRemove(music.coverPublicId);
    } catch (error) {
      console.error("Music was deleted, but Cloudinary artwork cleanup failed:", error);
    }
  }
  return response(200, { message: "Music deleted successfully" });
};

const toggleLike = async ({ id, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return response(400, { message: "Invalid music ID" });
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const currentLikes = { $ifNull: ["$likes", []] };
  const nextLikes = {
    $cond: [
      { $in: [userObjectId, currentLikes] },
      {
        $filter: {
          input: currentLikes,
          as: "likedBy",
          cond: { $ne: ["$$likedBy", userObjectId] },
        },
      },
      { $setUnion: [currentLikes, [userObjectId]] },
    ],
  };
  const previous = await Music.findOneAndUpdate(
    { _id: id },
    [{
      $set: {
        likes: nextLikes,
        isPopular: {
          $or: [
            { $gte: [{ $size: nextLikes }, 5] },
            { $gte: [{ $ifNull: ["$listenCount", 0] }, 50] },
          ],
        },
        isTrending: {
          $or: [
            { $gte: [{ $size: nextLikes }, 10] },
            { $gte: [{ $ifNull: ["$listenCount", 0] }, 10] },
          ],
        },
      },
    }],
    { new: false }
  ).populate("owner", "username profilePhoto BlockedNotificationFromUsers");
  if (!previous) return response(404, { message: "Music not found" });

  const hasLiked = previous.likes.some((likedBy) => likedBy.equals(userObjectId));
  const owner = previous.owner;
  if (!hasLiked && owner && !owner._id.equals(userObjectId)) {
    const isBlocked = owner.BlockedNotificationFromUsers?.some((blockedId) => blockedId.equals(userObjectId));
    if (!isBlocked) {
      try {
        await sendNotificationHelper({
          sender: userObjectId,
          receiver: owner._id,
          content: "liked your music",
          type: "like",
          actionRef: previous._id,
          actionModel: "Music",
        });
      } catch (error) {
        console.error("Music like was saved, but its notification could not be sent:", error);
      }
    }
  }

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
  if (!mongoose.Types.ObjectId.isValid(id)) return response(400, { message: "Invalid music ID" });
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
  if (!mongoose.Types.ObjectId.isValid(id)) return response(400, { message: "Invalid music ID" });
  const updatedMusic = await Music.findByIdAndUpdate(
    id,
    [{
      $set: {
        listenCount: { $add: [{ $ifNull: ["$listenCount", 0] }, 1] },
        isTrending: {
          $or: [
            { $gte: [{ $size: { $ifNull: ["$likes", []] } }, 10] },
            { $gte: [{ $add: [{ $ifNull: ["$listenCount", 0] }, 1] }, 10] },
          ],
        },
        isPopular: {
          $or: [
            { $gte: [{ $size: { $ifNull: ["$likes", []] } }, 5] },
            { $gte: [{ $add: [{ $ifNull: ["$listenCount", 0] }, 1] }, 50] },
          ],
        },
      },
    }],
    { new: true }
  ).populate("owner", "username profilePhoto");
  if (!updatedMusic) return response(404, { message: "Music not found" });
  io.emit("music:update", updatedMusic);
  return response(200, updatedMusic);
};

const shareMusicAsPost = async ({ id, customText, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return response(400, { message: "Invalid music ID" });
  if (typeof customText === "string" && customText.length > 2200) {
    return response(400, { message: "Post text must be 2200 characters or fewer" });
  }
  const music = await Music.findById(id);
  if (!music) return response(404, { message: "Music not found" });

  const sharedPost = await Post.create({
    text: typeof customText === "string" ? customText.trim() : "",
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
