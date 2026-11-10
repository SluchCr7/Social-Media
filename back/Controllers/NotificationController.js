const asyncHandler = require("express-async-handler");
const notificationService = require("../Services/notificationService");

const sendResult = (res, result) => res.status(result.status).json(result.body);

const addNewNotify = asyncHandler(async (req, res) => {
  const result = await notificationService.addNewNotify(
    req.params.id,
    req.user._id,
    req.body
  );
  sendResult(res, result);
});

const getAllNotificationsByUser = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getAllNotificationsByUser(req.user._id);
  res.status(200).json(notifications);
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  res.status(200).json({ unreadCount: count });
});

const markAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsRead(req.params.id, req.user._id);
  sendResult(res, result);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  sendResult(res, result);
});

const deleteNotify = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotify(req.params.id, req.user._id);
  sendResult(res, result);
});

const clearAllNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.clearAllNotifications(req.user._id);
  sendResult(res, result);
});

const getAllNotify = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getAllNotify();
  res.status(200).json(notifications);
});

module.exports = {
  addNewNotify,
  getAllNotify,
  getAllNotificationsByUser,
  deleteNotify,
  clearAllNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
