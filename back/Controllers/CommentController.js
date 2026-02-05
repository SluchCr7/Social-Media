const asyncHandler = require('express-async-handler');
const { Comment, ValidateComment, ValidateUpdateComment } = require('../Modules/Comment');
const { User } = require('../Modules/User');
const { Post } = require('../Modules/Post');
const Reel = require('../Modules/Reel');
const { sendNotificationHelper } = require('../utils/SendNotification');
const { io } = require("../Config/socket");
const { commentPopulate } = require('../Populates/Populate');

// ================== Get Comments for a Target (Post, Reel, or Comment) ==================
// ================== Get Comments for a Target (Paginated) ==================
const getAllComments = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.params;
  const { limit = 10, cursor } = req.query;
  const limitNum = parseInt(limit);

  let query = {
    targetId,
    targetType
  };

  // If fetching for Post/Reel, we only want TOP-LEVEL comments
  // Replies will be fetched lazily
  if (targetType === "Post" || targetType === "Reel") {
    // Legacy support: some old comments might not have targetType/targetId set correctly
    // but the rootId/rootType indexing project used previously is better.
    // However, to strictly paginated TOP-LEVEL:
    query = {
      $or: [
        { targetId, targetType },
        { postId: targetId, targetType: { $exists: false } } // Legacy
      ]
    };
  }

  // Cursor logic: createdAt_id
  if (cursor) {
    const [createdAt, _id] = Buffer.from(cursor, 'base64').toString('ascii').split('|');
    query.$or = [
      { createdAt: { $lt: new Date(createdAt) } },
      {
        createdAt: new Date(createdAt),
        _id: { $lt: _id }
      }
    ];
  }

  const comments = await Comment.find(query)
    .populate("owner", "username profileName profilePhoto following followers description isAccountWithPremiumVerify")
    .sort({ createdAt: -1, _id: -1 })
    .limit(limitNum + 1)
    .lean();

  const hasMore = comments.length > limitNum;
  const results = hasMore ? comments.slice(0, limitNum) : comments;

  let nextCursor = null;
  if (hasMore && results.length > 0) {
    const lastComment = results[results.length - 1];
    nextCursor = Buffer.from(`${lastComment.createdAt.toISOString()}|${lastComment._id}`).toString('base64');
  }

  // 🚀 Optimize: Fetch reply counts in ONE aggregation query instead of N+1 countDocuments
  const commentIds = results.map(c => c._id);
  const counts = await Comment.aggregate([
    { $match: { targetId: { $in: commentIds }, targetType: 'Comment' } },
    { $group: { _id: '$targetId', count: { $sum: 1 } } }
  ]);
  const countMap = counts.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  const commentsWithMeta = results.map(c => ({
    ...c,
    replies: [],
    replyCount: countMap[c._id.toString()] || 0
  }));

  res.status(200).json({
    comments: commentsWithMeta,
    nextCursor,
    hasMore
  });
});

// ================== Get Replies for a Comment (Paginated) ==================
const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { limit = 5, cursor } = req.query;
  const limitNum = parseInt(limit);

  let query = {
    targetId: commentId,
    targetType: 'Comment'
  };

  if (cursor) {
    const [createdAt, _id] = Buffer.from(cursor, 'base64').toString('ascii').split('|');
    query.$or = [
      { createdAt: { $lt: new Date(createdAt) } },
      {
        createdAt: new Date(createdAt),
        _id: { $lt: _id }
      }
    ];
  }

  const replies = await Comment.find(query)
    .populate("owner", "username profileName profilePhoto following followers description isAccountWithPremiumVerify")
    .sort({ createdAt: -1, _id: -1 })
    .limit(limitNum + 1)
    .lean();

  const hasMore = replies.length > limitNum;
  const results = hasMore ? replies.slice(0, limitNum) : replies;

  let nextCursor = null;
  if (hasMore && results.length > 0) {
    const lastReply = results[results.length - 1];
    nextCursor = Buffer.from(`${lastReply.createdAt.toISOString()}|${lastReply._id}`).toString('base64');
  }

  // 🚀 Optimize: Fetch reply counts for these replies in ONE aggregation
  const replyIds = results.map(r => r._id);
  const counts = await Comment.aggregate([
    { $match: { targetId: { $in: replyIds }, targetType: 'Comment' } },
    { $group: { _id: '$targetId', count: { $sum: 1 } } }
  ]);
  const countMap = counts.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  const repliesWithMeta = results.map(r => ({
    ...r,
    replies: [],
    replyCount: countMap[r._id.toString()] || 0
  }));

  res.status(200).json({
    comments: repliesWithMeta,
    nextCursor,
    hasMore
  });
});

// ================== Add New Comment ==================
const addNewComment = asyncHandler(async (req, res) => {
  const { text, targetId, targetType } = req.body;

  const { error } = ValidateComment({ text, targetId, targetType });
  if (error) return res.status(400).json({ message: error.details[0].message });

  let target;
  let notificationType = "comment";
  let content = "commented on your post";
  let actionModel = "Post";
  let rootId, rootType;

  // 🎯 Verify Target Existence & Handle Logic
  if (targetType === "Post") {
    target = await Post.findById(targetId);
    if (!target) return res.status(404).json({ message: "Post not found" });
    if (target.isCommentOff) return res.status(403).json({ message: "Comments are disabled for this post" });
    rootId = targetId;
    rootType = "Post";
  } else if (targetType === "Reel") {
    target = await Reel.findById(targetId);
    if (!target) return res.status(404).json({ message: "Reel not found" });
    content = "commented on your reel";
    actionModel = "Reel";
    rootId = targetId;
    rootType = "Reel";
  } else if (targetType === "Comment") {
    target = await Comment.findById(targetId).populate("owner");
    if (!target) return res.status(404).json({ message: "Parent comment not found" });
    notificationType = "reply";
    content = "replied to your comment";
    actionModel = "Comment";
    rootId = target.rootId;
    rootType = target.rootType;
  }

  const comment = new Comment({
    text,
    owner: req.user._id,
    targetId,
    targetType,
    rootId,
    rootType,
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

  /* 
    populatedComment has targetId/targetType. 
    Frontend needs to know if this comment is relevant to current view.
  */
  io.emit("comment:create", populatedComment);

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

  io.emit("comment:delete", req.params.id);

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

    // Emit update
    io.emit("comment:update", comment);

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
  // Emit update
  io.emit("comment:update", comment);

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

  // Emit update
  io.emit("comment:update", updated);

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
  getCommentsByUser,
  getCommentReplies
};

