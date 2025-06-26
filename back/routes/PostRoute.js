const {getAllPosts , addPost , deletePost , getPostById , likePost , savePost  , sharePost , editPost} = require('../Controllers/PostController')
const route = require('express').Router()
const { verifyToken } = require('../Middelwares/verifyToken')
const photoUpload = require('../Middelwares/uploadPhoto')
// .post(photoUpload.fields([{ name: 'image', maxCount: 1 }]),addTeam)
route.route('/')
    .get(getAllPosts)

route.route('/add')
    .post(verifyToken, photoUpload.fields([{ name: 'image', maxCount: 9 }]) , addPost)

route.route('/:id')
    .get(getPostById)
    .delete(verifyToken, deletePost)

route.route('/like/:id')
    .put(verifyToken, likePost)

route.route('/save/:id')
    .put(verifyToken, savePost)

// route.route('/love/:id')
//     .put(verifyToken, lovePost)

// route.route('/haha/:id')
//     .put(verifyToken, hahaPost)

route.route('/share/:id')
    .post(verifyToken, sharePost)

route.route('/update/:id')
    .put(editPost)
module.exports = route