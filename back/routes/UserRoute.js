const express = require('express');
const route = express.Router();

const {
  DeleteUser,
  deleteAllUsers,
  getSuggestedUsers,
  updateLinksSocial,
  blockOrUnblockUser,
  makeUserAdmin,
  getAllUsers,
  getUserById,
  RegisterNewUser,
  LoginUser,
  verifyAccount,
  uploadPhoto,
  makeFollow,
  acceptCookies,
  toggleSongInPlaylist,
  updatePassword,
  updateProfile,
  pinPost,
  MakeAccountPreimumVerify,
  togglePrivateAccount,
  updateAccountStatus,
  // 🔹 Controllers الجدد
  getRelationship,
  updateRelationship
} = require('../Controllers/UserController');

const photoUpload = require('../Middelwares/uploadPhoto');
const { verifyToken } = require('../Middelwares/verifyToken');

// User routes
route.route('/').get(getAllUsers);
route.route('/suggested').get(verifyToken, getSuggestedUsers);
route.route('/block/:id').put(verifyToken, blockOrUnblockUser);
route.route('/:id').get(getUserById);
route.route('/delete').delete(verifyToken, DeleteUser);
route.route('/login').post(LoginUser);
route.route('/register').post(RegisterNewUser);
route.route('/admin/:id').put(verifyToken, makeUserAdmin);
route.route('/:id/verify/:token').get(verifyAccount);
route.route('/photo').post(verifyToken, photoUpload.single('image'), uploadPhoto);
route.route('/follow/:id').put(verifyToken, makeFollow);
route.route('/update').put(verifyToken, updateProfile);
route.route('/update/pass').put(verifyToken, updatePassword);
route.route('/pin/:id').put(verifyToken, pinPost);
route.route('/social').put(verifyToken, updateLinksSocial);
route.route('/deleteAll').delete(deleteAllUsers);
route.route('/verify').put(verifyToken , MakeAccountPreimumVerify);
route.route('/account/private').put(verifyToken, togglePrivateAccount);
route.route('/save/music/:songId').put(verifyToken, toggleSongInPlaylist);
// 🔹 Account status & suspension
route.route('/status/:userId').put(verifyToken, updateAccountStatus);
route.route('/cookies/:id').put(verifyToken, acceptCookies);

// 🔹 Relationship routes
route.route('/relationship/:userId').get(verifyToken, getRelationship); // جلب حالة العلاقة
route.route('/relationship/:userId').put(verifyToken, updateRelationship); // تحديث العلاقة

module.exports = route;
