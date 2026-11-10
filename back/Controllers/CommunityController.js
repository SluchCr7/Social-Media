const asyncHandler = require("express-async-handler");
const communityService = require("../Services/communityService");

const sendResult = (res, result) => res.status(result.status).json(result.body);

const getAllCommunities = asyncHandler(async (req, res) => {
  const communities = await communityService.getAllCommunities();
  res.status(200).json(communities);
});

const getCommunityById = asyncHandler(async (req, res) => {
  const result = await communityService.getCommunityById(req.params.id);
  sendResult(res, result);
});

const getCommunityByCategory = asyncHandler(async (req, res) => {
  const communities = await communityService.getCommunityByCategory(req.params.Category);
  res.status(200).json(communities);
});

const addNewCommunity = asyncHandler(async (req, res) => {
  const result = await communityService.addNewCommunity(req.body, req.user._id);
  sendResult(res, result);
});

const deleteCommunity = asyncHandler(async (req, res) => {
  const result = await communityService.deleteCommunity(req.params.id);
  if (result.error) {
    res.status(404);
    throw new Error(result.error);
  }
  sendResult(res, result);
});

const joinTheCommunity = asyncHandler(async (req, res) => {
  const result = await communityService.joinTheCommunity(req.params.id, req.user._id);
  sendResult(res, result);
});

const editCommunity = asyncHandler(async (req, res) => {
  const result = await communityService.editCommunity(req.params.id, req.body);
  sendResult(res, result);
});

const updateCommunityPicture = asyncHandler(async (req, res) => {
  try {
    const result = await communityService.updateCommunityPicture(req.params.id, req.file);
    return sendResult(res, result);
  } catch (error) {
    console.error("❌ Server Error:", error.message, error.stack);
    return res.status(500).json({
      message: "Internal server error during image update.",
      error: error.message,
    });
  }
});

const updateCommunityCover = asyncHandler(async (req, res) => {
  try {
    const result = await communityService.updateCommunityCover(req.params.id, req.file);
    return sendResult(res, result);
  } catch (error) {
    console.error("❌ Server Error:", error.message, error.stack);
    return res.status(500).json({
      message: "Internal server error during cover update.",
      error: error.message,
    });
  }
});

const removeMember = asyncHandler(async (req, res) => {
  const { communityId, userId } = req.params;
  const result = await communityService.removeMember(communityId, userId, req.user);
  sendResult(res, result);
});

const makeAdmin = asyncHandler(async (req, res) => {
  const result = await communityService.makeAdmin(
    req.params.id,
    req.body.userIdToMakeAdmin,
    req.user._id
  );
  sendResult(res, result);
});

const sendJoinRequest = asyncHandler(async (req, res) => {
  const result = await communityService.sendJoinRequest(req.params.id, req.user._id);
  sendResult(res, result);
});

const approveJoinRequest = asyncHandler(async (req, res) => {
  const { communityId, userId } = req.params;
  const result = await communityService.approveJoinRequest(communityId, userId, req.user._id);
  sendResult(res, result);
});

const rejectJoinRequest = asyncHandler(async (req, res) => {
  const { communityId, userId } = req.params;
  const result = await communityService.rejectJoinRequest(communityId, userId, req.user._id);
  sendResult(res, result);
});

const updateCommunityRules = asyncHandler(async (req, res) => {
  const result = await communityService.updateCommunityRules(
    req.params.id,
    req.body.rules,
    req.user._id
  );
  sendResult(res, result);
});

module.exports = {
  getAllCommunities,
  getCommunityByCategory,
  addNewCommunity,
  deleteCommunity,
  joinTheCommunity,
  editCommunity,
  updateCommunityPicture,
  updateCommunityCover,
  removeMember,
  makeAdmin,
  getCommunityById,
  sendJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  updateCommunityRules,
};
