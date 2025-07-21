const asyncHandler = require('express-async-handler');
const { Comment, ValidateComment, ValidateUpdateComment } = require('../Modules/Comment');
const {User} = require('../Modules/User');
const { Post } = require('../Modules/Post');

const getAllComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ postId })
    .populate('owner')
    .lean()
  const buildCommentTree = (parentId = null) => {
    return comments
      .filter(comment => {
        if (!parentId) return !comment.parent;
        return String(comment.parent) === String(parentId);
      })
      .map(comment => ({
        ...comment,
        replies: buildCommentTree(comment._id)
      }));
  };

  const nestedComments = buildCommentTree();

  res.status(200).json(nestedComments);
});


const addNewComment = asyncHandler(async (req, res) => {
  const { error } = ValidateComment({ ...req.body, postId: req.params.postId });
  if (error) return res.status(400).json({ message: error.details[0].message });
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.isCommentOff) {
    res.status(403);
    throw new Error('Comments are disabled for this post');
  }
  const userId = req.user._id;
  const comment = new Comment({
    text: req.body.text,
    owner: req.user._id,
    postId: req.params.postId,
    parent: req.body.parent || null,
  });
  const user = await User.findById(userId);
  user.userLevelPoints += 3;
  user.updateLevelRank();
  await comment.save();

  // Populate the owner field after saving
  const populatedComment = await Comment.findById(comment._id).populate('owner', 'username profilePhoto profileName');

  res.status(201).json({ message: "Comment added", comment: populatedComment });
});


const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  await comment.remove();
  res.status(200).json({ message: 'Comment deleted' });
});

const getCommentById = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate('owner')
    .populate({
      path: 'replies',
      populate: {
        path: 'owner',
      }
    });

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  res.status(200).json(comment);
});

const likeComment = asyncHandler(async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.likes.includes(req.user._id)) {
    comment = await Comment.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user._id },
    }, { new: true });
    res.status(200).json({ message: "Comment Unliked", comment });
  } else {
    comment = await Comment.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.user._id },
    }, { new: true });
    res.status(200).json({ message: "Comment Liked", comment });
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updated = await Comment.findByIdAndUpdate(req.params.id, {
    $set: { text: req.body.text }
  }, { new: true });

  res.status(200).json({ message: "Comment Updated Successfully", comment: updated });
});

module.exports = {
  getAllComments,
  addNewComment,
  updateComment,
  deleteComment,
  getCommentById,
  likeComment,
};
