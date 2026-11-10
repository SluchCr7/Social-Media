const asyncHandler = require("express-async-handler");
const storyService = require("../Services/storyService");

const send = (res, result) => res.status(result.status).json(result.body);

const addNewStory = asyncHandler(async (req, res) => {
  return send(res, await storyService.addNewStory({
    body: req.body,
    file: req.file,
    userId: req.user._id
  }));
});

const getAllStories = asyncHandler(async (req, res) => {
  return send(res, await storyService.getAllStories(req.user));
});

const deleteStory = asyncHandler(async (req, res) => {
  return send(res, await storyService.deleteStory({
    id: req.params.id,
    userId: req.user._id
  }));
});

const getStoriesById = asyncHandler(async (req, res) => {
  return send(res, await storyService.getStoriesById({
    id: req.params.id,
    user: req.user
  }));
});

const viewStory = asyncHandler(async (req, res) => {
  return send(res, await storyService.viewStory({
    id: req.params.id,
    userId: req.user._id
  }));
});

const toggleLoveStory = asyncHandler(async (req, res) => {
  return send(res, await storyService.toggleLoveStory({
    id: req.params.id,
    userId: req.user._id
  }));
});

const reactToStory = asyncHandler(async (req, res) => {
  return send(res, await storyService.reactToStory({
    id: req.params.id,
    userId: req.user._id,
    emoji: req.body.emoji
  }));
});

const getStoryViewers = asyncHandler(async (req, res) => {
  return send(res, await storyService.getStoryViewers({
    id: req.params.id,
    userId: req.user._id
  }));
});

const getRecentStories = asyncHandler(async (req, res) => {
  return send(res, await storyService.getRecentStories());
});

const getUserStories = asyncHandler(async (req, res) => {
  return send(res, await storyService.getUserStories(req.params.id));
});

const getUserArchivedStories = asyncHandler(async (req, res) => {
  return send(res, await storyService.getUserArchivedStories(req.params.id));
});

const shareStory = asyncHandler(async (req, res) => {
  return send(res, await storyService.shareStory({
    id: req.params.id,
    userId: req.user._id
  }));
});

module.exports = {
  addNewStory,
  getAllStories,
  deleteStory,
  getStoriesById,
  getRecentStories,
  viewStory,
  toggleLoveStory,
  getUserStories,
  getUserArchivedStories,
  shareStory,
  reactToStory,
  getStoryViewers
};
