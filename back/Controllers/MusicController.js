const asyncHandler = require("express-async-handler");
const musicService = require("../Services/musicService");

const send = (res, result) => res.status(result.status).json(result.body);

const createMusic = asyncHandler(async (req, res) => {
  try {
    return send(res, await musicService.createMusic({
      files: req.files,
      body: req.body,
      userId: req.user?._id
    }));
  } catch (error) {
    console.error("❌ Error creating music:", error);
    return res.status(500).json({ message: error.message });
  }
});

const getAllMusic = asyncHandler(async (req, res) => {
  return send(res, await musicService.getAllMusic(req.query));
});

const searchMusic = asyncHandler(async (req, res) => {
  return send(res, await musicService.searchMusic(req.query.q));
});

const getTopCharts = asyncHandler(async (req, res) => {
  return send(res, await musicService.getTopCharts());
});

const getRecommendedMusic = asyncHandler(async (req, res) => {
  return send(res, await musicService.getRecommendedMusic(req.params.id));
});

const getMusicById = asyncHandler(async (req, res) => {
  return send(res, await musicService.getMusicById(req.params.id));
});

const updateMusic = asyncHandler(async (req, res) => {
  return send(res, await musicService.updateMusic({
    id: req.params.id,
    body: req.body,
    userId: req.user._id
  }));
});

const deleteMusic = asyncHandler(async (req, res) => {
  return send(res, await musicService.deleteMusic({
    id: req.params.id,
    userId: req.user._id
  }));
});

const toggleLike = asyncHandler(async (req, res) => {
  return send(res, await musicService.toggleLike({
    id: req.params.id,
    userId: req.user._id
  }));
});

const addView = asyncHandler(async (req, res) => {
  return send(res, await musicService.addView(req.params.id));
});

const addListen = asyncHandler(async (req, res) => {
  return send(res, await musicService.addListen(req.params.id));
});

const shareMusicAsPost = asyncHandler(async (req, res) => {
  return send(res, await musicService.shareMusicAsPost({
    id: req.params.id,
    customText: req.body.customText,
    userId: req.user._id
  }));
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
