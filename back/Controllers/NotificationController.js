const asyncHandler = require("express-async-handler");
const { Notification } = require("../Modules/Notification");
const { sendNotification } = require("../Config/socket");

// ================== Add Notification ==================
const addNewNotify = asyncHandler(async (req, res) => {
  const receiver = req.params.id;
  const sender = req.user._id;
  const { content, type, actionRef, actionModel } = req.body;

  // منع إشعار لنفس المستخدم
  if (receiver.toString() === sender.toString()) {
    return res.status(400).json({ message: "Cannot notify yourself" });
  }

  const newNotify = new Notification({
    content,
    type,
    sender,
    receiver,
    actionRef,
    actionModel,
  });

  await newNotify.save();

  const populatedNotify = await newNotify.populate("sender", "username profilePhoto");

  // إرسال عبر socket
  sendNotification(receiver, populatedNotify);

  res.status(201).json(populatedNotify);
});

// ================== Get Notifications ==================
const getAllNotificationsByUser = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ receiver: req.user._id })
    .populate("sender", "username profilePhoto")
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// ================== Get Unread Count ==================
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    receiver: req.user._id,
    isRead: false,
  });
  res.status(200).json({ unreadCount: count });
});

// ================== Mark One As Read ==================
const markAsRead = asyncHandler(async (req, res) => {
  const notify = await Notification.findOne({
    _id: req.params.id,
    receiver: req.user._id,
  });

  if (!notify) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notify.isRead = true;
  await notify.save();

  res.status(200).json({ message: "Marked as read", notification: notify });
});

// ================== Mark All As Read ==================
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { receiver: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  const updated = await Notification.find({ receiver: req.user._id })
    .populate("sender", "username profilePhoto")
    .sort({ createdAt: -1 });

  res.status(200).json({ message: "All notifications marked as read", notifications: updated });
});

// ================== Delete One ==================
const deleteNotify = asyncHandler(async (req, res) => {
  const notify = await Notification.findOne({
    _id: req.params.id,
    receiver: req.user._id,
  });

  if (!notify) {
    return res.status(404).json({ message: "Notification not found" });
  }

  await notify.deleteOne();
  res.status(200).json({ message: "Notification deleted" });
});

// ================== Delete All ==================
const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ receiver: req.user._id });
  res.status(200).json({ message: "All notifications deleted" });
});

// ================== Admin Get All ==================
const getAllNotify = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .populate("sender", "name")
    .populate("receiver", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});



module.exports = {
  addNewNotify,
  getAllNotify,
  getAllNotificationsByUser,
  deleteNotify,
  clearAllNotifications, // جديد
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
