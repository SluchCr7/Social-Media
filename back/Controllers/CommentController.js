const asyncHandler = require('express-async-handler');
const { Comment, ValidateComment, ValidateUpdateComment } = require('../Modules/Comment');
const { User } = require('../Modules/User');
const { Post } = require('../Modules/Post');
const { Reel } = require('../Modules/Reel');
const { sendNotificationHelper } = require('../utils/SendNotification');
const { commentPopulate } = require('../Populates/Populate');



// ================== Get All Comments (nested) ==================
// ================== Get Comments for a Target (Post, Reel, or Comment) ==================
const getAllComments = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.params;

  // Fetch comments directly attached to this target
  // Support both new targetId/targetType and legacy postId/parent fields
  const query = {
    $or: [
      { targetId, targetType },
    ]
  };

  // Legacy mappings
  if (targetType === "Post") query.$or.push({ postId: targetId, targetType: { $exists: false } });
  if (targetType === "Comment") query.$or.push({ parent: targetId });

  const comments = await Comment.find(query)
    .populate("owner", "username profileName profilePhoto following followers description")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
});


// const getAllComments = asyncHandler(async (req, res) => {
//   const postId = req.params.postId;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // 🎯 هات الكومنتات الرئيسية بس
//   const topLevelComments = await Comment.find({ postId, parent: null })
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .populate("owner", "username profileName profilePhoto following followers description")
//     .lean();

//   // 🎯 هات كل الريبلات الخاصة بالبوست
//   const allReplies = await Comment.find({ postId, parent: { $ne: null } })
//     .populate("owner", "username profileName profilePhoto following followers description")
//     .lean();

//   // 🏗️ بناء الشجرة
//   const buildReplies = (parentId) => {
//     return allReplies
//       .filter(reply => String(reply.parent) === String(parentId))
//       .map(reply => ({
//         ...reply,
//         replies: buildReplies(reply._id),
//       }));
//   };

//   const nestedComments = topLevelComments.map(comment => ({
//     ...comment,
//     replies: buildReplies(comment._id),
//   }));

//   const total = await Comment.countDocuments({ postId, parent: null });
//   const pages = Math.ceil(total / limit);

//   res.status(200).json({
//     nestedComments,
//     total,
//     page,
//     pages,
//   });
// });


// ================== Add New Comment ==================
// ================== Add New Comment ==================
const addNewComment = asyncHandler(async (req, res) => {
  const { text, targetId, targetType } = req.body;

  const { error } = ValidateComment({ text, targetId, targetType });
  if (error) return res.status(400).json({ message: error.details[0].message });

  let target;
  let notificationType = "comment";
  let content = "commented on your post";
  let actionModel = "Post";

  // 🎯 Verify Target Existence & Handle Logic
  if (targetType === "Post") {
    target = await Post.findById(targetId);
    if (!target) return res.status(404).json({ message: "Post not found" });
    if (target.isCommentOff) return res.status(403).json({ message: "Comments are disabled for this post" });
  } else if (targetType === "Reel") {
    target = await Reel.findById(targetId);
    if (!target) return res.status(404).json({ message: "Reel not found" });
    content = "commented on your reel";
    actionModel = "Reel";
  } else if (targetType === "Comment") {
    target = await Comment.findById(targetId).populate("owner");
    if (!target) return res.status(404).json({ message: "Parent comment not found" });
    notificationType = "reply";
    content = "replied to your comment";
    actionModel = "Comment";
  }

  const comment = new Comment({
    text,
    owner: req.user._id,
    targetId,
    targetType,
  });

  const user = await User.findById(req.user._id);
  user.userLevelPoints += 3;
  user.updateLevelRank();

  await Promise.all([user.save(), comment.save()]);

  const populatedComment = await Comment.findById(comment._id).populate(commentPopulate);

  // 🔔 Send Notifications
  if (!target.owner.equals(req.user._id)) {
    const targetOwner = targetType === "Comment" ? target.owner : await User.findById(target.owner);

    if (targetOwner && !targetOwner.BlockedNotificationFromUsers.includes(req.user._id)) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: targetOwner._id,
        content,
        type: notificationType,
        actionRef: target._id,
        actionModel: actionModel,
      });
    }
  }

  res.status(201).json({
    message: targetType === "Comment" ? "Reply added" : "Comment added",
    comment: populatedComment
  });
});

// ================== Delete Comment (with cascade replies) ==================
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is owner or admin
  if (comment.owner.toString() !== req.user._id && !req.user.isAdmin) {
    return res.status(403).json({ message: "You are not authorized to delete this comment" });
  }

  // Delete all replies associated with this comment (cascade)
  await Comment.deleteMany({
    $or: [
      { targetId: comment._id, targetType: 'Comment' },
      { parent: comment._id } // Legacy support
    ]
  });

  await comment.remove();
  res.status(200).json({ message: 'Comment and its replies deleted' });
});

// ================== Get Comment By ID ==================
const getCommentById = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate(commentPopulate);

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

    comment = await Comment.findById(req.params.id).populate(commentPopulate);

    return res.status(200).json({ message: "Comment Unliked", comment });
  }

  // ✅ لو أول مرة يعمل لايك
  await Comment.findByIdAndUpdate(req.params.id, {
    $push: { likes: req.user._id },
  });

  comment = await Comment.findById(req.params.id).populate(commentPopulate);

  // ✨ إرسال إشعار لصاحب الكومنت
  if (comment.owner._id.toString() !== req.user._id.toString()) {
    const commentOwner = await User.findById(comment.owner._id);
    if (!commentOwner.BlockedNotificationFromUsers.includes(req.user._id)) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: comment.owner._id,
        content: "liked your comment",
        type: "like-comment",
        actionRef: comment._id,
        actionModel: "Comment",
      });
    }
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
  ).populate(commentPopulate);

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

