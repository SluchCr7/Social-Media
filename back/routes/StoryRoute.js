const route = require('express').Router();
const {
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
} = require('../Controllers/StoryController');
const { verifyToken } = require('../Middelwares/verifyToken');
const photoUpload = require('../Middelwares/uploadPhoto');

route.route('/')
    .get(getAllStories);

route.route('/add')
    .post(verifyToken, photoUpload.single("image"), addNewStory);

route.route('/delete/:id')
    .delete(verifyToken, deleteStory);

route.route('/user/:id/archive')
    .get(getUserArchivedStories);

route.route('/user/:id')
    .get(getUserStories);

route.route('/:id')
    .get(getStoriesById);

route.route('/view/:id')
    .post(verifyToken, viewStory);

route.route('/love/:id')
    .post(verifyToken, toggleLoveStory);

route.route("/share/:id")
    .post(verifyToken, shareStory);

route.route('/react/:id')
    .post(verifyToken, reactToStory);

route.route('/viewers/:id')
    .get(verifyToken, getStoryViewers);

route.route('/recent')
    .get(getRecentStories);

module.exports = route;
