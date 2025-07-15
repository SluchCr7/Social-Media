
const { getAllCommunities, getCommunityByCategory, makeAdmin, joinTheCommunity, removeMember, addNewCommunity, deleteCommunity, editCommunity, updateCommunityPicture, updateCommunityCover } = require('../Controllers/CommunityController')
const route = require('express').Router()
const { verifyToken } = require('../Middelwares/verifyToken')
const photoUpload = require('../Middelwares/uploadPhoto')
route.route('/')
    .get(getAllCommunities)

route.route('/:Category')
    .get(getCommunityByCategory)

route.route('/add')
    .post(verifyToken, addNewCommunity)

route.route('/:id')
    .delete(verifyToken, deleteCommunity)

route.route('/join/:id')
    .put(verifyToken, joinTheCommunity)

route.route('/update/:id')
    .put(verifyToken, photoUpload.single("image"), updateCommunityPicture)
route.route('/update-cover/:id')
    .put(verifyToken, photoUpload.single("image"), updateCommunityCover)
route.route('/edit/:id')
    .put(verifyToken, editCommunity)

route.route('/remove/:communityId/:userId')
    .put(verifyToken, removeMember)

route.route('/admin/:id')
    .put(verifyToken, makeAdmin)

module.exports = route