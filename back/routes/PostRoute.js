const {
  getAllPosts,
  makeCommentsOff,
  addPost,
  deletePost,
  getPostById,
  likePost,
  savePost,
  sharePost,
  editPost,
  viewPost,
  hahaPost,
  getPostsByUser
} = require('../Controllers/PostController');

const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');
const photoUpload = require('../Middelwares/uploadPhoto');

// Get all posts
route.route('/').get(getAllPosts);

// Get posts by specific user (pagination)
route.route('/user/:userId').get(getPostsByUser);

// Add post
route.route('/add')
  .post(verifyToken, photoUpload.fields([{ name: 'image', maxCount: 9 }]), addPost);

// Get, delete, or view a specific post
route.route('/:id')
  .get(getPostById)
  .delete(verifyToken, deletePost);

// Like and haha a post
route.route('/like/:id').put(verifyToken, likePost);
route.route('/haha/:id').put(verifyToken, hahaPost);

// Save a post
route.route('/save/:id').put(verifyToken, savePost);

// Share a post
route.route('/share/:id').post(verifyToken, sharePost);

// Edit a post
route.route('/edit/:id').put(verifyToken, photoUpload.array('newPhotos', 9), editPost);

// Turn comments off
route.route('/commentsOff/:id').put(verifyToken, makeCommentsOff);

// View a post
route.route('/view/:id').put(verifyToken, viewPost);

module.exports = route;
