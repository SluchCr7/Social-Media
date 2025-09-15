const {
  getAllCommunities,
  getCommunityById,
  getCommunityByCategory,
  makeAdmin,
  joinTheCommunity,
  removeMember,
  addNewCommunity,
  deleteCommunity,
  editCommunity,
  updateCommunityPicture,
  updateCommunityCover,
  sendJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  updateCommunityRules
} = require('../Controllers/CommunityController');

const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');
const photoUpload = require('../Middelwares/uploadPhoto');

route.route('/')
  .get(getAllCommunities);

route.route('/:Category')
  .get(getCommunityByCategory);

route.route('/add')
  .post(verifyToken, addNewCommunity);

route.route('/:id')
  .delete(verifyToken, deleteCommunity)
  .get(getCommunityById);

route.route('/join/:id')
  .put(verifyToken, joinTheCommunity);

// ✅ إرسال طلب انضمام
route.route('/join-request/:id')
  .post(verifyToken, sendJoinRequest);

// ✅ الموافقة على طلب انضمام
route.route('/join-request/approve/:communityId/:userId')
  .put(verifyToken, approveJoinRequest);

// ✅ رفض طلب انضمام
route.route('/join-request/reject/:communityId/:userId')
  .put(verifyToken, rejectJoinRequest);

// ✅ تحديث القوانين
route.route('/rules/:id')
  .put(verifyToken, updateCommunityRules);

route.route('/update/:id')
  .post(verifyToken, photoUpload.single("image"), updateCommunityPicture);

route.route('/update-cover/:id')
  .post(verifyToken, photoUpload.single("image"), updateCommunityCover);

route.route('/edit/:id')
  .put(verifyToken, editCommunity);

route.route('/remove/:communityId/:userId')
  .put(verifyToken, removeMember);

route.route('/admin/:id')
  .put(verifyToken, makeAdmin);

module.exports = route;
