const route = require('express').Router()
const { addNewStory, getAllStories, deleteStory , getStoriesById , getRecentStories } = require('../Controllers/StoryController')
const { verifyToken } = require('../Middelwares/verifyToken')
const photoUpload = require('../Middelwares/uploadPhoto')
route.route('/')
    .get(getAllStories)

route.route('/add')
    .post(verifyToken, photoUpload.fields([{ name: 'image', maxCount: 1 }]), addNewStory)

    route.route('/delete/:id')
    .delete(verifyToken, deleteStory)

route.route('/:id')
    .get(getStoriesById)

route.route('/recent')
    .get(getRecentStories)

module.exports = route