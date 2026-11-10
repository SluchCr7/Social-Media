const asyncHandler = require("express-async-handler");
const commentService = require("../Services/commentService");

const sendResult = (res, result) => {
  if (result.error) {
    res.status(result.status);
    throw new Error(result.error);
  }
  return res.status(result.status).json(result.body);
};

const getAllComments = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.getAllComments({
    targetId: req.params.targetId,
    targetType: req.params.targetType,
    query: req.query,
  }))
);

const getCommentReplies = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.getCommentReplies({
    commentId: req.params.commentId,
    query: req.query,
  }))
);

const addNewComment = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.addNewComment({
    body: req.body,
    userId: req.user._id,
  }))
);

const deleteComment = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.deleteComment({ id: req.params.id, user: req.user }))
);

const getCommentById = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.getCommentById({ id: req.params.id }))
);

const likeComment = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.likeComment({
    id: req.params.id,
    userId: req.user._id,
  }))
);

const updateComment = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.updateComment({
    id: req.params.id,
    body: req.body,
  }))
);

const getCommentsByUser = asyncHandler(async (req, res) =>
  sendResult(res, await commentService.getCommentsByUser({
    userId: req.params.userId,
    query: req.query,
  }))
);

module.exports = {
  getAllComments,
  addNewComment,
  updateComment,
  deleteComment,
  getCommentById,
  likeComment,
  getCommentsByUser,
  getCommentReplies
};
