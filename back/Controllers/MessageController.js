const { User } = require('../Modules/User');
const { Message, ValidateMessage } = require('../Modules/Message');
const { v2 } = require('cloudinary');
const fs = require('fs');
const { getReceiverSocketId, io } = require('../Config/socket');
const asyncHandler= require('express-async-handler')

const getUsersInSideBar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const loggedUser = await User.findById(loggedUserId).select("following");

    const users = await User.find({ _id: { $in: loggedUser.following } })
      .select("username profilePhoto profileName"); // فقط البيانات المهمة

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
    })
      .populate('sender', 'username profilePic _id')
      .populate('receiver', 'username profilePic _id');

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

    // 🔹 رجع الرسالة مع بيانات الـ sender والـ receiver
    message = await message.populate("sender", "username profilePhoto _id");
    message = await message.populate("receiver", "username profilePhoto _id");

    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    // 🔹 أرجع الرسالة نفسها بدل "Message Sent"
    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessagesByUser = async(req,res) =>{
  try {
    const user = req.params.id
    const messages = await Message.find({ receiver: user }).populate('sender', 'username profilePhoto _id').populate('receiver', 'username profilePhoto _id')
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

module.exports = {
  getUsersInSideBar,
  getMessages,
  sendMessage,
  getMessagesByUser,
  makeAllMessagesIsReadBetweenUsers
};
