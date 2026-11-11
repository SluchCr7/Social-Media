const asyncHandler = require("express-async-handler");
const postService = require("../Services/postService");

const sendResult = (res, result) => {
  if (result.error) {
    res.status(result.status);
    throw new Error(result.error);
  }
  return res.status(result.status).json(result.body);
};

const getAllPosts = asyncHandler(async (req, res) =>
  sendResult(res, await postService.getAllPosts({ query: req.query }))
);

const getVideoPosts = asyncHandler(async (req, res) =>
  sendResult(res, await postService.getVideoPosts({ query: req.query }))
);

const addPost = async (req, res) =>
  sendResult(res, await postService.addPost({
    body: req.body,
    userId: req.user._id,
    files: req.files,
  }));

const deletePost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.deletePost({ id: req.params.id, user: req.user }))
);

const hahaPost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.hahaPost({ id: req.params.id, userId: req.user._id }))
);

const likePost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.likePost({ id: req.params.id, userId: req.user._id }))
);

const savePost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.savePost({ id: req.params.id, userId: req.user._id }))
);

const sharePost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.sharePost({
    id: req.params.id,
    userId: req.user._id,
    body: req.body,
  }))
);

const editPost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.editPost({
    id: req.params.id,
    body: req.body,
    files: req.files,
  }))
);

const makeCommentsOff = asyncHandler(async (req, res) =>
  sendResult(res, await postService.makeCommentsOff({ id: req.params.id }))
);

const viewPost = asyncHandler(async (req, res) =>
  sendResult(res, await postService.viewPost({ id: req.params.id, userId: req.user._id }))
);

const getPostsByUser = asyncHandler(async (req, res) =>
  sendResult(res, await postService.getPostsByUser({
    userId: req.params.userId,
    query: req.query,
  }))
);

const getMemories = asyncHandler(async (req, res) =>
  sendResult(res, await postService.getMemories({ userId: req.user._id }))
);

const getPostById = asyncHandler(async (req, res) =>
  sendResult(res, await postService.getPostById({ id: req.params.id }))
);

module.exports = {
  getAllPosts,
  getVideoPosts,
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
};
