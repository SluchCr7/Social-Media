const { Comment, ValidateComment, ValidateUpdateComment } = require("../Modules/Comment");
const { User } = require("../Modules/User");
const { Post } = require("../Modules/Post");
const Reel = require("../Modules/Reel");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { io } = require("../Config/socket");
const { commentPopulate } = require("../Populates/Populate");
const { updateUserPoints } = require("../utils/PointsEngine");

const result = (status, body) => ({ status, body });
const errorResult = (status, error) => ({ status, error });

const addCursorFilter = (query, cursor) => {
  if (cursor) {
    const [createdAt, _id] = Buffer.from(cursor, "base64").toString("ascii").split("|");
    query.$or = [
      { createdAt: { $lt: new Date(createdAt) } },
      {
        createdAt: new Date(createdAt),
        _id: { $lt: _id }
      }
    ];
  }
  return query;
};

const withReplyMetadata = async (documents) => {
  const ids = documents.map(document => document._id);
  const counts = await Comment.aggregate([
    { $match: { targetId: { $in: ids }, targetType: "Comment" } },
    { $group: { _id: "$targetId", count: { $sum: 1 } } }
  ]);
  const countMap = counts.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});
  return documents.map(document => ({
    ...document,
    replies: [],
    replyCount: countMap[document._id.toString()] || 0
  }));
};

const getAllComments = async ({ targetId, targetType, query: requestQuery }) => {
  const { limit = 10, cursor } = requestQuery;
  const limitNum = parseInt(limit);
  let query = { targetId, targetType };
  if (targetType === "Post" || targetType === "Reel") {
    query = {
      $or: [
        { targetId, targetType },
        { postId: targetId, targetType: { $exists: false } }
      ]
    };
  }
  query = addCursorFilter(query, cursor);
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
    nextCursor = Buffer.from(`${lastComment.createdAt.toISOString()}|${lastComment._id}`).toString("base64");
  }
  const commentsWithMeta = await withReplyMetadata(results);
  return result(200, { comments: commentsWithMeta, nextCursor, hasMore });
};

const getCommentReplies = async ({ commentId, query: requestQuery }) => {
  const { limit = 5, cursor } = requestQuery;
  const limitNum = parseInt(limit);
  const query = addCursorFilter({
    targetId: commentId,
    targetType: "Comment"
  }, cursor);
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
    nextCursor = Buffer.from(`${lastReply.createdAt.toISOString()}|${lastReply._id}`).toString("base64");
  }
  const repliesWithMeta = await withReplyMetadata(results);
  return result(200, { comments: repliesWithMeta, nextCursor, hasMore });
};

const addNewComment = async ({ body, userId }) => {
  const { text, targetId, targetType } = body;
  const { error } = ValidateComment({ text, targetId, targetType });
  if (error) return result(400, { message: error.details[0].message });

  let target;
  let notificationType = "comment";
  let content = "commented on your post";
  let actionModel = "Post";
  let rootId;
  let rootType;

  if (targetType === "Post") {
    target = await Post.findById(targetId);
    if (!target) return result(404, { message: "Post not found" });
    if (target.isCommentOff) return result(403, { message: "Comments are disabled for this post" });
    rootId = targetId;
    rootType = "Post";
  } else if (targetType === "Reel") {
    target = await Reel.findById(targetId);
    if (!target) return result(404, { message: "Reel not found" });
    content = "commented on your reel";
    actionModel = "Reel";
    rootId = targetId;
    rootType = "Reel";
  } else if (targetType === "Comment") {
    target = await Comment.findById(targetId).populate("owner");
    if (!target) return result(404, { message: "Parent comment not found" });
    notificationType = "reply";
    content = "replied to your comment";
    actionModel = "Comment";
    rootId = target.rootId;
    rootType = target.rootType;
  }

  const comment = new Comment({
    text,
    owner: userId,
    targetId,
    targetType,
    rootId,
    rootType,
  });
  await comment.save();
  await updateUserPoints(userId, "COMMENT", comment._id);
  const populatedComment = await Comment.findById(comment._id).populate(commentPopulate);

  if (!target.owner.equals(userId)) {
    const targetOwner = targetType === "Comment" ? target.owner : await User.findById(target.owner);
    if (targetOwner && !targetOwner.BlockedNotificationFromUsers.includes(userId)) {
      await sendNotificationHelper({
        sender: userId,
        receiver: targetOwner._id,
        content,
        type: notificationType,
        actionRef: target._id,
        actionModel,
      });
    }
  }

  io.emit("comment:create", populatedComment);
  return result(201, {
    message: targetType === "Comment" ? "Reply added" : "Comment added",
    comment: populatedComment
  });
};

const deleteComment = async ({ id, user }) => {
  const comment = await Comment.findById(id);
  if (!comment) return errorResult(404, "Comment not found");
  if (comment.owner.toString() !== user._id && !user.isAdmin) {
    return result(403, { message: "You are not authorized to delete this comment" });
  }
  await Comment.deleteMany({
    $or: [
      { targetId: comment._id, targetType: "Comment" },
      { parent: comment._id }
    ]
  });
  await comment.remove();
  io.emit("comment:delete", id);
  await updateUserPoints(comment.owner, "DELETE_COMMENT", comment._id);
  return result(200, { message: "Comment and its replies deleted" });
};

const getCommentById = async ({ id }) => {
  const comment = await Comment.findById(id).populate(commentPopulate);
  if (!comment) return errorResult(404, "Comment not found");
  return result(200, comment);
};

const likeComment = async ({ id, userId }) => {
  let comment = await Comment.findById(id);
  if (!comment) return errorResult(404, "Comment not found");
  if (comment.likes.includes(userId)) {
    await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
    comment = await Comment.findById(id).populate(commentPopulate);
    io.emit("comment:update", comment);
    return result(200, { message: "Comment Unliked", comment });
  }

  await Comment.findByIdAndUpdate(id, { $push: { likes: userId } });
  comment = await Comment.findById(id).populate(commentPopulate);
  if (comment.owner._id.toString() !== userId.toString()) {
    const commentOwner = await User.findById(comment.owner._id);
    if (!commentOwner.BlockedNotificationFromUsers.includes(userId)) {
      await sendNotificationHelper({
        sender: userId,
        receiver: comment.owner._id,
        content: "liked your comment",
        type: "like-comment",
        actionRef: comment._id,
        actionModel: "Comment",
      });
    }
  }
  io.emit("comment:update", comment);
  return result(200, { message: "Comment Liked", comment });
};

const updateComment = async ({ id, body }) => {
  const { error } = ValidateUpdateComment(body);
  if (error) return result(400, { message: error.details[0].message });
  const updated = await Comment.findByIdAndUpdate(
    id,
    {
      $set: {
        text: body.text,
        isEdited: true,
      },
    },
    { new: true }
  ).populate(commentPopulate);
  io.emit("comment:update", updated);
  return result(200, { message: "Comment Updated Successfully", comment: updated });
};

const getCommentsByUser = async ({ userId, query }) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const comments = await Comment.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profileName profilePhoto following followers description")
    .lean();
  const total = await Comment.countDocuments({ owner: userId });
  return result(200, { comments, total, page, pages: Math.ceil(total / limit) });
};

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
