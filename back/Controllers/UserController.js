const asyncHandler = require('express-async-handler');
const {
  User,
  validateUserLinks,
  validateUserUpdate,
  validatePasswordUpdate,
} = require('../Modules/User');
const userService = require('../Services/userService');

const sendResult = (res, operationResult) => {
  if (!operationResult) return undefined;
  if (operationResult.body === undefined) return undefined;
  return res.status(operationResult.status).json(operationResult.body);
};

const requestContext = (req) => ({
  body: req.body,
  params: req.params,
  userId: req.user?._id,
  currentUserId: req.user?._id,
  userAgent: req.headers['user-agent'],
  ip: req.ip,
  forwardedFor: req.headers['x-forwarded-for'],
  file: req.file,
});

const endpoint = (operation, select = requestContext) => asyncHandler(async (req, res) => (
  sendResult(res, await userService[operation](select(req)))
));

const getAllUsers = endpoint('getAllUsers');
const getUserById = endpoint('getUserById', (req) => ({ id: req.params.id }));
const getPublicUserByUsername = endpoint('getPublicUserByUsername', (req) => ({
  username: req.params.username,
}));
const DeleteUser = endpoint('deleteUser');
const verifyAccount = endpoint('verifyAccount', (req) => ({
  id: req.params.id,
  token: req.params.token,
}));
const uploadPhoto = endpoint('uploadImage', (req) => ({
  file: req.file,
  userId: req.user?._id,
  customText: req.body.customText,
  imageType: 'profile',
}));
const uploadCoverPhoto = endpoint('uploadImage', (req) => ({
  file: req.file,
  userId: req.user?._id,
  customText: req.body.customText,
  imageType: 'cover',
}));
const makeFollow = endpoint('makeFollow', (req) => ({
  targetUserId: req.params.id,
  userId: req.user?._id,
}));
const updateProfile = endpoint('updateProfile');
const updatePassword = endpoint('updatePassword');
const pinPost = endpoint('pinPost', (req) => ({
  userId: req.user?._id,
  postId: req.params.id,
}));
const blockOrUnblockUser = endpoint('blockOrUnblockUser', (req) => ({
  userId: req.user?._id,
  targetUserId: req.params.id,
}));
const updateLinksSocial = endpoint('updateLinksSocial');
const getSuggestedUsers = endpoint('getSuggestedUsers');
const MakeAccountPreimumVerify = endpoint('makeAccountPremiumVerify');
const togglePrivateAccount = endpoint('togglePrivateAccount');
const makeUserAdmin = endpoint('makeUserAdmin', (req) => ({ userId: req.params.id }));
const getUserPoints = endpoint('getUserPoints', (req) => ({ id: req.params.id }));
const getUserPointsHistory = endpoint('getUserPointsHistory', (req) => ({ id: req.params.id }));
const deleteAllUsers = endpoint('deleteAllUsers');
const updateAccountStatus = endpoint('updateAccountStatus', (req) => ({
  userId: req.params.userId,
  body: req.body,
}));
const getRelationship = endpoint('getRelationship', (req) => ({ userId: req.params.userId }));
const updateRelationship = endpoint('updateRelationship', (req) => ({
  userId: req.params.userId,
  currentUserId: req.user?._id,
  body: req.body,
}));
const toggleSongInPlaylist = endpoint('toggleSongInPlaylist', (req) => ({
  userId: req.user?._id,
  songId: req.params.songId,
}));
const acceptCookies = endpoint('acceptCookies');
const toggleBlockNotification = endpoint('toggleBlockNotification', (req) => ({
  userId: req.user?._id,
  targetUserId: req.params.userId,
}));
const saveReel = endpoint('saveReel', (req) => ({
  userId: req.user?._id,
  reelId: req.params.reelId,
}));

module.exports = {
  User,
  validateUserLinks,
  validateUserUpdate,
  validatePasswordUpdate,
  getAllUsers,
  getUserById,
  getPublicUserByUsername,
  DeleteUser,
  verifyAccount,
  uploadPhoto,
  uploadCoverPhoto,
  makeFollow,
  updateProfile,
  updatePassword,
  pinPost,
  blockOrUnblockUser,
  updateLinksSocial,
  getSuggestedUsers,
  MakeAccountPreimumVerify,
  togglePrivateAccount,
  makeUserAdmin,
  getUserPoints,
  getUserPointsHistory,
  deleteAllUsers,
  updateAccountStatus,
  getRelationship,
  updateRelationship,
  toggleSongInPlaylist,
  acceptCookies,
  toggleBlockNotification,
  saveReel,
};
