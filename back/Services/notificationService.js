const { Notification } = require("../Modules/Notification");
const { sendNotification, io, getReceiverSocketId } = require("../Config/socket");

const result = (status, body) => ({ status, body });

async function addNewNotify(receiver, sender, body) {
  if (receiver.toString() === sender.toString()) {
    return result(400, { message: "Cannot notify yourself" });
  }

  const { content, type, actionRef, actionModel } = body;
  const notification = new Notification({
    content,
    type,
    sender,
    receiver,
    actionRef,
    actionModel,
  });
  await notification.save();
  const populatedNotification = await notification.populate("sender", "username profilePhoto");
  sendNotification(receiver, populatedNotification);
  return result(201, populatedNotification);
}

async function getAllNotificationsByUser(userId) {
  return Notification.find({ receiver: userId })
    .populate("sender", "username profilePhoto")
    .sort({ createdAt: -1 });
}

async function getUnreadCount(userId) {
  return Notification.countDocuments({ receiver: userId, isRead: false });
}

async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, receiver: userId });
  if (!notification) return result(404, { message: "Notification not found" });

  notification.isRead = true;
  await notification.save();
  notification.isRead = true;
  await notification.save();

  const receiverSocketId = getReceiverSocketId(userId);
  if (receiverSocketId) io.to(receiverSocketId).emit("notification:update", notification);
  return result(200, { message: "Marked as read", notification });
}

async function markAllAsRead(userId) {
  await Notification.updateMany(
    { receiver: userId, isRead: false },
    { $set: { isRead: true } }
  );
  const updated = await Notification.find({ receiver: userId })
    .populate("sender", "username profilePhoto")
    .sort({ createdAt: -1 });

  const receiverSocketId = getReceiverSocketId(userId);
  if (receiverSocketId) io.to(receiverSocketId).emit("notification:read-all");
  return result(200, { message: "All notifications marked as read", notifications: updated });
}

async function deleteNotify(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, receiver: userId });
  if (!notification) return result(404, { message: "Notification not found" });
  await notification.deleteOne();

  const receiverSocketId = getReceiverSocketId(userId);
  if (receiverSocketId) io.to(receiverSocketId).emit("notification:delete", notificationId);
  return result(200, { message: "Notification deleted" });
}

async function clearAllNotifications(userId) {
  await Notification.deleteMany({ receiver: userId });
  const receiverSocketId = getReceiverSocketId(userId);
  if (receiverSocketId) io.to(receiverSocketId).emit("notification:clear-all");
  return result(200, { message: "All notifications deleted" });
}

async function getAllNotify() {
  return Notification.find()
    .populate("sender", "name")
    .populate("receiver", "name")
    .sort({ createdAt: -1 });
}

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
