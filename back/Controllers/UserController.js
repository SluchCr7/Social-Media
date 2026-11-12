const asyncHandler = require('express-async-handler');
const {
  User,
  validateUserLinks,
  LoginValidate,
  ValidateUser,
  validateUserUpdate,
  validatePasswordUpdate,
} = require('../Modules/User');
const userService = require('../Services/userService');
const { setAuthCookies, clearAuthCookies } = require('../utils/tokenUtils');

const sendResult = (res, operationResult) => {
  if (!operationResult) return undefined;
  if (operationResult.clearAuthCookies) clearAuthCookies(res);
  if (operationResult.authCookies) {
    setAuthCookies(res, operationResult.authCookies.accessToken, operationResult.authCookies.refreshToken);
  }
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
  remoteAddress: req.connection?.remoteAddress,
  refreshToken: req.cookies?.refreshToken,
  file: req.file,
});

const endpoint = (operation, select = requestContext) => asyncHandler(async (req, res) => (
  sendResult(res, await userService[operation](select(req)))
));

const RegisterNewUser = async (req, res) => sendResult(res, await userService.register({
  body: req.body,
  userAgent: req.headers['user-agent'],
  ip: req.ip || req.headers['x-forwarded-for'] || '',
}));

const LoginUser = endpoint('login', (req) => ({
  body: req.body,
  userAgent: req.headers['user-agent'],
  ip: req.ip,
  forwardedFor: req.headers['x-forwarded-for'],
  remoteAddress: req.connection?.remoteAddress,
}));
const LogoutUser = endpoint('logout', (req) => ({
  refreshToken: req.cookies?.refreshToken || req.body?.refreshToken,
}));
const LogoutAllSessions = endpoint('logoutAllSessions', (req) => ({
  userId: req.user?._id || req.user?.id,
}));
const RefreshToken = endpoint('refreshSession', (req) => ({
  refreshToken: req.cookies?.refreshToken || req.body?.refreshToken || req.headers['x-refresh-token'],
  userAgent: req.headers['user-agent'],
  ip: req.ip,
  forwardedFor: req.headers['x-forwarded-for'],
}));
const GetCurrentUser = endpoint('getCurrentUser', (req) => ({
  userId: req.user?._id || req.user?.id,
  token: req.token || req.cookies?.accessToken || req.cookies?.token,
}));

const getAllUsers = endpoint('getAllUsers');
const getUserById = endpoint('getUserById', (req) => ({ id: req.params.id }));
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
  LoginValidate,
  ValidateUser,
  validateUserUpdate,
  validatePasswordUpdate,
  RegisterNewUser,
  LoginUser,
  LogoutUser,
  LogoutAllSessions,
  RefreshToken,
  GetCurrentUser,
  getAllUsers,
  getUserById,
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
