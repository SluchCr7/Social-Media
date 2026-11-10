const asyncHandler = require("express-async-handler");
const reelService = require("../Services/reelService");

const send = (res, result) => res.status(result.status).json(result.body);

const createReel = asyncHandler(async (req, res) => {
  return send(res, await reelService.createReel({
    file: req.file,
    caption: req.body.caption,
    userId: req.user._id
  }));
});

const deleteReel = async (req, res) => {
  try {
    return send(res, await reelService.deleteReel({
      id: req.params.id,
      userId: req.user._id
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllReels = async (req, res) => {
  try {
    return send(res, await reelService.getAllReels(req.query));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const likeReel = async (req, res) => {
  try {
    return send(res, await reelService.likeReel({
      id: req.params.id,
      userId: req.user._id
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const viewReel = asyncHandler(async (req, res) => {
  return send(res, await reelService.viewReel({
    id: req.params.id,
    userId: req.user._id
  }));
});

const shareReel = asyncHandler(async (req, res) => {
  return send(res, await reelService.shareReel({
    id: req.params.id,
    userId: req.user._id
  }));
});

module.exports = { createReel, deleteReel, getAllReels, likeReel, viewReel, shareReel };
