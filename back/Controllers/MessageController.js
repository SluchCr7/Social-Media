const { User } = require('../Modules/User');
const { Message, ValidateMessage } = require('../Modules/Message');
const { v2 } = require('cloudinary');
const fs = require('fs');
const { getReceiverSocketId, io } = require('../Config/socket');
const asyncHandler= require('express-async-handler')
const mongoose = require("mongoose");
const { messagePopulate } = require('../Populates/Populate');

// const getUsersInSideBar = async (req, res) => {
//   try {
//     const loggedUserId = req.user._id;
//     const loggedUser = await User.findById(loggedUserId).select("following");

//     const users = await User.find({ _id: { $in: loggedUser.following } })
//       .select("username profilePhoto profileName"); // فقط البيانات المهمة

//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getUsersInSideBar = asyncHandler(async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    // 1️⃣ احصل على الـ following
    const loggedUser = await User.findById(loggedUserId).select("following");

    // 2️⃣ احصل على كل الرسائل التي تشمل المستخدم الحالي
    const messages = await Message.find({
      $or: [
        { sender: loggedUserId },
        { receiver: loggedUserId }
      ]
    })
      .sort({ createdAt: -1 }) // الأحدث أولًا
      .lean();

    const usersMap = new Map();

    messages.forEach(msg => {
      const otherUserId = msg.sender.toString() === loggedUserId.toString() ? msg.receiver.toString() : msg.sender.toString();

      if (!usersMap.has(otherUserId)) {
        usersMap.set(otherUserId, {
          lastMessage: msg.text || (msg.Photos?.[0]?.url || ""),
          lastMessageAt: msg.createdAt,
          unreadCount: msg.receiver.toString() === loggedUserId.toString() && !msg.isRead ? 1 : 0
        });
      } else {
        const userData = usersMap.get(otherUserId);
        if (msg.receiver.toString() === loggedUserId.toString() && !msg.isRead) {
          userData.unreadCount += 1;
        }
      }
    });

    // 3️⃣ دمج الـ following الذين لم يكن لهم رسائل بعد
    loggedUser.following.forEach(followId => {
      if (!usersMap.has(followId.toString())) {
        usersMap.set(followId.toString(), {
          lastMessage: "",
          lastMessageAt: null,
          unreadCount: 0
        });
      }
    });

    // 4️⃣ جلب بيانات المستخدمين الأساسية
    const userIds = Array.from(usersMap.keys());
    const users = await User.find({ _id: { $in: userIds } })
      .select("username profilePhoto profileName")
      .lean();

    // 5️⃣ دمج بيانات الرسائل مع بيانات المستخدمين
    const sidebarData = users.map(user => ({
      ...user,
      ...usersMap.get(user._id.toString())
    }));

    // 6️⃣ ترتيب المستخدمين: أولًا حسب عدد الرسائل غير المقروءة، ثم حسب آخر رسالة
    sidebarData.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      if (b.lastMessageAt && a.lastMessageAt) return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      if (b.lastMessageAt) return -1;
      if (a.lastMessageAt) return 1;
      return 0;
    });

    res.status(200).json(sidebarData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getUsersInSideBar };


// Get messages between logged-in user and another user
const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const sender = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender, receiver: userToChatId },
        { sender: userToChatId, receiver: sender }
      ]
    }).populate(messagePopulate);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send a new message (text and/or image)
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userToChatId = req.params.id;
    const sender = req.user._id;

    // ✅ تحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    let photos = req.files?.image || [];
    if (!Array.isArray(photos)) photos = [photos];

    if (!text && photos.length === 0) {
      return res.status(400).json({ message: "Message must contain text or image." });
    }

    if (text) {
      const { error } = ValidateMessage({ text });
      if (error) return res.status(400).json({ message: error.details[0].message });
    }

    const uploadedPhotos = [];
    for (const image of photos) {
      const result = await v2.uploader.upload(image.path, { resource_type: "image" });
      uploadedPhotos.push({ url: result.secure_url, publicId: result.public_id });
      fs.unlinkSync(image.path);
    }

    const messageData = {
      sender,
      receiver: userToChatId,
      ...(text && { text }),
      ...(uploadedPhotos.length > 0 && { Photos: uploadedPhotos })
    };

    let message = new Message(messageData);
    await message.save();

    // 🔹 populate sender و receiver
    message = await message.populate(messagePopulate);
    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    // 🔹 أرجع الرسالة نفسها
    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessagesByUser = async(req,res) =>{
  try {
    const user = req.params.id
    const messages = await Message.find({ receiver: user }).populate(messagePopulate);
    res.status(200).json(messages)
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}

const makeAllMessagesIsReadBetweenUsers = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { receiver: req.user._id, sender : req.params.id , isRead: false },
    { $set: { isRead: true } }
  );  
  res.status(200).json({ message: 'All Messages marked as read' });
})

const getUnreadMessages = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadMessages = await Message.find({
      receiver: userId,
      isRead: false,
    })
      .populate(messagePopulate).sort({ createdAt: -1 }); // الأحدث أولاً

    res.status(200).json(unreadMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  getUsersInSideBar,
  getMessages,
  sendMessage,
  getMessagesByUser,
  makeAllMessagesIsReadBetweenUsers,
  getUnreadMessages
};
