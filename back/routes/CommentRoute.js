const express = require('express');
const route = express.Router();
const {
  getAllComments,
  addNewComment,
  updateComment,
  deleteComment,
  getCommentById,
  likeComment,
  getCommentReplies,
} = require('../Controllers/CommentController');
const { verifyToken } = require('../Middelwares/verifyToken')

// Get comments of a specific target (Post, Reel, or Comment)
route.get('/:targetType/:targetId', getAllComments);

// Get replies for a specific comment
route.get('/:commentId/replies', getCommentReplies);

// Create comment or reply (targetId and targetType passed in body)
route.post('/', verifyToken, addNewComment);

// Like / Unlike comment
route.put('/like/:id', verifyToken, likeComment);

// Update comment
route.put('/update/:id', verifyToken, updateComment);

// Get single comment
route.get('/:id', getCommentById);

// Delete comment
route.delete('/:id', verifyToken, deleteComment);

module.exports = route;
