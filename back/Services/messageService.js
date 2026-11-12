const { User } = require("../Modules/User");
const { Message, ValidateMessage } = require("../Modules/Message");
const { v2 } = require("cloudinary");
const fs = require("fs");
const { getReceiverSocketId, io } = require("../Config/socket");
const mongoose = require("mongoose");
const { messagePopulate } = require("../Populates/Populate");
const { sendNotificationHelper } = require("../utils/SendNotification");

const result = (status, body) => ({ status, body });

async function getUsersInSideBar(loggedUserId) {
  const loggedUser = await User.findById(loggedUserId).select("following");
  const messages = await Message.find({
    $or: [{ sender: loggedUserId }, { receiver: loggedUserId }],
  })
    .select("sender receiver text Photos createdAt isRead")
    .sort({ createdAt: -1 })
    .lean();

  const usersMap = new Map();
  messages.forEach((msg) => {
    const otherUserId =
      msg.sender.toString() === loggedUserId.toString()
        ? msg.receiver.toString()
        : msg.sender.toString();
    if (!usersMap.has(otherUserId)) {
      usersMap.set(otherUserId, {
        lastMessage: msg.text || msg.Photos?.[0]?.url || "",
        lastMessageAt: msg.createdAt,
        unreadCount: msg.receiver.toString() === loggedUserId.toString() && !msg.isRead ? 1 : 0,
      });
    } else {
      const userData = usersMap.get(otherUserId);
      if (msg.receiver.toString() === loggedUserId.toString() && !msg.isRead) {
        userData.unreadCount += 1;
      }
    }
  });

  loggedUser.following.forEach((followId) => {
    if (!usersMap.has(followId.toString())) {
      usersMap.set(followId.toString(), {
        lastMessage: "",
        lastMessageAt: null,
        unreadCount: 0,
      });
    }
  });

  const userIds = Array.from(usersMap.keys());
  const users = await User.find({ _id: { $in: userIds } })
    .select("username profilePhoto profileName")
    .lean();
  const sidebarData = users.map((user) => ({
    ...user,
    ...usersMap.get(user._id.toString()),
  }));
  sidebarData.sort((a, b) => {
    if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
    if (b.lastMessageAt && a.lastMessageAt) {
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    }
    if (b.lastMessageAt) return -1;
    if (a.lastMessageAt) return 1;
    return 0;
  });
  return sidebarData;
}

async function getMessages(userToChatId, sender) {
  return Message.find({
    $or: [
      { sender, receiver: userToChatId },
      { sender: userToChatId, receiver: sender },
    ],
  })
    .populate(messagePopulate)
    .sort({ createdAt: 1 })
    .lean();
}

async function sendMessage(body, files, userToChatId, sender) {
  const { text, replyTo } = body;
  if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(userToChatId)) {
    return result(400, { message: "Invalid sender or receiver ID" });
  }

  let photos = files?.image || [];
  if (!Array.isArray(photos)) photos = [photos];
  if (!text && photos.length === 0) {
    return result(400, { message: "Message must contain text or image." });
  }

  if (text) {
    const { error } = ValidateMessage({ text });
    if (error) return result(400, { message: error.details[0].message });
  }

  const uploadedPhotos = [];
  for (const image of photos) {
    const uploaded = await v2.uploader.upload(image.path, { resource_type: "image" });
    uploadedPhotos.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
    fs.unlinkSync(image.path);
  }

  const messageData = {
    sender,
    receiver: userToChatId,
    ...(text && { text }),
    ...(uploadedPhotos.length > 0 && { Photos: uploadedPhotos }),
    ...(replyTo && { replyTo }),
  };
  let message = new Message(messageData);
  await message.save();
  message = await message.populate([
    { path: "sender", select: "name profilePhoto" },
    { path: "receiver", select: "name profilePhoto" },
    {
      path: "replyTo",
      select: "text Photos sender",
      populate: { path: "sender", select: "name profilePhoto" },
    },
  ]);

  const receiverSocketId = getReceiverSocketId(userToChatId);
  if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", message);
  return result(201, message);
}

async function getMessagesByUser(userId) {
  return Message.find({ receiver: userId }).populate(messagePopulate);
}

async function makeAllMessagesIsReadBetweenUsers(receiverId, senderId) {
  await Message.updateMany(
    { receiver: receiverId, sender: senderId, isRead: false },
    { $set: { isRead: true } }
  );
}

async function getUnreadMessages(userId) {
  return Message.find({ receiver: userId, isRead: false })
    .populate(messagePopulate)
    .sort({ createdAt: -1 });
}

async function deleteMessage(messageId, userId) {
  const message = await Message.findById(messageId);
  if (!message) return result(404, { message: "Message not found" });
  if (message.sender.toString() !== userId.toString()) {
    return result(403, { message: "Not authorized to delete" });
  }

  if (message.Photos?.length) {
    for (const image of message.Photos) {
      if (image.publicId) await v2.uploader.destroy(image.publicId);
    }
  }
  await message.deleteOne();

  const receiverId = message.sender.toString() === userId.toString()
    ? message.receiver
    : message.sender;
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) io.to(receiverSocketId).emit("message:delete", messageId);
  return result(200, { message: "Message deleted successfully" });
}

async function deleteMessageForMe(messageId, userId) {
  const message = await Message.findById(messageId);
  if (!message) return result(404, { message: "Message not found" });
  if (!message.deletedFor.includes(userId)) {
    message.deletedFor.push(userId);
    await message.save();
  }
  return result(200, { message: "Message hidden for you" });
}

async function addLike(messageId, userId) {
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return result(400, { message: "Invalid message ID" });
  }

  const message = await Message.findById(messageId);
  if (!message) return result(404, { message: "Message not found" });

  const alreadyLiked = message.likes.some(
    (likeUserId) => likeUserId.toString() === userId.toString()
  );
  let action;
  if (alreadyLiked) {
    message.likes.pull(userId);
    action = "unliked";
  } else {
    message.likes.push(userId);
    action = "liked";
    if (!message.sender.equals(userId)) {
      await sendNotificationHelper({
        sender: userId,
        receiver: message.sender,
        content: "liked your message 💬",
        type: "like",
        actionRef: message._id,
        actionModel: "Message",
      });
    }
  }

  await message.save();
  const updatedMessage = await Message.findById(messageId).populate(messagePopulate);
  const receiverSocketId = getReceiverSocketId(
    message.sender.toString() === userId.toString() ? message.receiver : message.sender
  );
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("messageLikeUpdate", { messageId, userId, action });
  }

  return result(200, {
    message: `Message ${action} successfully`,
    data: updatedMessage,
  });
}

module.exports = {
  getUsersInSideBar,
  getMessages,
  sendMessage,
  getMessagesByUser,
  makeAllMessagesIsReadBetweenUsers,
  getUnreadMessages,
  deleteMessage,
  deleteMessageForMe,
  addLike,
};
