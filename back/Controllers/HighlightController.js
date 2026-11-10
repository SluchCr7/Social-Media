const asyncHandler = require("express-async-handler");
const highlightService = require("../Services/highlightService");

const send = (res, result) => res.status(result.status).json(result.body);

const createHighlight = asyncHandler(async (req, res) => {
  return send(res, await highlightService.createHighlight({
    body: req.body,
    file: req.file,
    userId: req.user._id
  }));
});

const getUserHighlights = asyncHandler(async (req, res) => {
  return send(res, await highlightService.getUserHighlights(req.params.userId));
});

const getHighlightById = asyncHandler(async (req, res) => {
  return send(res, await highlightService.getHighlightById(req.params.id));
});

const deleteHighlight = asyncHandler(async (req, res) => {
  return send(res, await highlightService.deleteHighlight({
    id: req.params.id,
    userId: req.user._id
  }));
});

const addStoryToHighlight = asyncHandler(async (req, res) => {
  return send(res, await highlightService.addStoryToHighlight({
    highlightId: req.params.highlightId,
    body: req.body,
    userId: req.user?._id
  }));
});

const updateHighlight = asyncHandler(async (req, res) => {
  return send(res, await highlightService.updateHighlight({
    id: req.params.id,
    body: req.body,
    file: req.file,
    userId: req.user._id
  }));
});

const removeStoryFromHighlight = asyncHandler(async (req, res) => {
  return send(res, await highlightService.removeStoryFromHighlight({
    highlightId: req.params.highlightId,
    storyId: req.params.storyId,
    userId: req.user?._id
  }));
});

const updateStoriesOrder = asyncHandler(async (req, res) => {
  return send(res, await highlightService.updateStoriesOrder({
    highlightId: req.params.highlightId,
    storyIds: req.body.storyIds,
    userId: req.user._id
  }));
});

const reorderHighlights = asyncHandler(async (req, res) => {
  return send(res, await highlightService.reorderHighlights({
    highlightIds: req.body.highlightIds,
    userId: req.user._id
  }));
});

module.exports = {
  createHighlight,
  getUserHighlights,
  getHighlightById,
  deleteHighlight,
  addStoryToHighlight,
  updateHighlight,
  removeStoryFromHighlight,
  reorderHighlights,
  updateStoriesOrder
};
