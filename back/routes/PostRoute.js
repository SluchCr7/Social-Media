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
  getPostsByUser,
  getMemories
} = require('../Controllers/PostController');

const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');
const mediaUpload = require('../Middelwares/uploadMedia');

// Get all posts
route.route('/').get(getAllPosts);

// Get posts by specific user (pagination)
route.route('/user/:userId').get(getPostsByUser);

// Get memories (On this day)
route.route('/memories').get(verifyToken, getMemories);

// Add post
route.route('/add')
  .post(verifyToken, mediaUpload.fields([{ name: 'media', maxCount: 10 }]), addPost);

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
route.route('/edit/:id').put(verifyToken, mediaUpload.fields([{ name: 'newMedia', maxCount: 10 }]), editPost);

// Turn comments off
route.route('/commentsOff/:id').put(verifyToken, makeCommentsOff);

// View a post
route.route('/view/:id').put(verifyToken, viewPost);

module.exports = route;
