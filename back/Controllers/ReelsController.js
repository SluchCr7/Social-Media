const asyncHandler = require("express-async-handler");
const reelService = require("../Services/reelService");

const send = (res, result) => res.status(result.status).json(result.body);

const createReel = asyncHandler(async (req, res) => send(res, await reelService.createReel({
    file: req.file,
    caption: req.body?.caption,
    userId: req.user._id
  })));

const deleteReel = asyncHandler(async (req, res) => send(res, await reelService.deleteReel({
  id: req.params.id,
  userId: req.user._id
})));

const getAllReels = asyncHandler(async (req, res) => send(res, await reelService.getAllReels(req.query)));

const likeReel = asyncHandler(async (req, res) => send(res, await reelService.likeReel({
  id: req.params.id,
  userId: req.user._id
})));

const viewReel = asyncHandler(async (req, res) => send(res, await reelService.viewReel({
  id: req.params.id,
  userId: req.user._id
})));

const shareReel = asyncHandler(async (req, res) => send(res, await reelService.shareReel({
  id: req.params.id,
  userId: req.user._id
})));

module.exports = { createReel, deleteReel, getAllReels, likeReel, viewReel, shareReel };
