const express = require('express');
const route = express.Router();
const {
  getAllComments,
  addNewComment,
  updateComment,
  deleteComment,
  getCommentById,
  likeComment,
} = require('../Controllers/CommentController');
const { verifyToken } = require('../Middelwares/verifyToken')

// Get all comments of a specific post (as nested tree)
route.get('/post/:postId', getAllComments);

// Create comment or reply
route.post('/:postId', verifyToken, addNewComment);

// Like / Unlike comment
route.put('/like/:id', verifyToken, likeComment);

// Update comment
route.put('/update/:id', verifyToken, updateComment);

// Get single comment
route.get('/:id', getCommentById);

// Delete comment
route.delete('/:id', verifyToken, deleteComment);

module.exports = route;
