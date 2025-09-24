// utils/sendNotification.js
const { Notification } = require("../Modules/Notification");
const { getReceiverSocketId, io } = require("../Config/socket");

const sendNotificationHelper = async ({ sender, receiver, content, type, actionRef, actionModel }) => {
  try {
    // ✅ إنشاء وحفظ الإشعار
    const newNotify = new Notification({
      content,
      type, // like, mention, comment, follow, share...
      sender,
      receiver,
      actionRef,
      actionModel,
    });

    await newNotify.save();

    // ✅ إرسال عبر السوكيت
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", newNotify);
    }

    return newNotify;
  } catch (err) {
    console.error("Notification Error:", err.message);
  }
};

module.exports = { sendNotificationHelper };
