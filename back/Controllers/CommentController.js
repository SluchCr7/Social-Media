const asyncHandler = require('express-async-handler');
const { Comment, ValidateComment, ValidateUpdateComment } = require('../Modules/Comment');
const { User } = require('../Modules/User');
const { Post } = require('../Modules/Post');
const { sendNotificationHelper } = require('../utils/SendNotification');

// ================== Get All Comments (nested) ==================
// const getAllComments = asyncHandler(async (req, res) => {
//   const postId = req.params.postId;
//   const page = parseInt(req.query.page) || 1; //
//   const limit = parseInt(req.query.limit) || 10; //
//   const skip = (page - 1) * limit; //
//   const comments = await Comment.find({ postId })
//     .sort({ createdAt: -1 }) //
//     .skip(skip)//
//     .limit(limit)//
//     .populate("owner", "username profileName profilePhoto following followers description")
//     .lean();//
  
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
//   // 📝 احسب العدد الكلي للبوستات الخاصة باليوزر
//   const total = await Comment.countDocuments({ postId });//
//   const pages = Math.ceil(total / limit);//
//   res.status(200).json({
//     nestedComments,
//     total,//
//     page,//
//     pages,//
//   });
// });

const getAllComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 🎯 هات الكومنتات الرئيسية بس
  const topLevelComments = await Comment.find({ postId, parent: null })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profileName profilePhoto following followers description")
    .lean();

  // 🎯 هات كل الريبلات الخاصة بالبوست
  const allReplies = await Comment.find({ postId, parent: { $ne: null } })
    .populate("owner", "username profileName profilePhoto following followers description")
    .lean();

  // 🏗️ بناء الشجرة
  const buildReplies = (parentId) => {
    return allReplies
      .filter(reply => String(reply.parent) === String(parentId))
      .map(reply => ({
        ...reply,
        replies: buildReplies(reply._id),
      }));
  };

  const nestedComments = topLevelComments.map(comment => ({
    ...comment,
    replies: buildReplies(comment._id),
  }));

  const total = await Comment.countDocuments({ postId, parent: null });
  const pages = Math.ceil(total / limit);

  res.status(200).json({
    nestedComments,
    total,
    page,
    pages,
  });
});


// ================== Add New Comment ==================
const addNewComment = asyncHandler(async (req, res) => {
  const { error } = ValidateComment({ ...req.body, postId: req.params.postId });
  if (error) return res.status(400).json({ message: error.details[0].message });

  // ✅ التأكد من وجود البوست
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // ✅ لو الكومنتات مقفولة
  if (post.isCommentOff) {
    res.status(403);
    throw new Error("Comments are disabled for this post");
  }

  // ✅ إنشاء الكومنت
  const comment = new Comment({
    text: req.body.text,
    owner: req.user._id,
    postId: req.params.postId,
    parent: req.body.parent || null,
  });

  // ✅ تحديث مستوى المستخدم
  const user = await User.findById(req.user._id);
  user.userLevelPoints += 3;
  user.updateLevelRank();
  await Promise.all([user.save(), comment.save()]);

  // ✅ populate للكومنت الجديد
  const populatedComment = await Comment.findById(comment._id)
    .populate("owner", "username profilePhoto profileName")
    .populate({
      path: "replies",
      populate: { path: "owner", select: "username profilePhoto profileName" },
    });

  // ✅ لو الكومنت رد (reply)
  if (comment.parent) {
    const parentComment = await Comment.findById(comment.parent)
      .populate("owner", "username profilePhoto profileName")
      .populate({
        path: "replies",
        populate: { path: "owner", select: "username profilePhoto profileName" },
      });

    // ✨ إرسال إشعار لصاحب الكومنت الأب
    if (parentComment && !parentComment.owner.equals(req.user._id)) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: parentComment.owner,
        content: "replied to your comment",
        type: "reply",
        actionRef: parentComment._id,
        actionModel: "Comment",
      });
    }

    return res
      .status(201)
      .json({ message: "Reply added", comment: populatedComment, parentComment });
  }

  // ✅ لو الكومنت على البوست نفسه
  if (!post.owner.equals(req.user._id)) {
    await sendNotificationHelper({
      sender: req.user._id,
      receiver: post.owner,
      content: "commented on your post",
      type: "comment",
      actionRef: post._id,
      actionModel: "Post",
    });
  }

  res.status(201).json({ message: "Comment added", comment: populatedComment });
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
    throw new Error("Comment not found");
  }

  // ✅ لو المستخدم عامل لايك بالفعل → نشيل اللايك
  if (comment.likes.includes(req.user._id)) {
    await Comment.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user._id },
    });

    comment = await Comment.findById(req.params.id)
      .populate("owner", "username profilePhoto profileName")
      .populate({
        path: "replies",
        populate: { path: "owner", select: "username profilePhoto profileName" },
      });

    return res.status(200).json({ message: "Comment Unliked", comment });
  }

  // ✅ لو أول مرة يعمل لايك
  await Comment.findByIdAndUpdate(req.params.id, {
    $push: { likes: req.user._id },
  });

  comment = await Comment.findById(req.params.id)
    .populate("owner", "username profilePhoto profileName")
    .populate({
      path: "replies",
      populate: { path: "owner", select: "username profilePhoto profileName" },
    });

  // ✨ إرسال إشعار لصاحب الكومنت
  if (comment.owner._id.toString() !== req.user._id.toString()) {
    await sendNotificationHelper({
      sender: req.user._id,
      receiver: comment.owner._id,
      content: "liked your comment",
      type: "like-comment",
      actionRef: comment._id,
      actionModel: "Comment",
    });
  }

  res.status(200).json({ message: "Comment Liked", comment });
});


// ================== Update Comment ==================
const updateComment = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: { 
        text: req.body.text,
        isEdited: true, // ✅ علامة إنه اتعدل
      },
    },
    { new: true }
  )
    .populate("owner", "username profilePhoto profileName")
    .populate({
      path: "replies",
      populate: { path: "owner", select: "username profilePhoto profileName" },
    });

  res
    .status(200)
    .json({ message: "Comment Updated Successfully", comment: updated });
});

// ========================= get Comments By User ===============================


const getCommentsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const comments = await Comment.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profileName profilePhoto following followers description")
    .lean();

  // 📝 احسب العدد الكلي للبوستات الخاصة باليوزر
  const total = await Comment.countDocuments({ owner: userId });
  const pages = Math.ceil(total / limit);
  res.status(200).json({
    comments,
    total,
    page,
    pages,
  });
})


module.exports = {
  getAllComments,
  addNewComment,
  updateComment,
  deleteComment,
  getCommentById,
  likeComment,
  getCommentsByUser
};

