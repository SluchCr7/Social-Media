const asyncHandler = require('express-async-handler');
const { Notification } = require('../Modules/Notification');

// @desc    Add a new notification
// @route   POST /api/notifications/:id
// @access  Private
const addNewNotify = asyncHandler(async (req, res) => {
  const receiver = req.params.id;
  const sender = req.user._id;
  const { content, type, actionRef, actionModel } = req.body;

  const newNotify = new Notification({
    content,
    type,
    sender,
    receiver,
    actionRef,
    actionModel,
  });

  await newNotify.save();
  res.status(201).json(newNotify);
});

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getAllNotificationsByUser = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ receiver: req.user._id })
    .populate('sender', 'username profilePhoto') // يمكن تخصيص ما يتم جلبه من بيانات المستخدم
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    receiver: req.user._id,
    isRead: false,
  });

  res.status(200).json({ unreadCount: count });
});

// @desc    Mark one notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notify = await Notification.findOne({
    _id: req.params.id,
    receiver: req.user._id,
  });

  if (!notify) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  notify.isRead = true;
  await notify.save();

  res.status(200).json({ message: 'Marked as read', notification: notify });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { receiver: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({ message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotify = asyncHandler(async (req, res) => {
  const notify = await Notification.findOne({
    _id: req.params.id,
    receiver: req.user._id,
  });

  if (!notify) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  await notify.deleteOne();
  res.status(200).json({ message: 'Notification deleted' });
});

// @desc    Get all notifications (Admin Only)
// @route   GET /api/notifications/all
// @access  Admin
const getAllNotify = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

module.exports = {
  addNewNotify,
  getAllNotify,
  getAllNotificationsByUser,
  deleteNotify,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
