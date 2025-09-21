const asyncHandler = require('express-async-handler');
const { Comment, ValidateComment, ValidateUpdateComment } = require('../Modules/Comment');
const { User } = require('../Modules/User');
const { Post } = require('../Modules/Post');

// ================== Get All Comments (nested) ==================
const getAllComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ postId })
    .populate('owner', 'username profilePhoto profileName')
    .lean();

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

// const getAllComments = asyncHandler(async (req, res) => {
//  const postId = req.params.postId;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // جلب التعليقات الأساسية مع Pagination
//   const comments = await Comment.find({ postId })
//     .sort({ createdAt: -1 }) // أحدث أول
//     .skip(skip)
//     .limit(limit)
//     .populate('owner', 'username profilePhoto profileName')
//     .lean();

//   const total = await Comment.countDocuments({ postId });

//   const buildCommentTree = (parentId = null) => {
//     return comments
//       .filter(comment => {
//         if (!parentId) return !comment.parent;
//         return String(comment.parent) === String(parentId);
//       })
//       .map(comment => ({
//         ...comment,
//         replies: buildCommentTree(comment._id)
//       }));
//   };

//   const nestedComments = buildCommentTree();

//   res.status(200).json({
//     comments: nestedComments,
//     page,
//     totalPages: Math.ceil(total / limit),
//     totalComments: total
//   });
// });

// ================== Add New Comment ==================
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

  const comment = new Comment({
    text: req.body.text,
    owner: req.user._id,
    postId: req.params.postId,
    parent: req.body.parent || null,
  });

  const user = await User.findById(req.user._id);
  user.userLevelPoints += 3;
  user.updateLevelRank();

  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('owner', 'username profilePhoto profileName')
    .populate({
      path: 'replies',
      populate: { path: 'owner', select: 'username profilePhoto profileName' },
    });

    if (comment.parent) {
      const parentComment = await Comment.findById(comment.parent)
        .populate('owner', 'username profilePhoto profileName')
        .populate({
          path: 'replies',
          populate: { path: 'owner', select: 'username profilePhoto profileName' },
        });

      return res.status(201).json({ message: 'Comment added', comment: populatedComment, parentComment });
    }


  res.status(201).json({ message: 'Comment added', comment: populatedComment });
});

// ================== Delete Comment (with cascade replies) ==================
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // حذف كل الردود المرتبطة بالكومنت قبل الحذف
  await Comment.deleteMany({ parent: comment._id });

  await comment.remove();
  res.status(200).json({ message: 'Comment and its replies deleted' });
});

// ================== Get Comment By ID ==================
const getCommentById = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
    .populate('owner', 'username profilePhoto profileName')
    .populate({
      path: 'replies',
      populate: { path: 'owner', select: 'username profilePhoto profileName' },
    });

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  res.status(200).json(comment);
});

// ================== Like / Unlike Comment ==================
const likeComment = asyncHandler(async (req, res) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.likes.includes(req.user._id)) {
    await Comment.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user._id },
    });
    comment = await Comment.findById(req.params.id)
      .populate('owner', 'username profilePhoto profileName')
      .populate({
        path: 'replies',
        populate: { path: 'owner', select: 'username profilePhoto profileName' },
      });
    res.status(200).json({ message: "Comment Unliked", comment });
  } else {
    await Comment.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.user._id },
    });
    comment = await Comment.findById(req.params.id)
      .populate('owner', 'username profilePhoto profileName')
      .populate({
        path: 'replies',
        populate: { path: 'owner', select: 'username profilePhoto profileName' },
      });
    res.status(200).json({ message: "Comment Liked", comment });
  }
});

// ================== Update Comment ==================
const updateComment = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updated = await Comment.findByIdAndUpdate(req.params.id, {
    $set: { text: req.body.text }
  }, { new: true })
    .populate('owner', 'username profilePhoto profileName')
    .populate({
      path: 'replies',
      populate: { path: 'owner', select: 'username profilePhoto profileName' },
    });

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

