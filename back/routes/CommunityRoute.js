const { getAllCommunities, getCommunityByCategory, joinTheCommunity, addNewCommunity, deleteCommunity } = require('../Controllers/CommunityController')
const route = require('express').Router()
const { verifyToken } = require('../Middelwares/verifyToken')

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

module.exports = route