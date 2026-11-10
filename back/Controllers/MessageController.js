const asyncHandler = require("express-async-handler");
const messageService = require("../Services/messageService");

const sendResult = (res, result) => res.status(result.status).json(result.body);

const getUsersInSideBar = asyncHandler(async (req, res) => {
  try {
    const sidebarData = await messageService.getUsersInSideBar(req.user._id);
    res.status(200).json(sidebarData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages(req.params.id, req.user._id);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const result = await messageService.sendMessage(
      req.body,
      req.files,
      req.params.id,
      req.user._id
    );
    sendResult(res, result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessagesByUser = async (req, res) => {
  try {
    const messages = await messageService.getMessagesByUser(req.params.id);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeAllMessagesIsReadBetweenUsers = asyncHandler(async (req, res) => {
  await messageService.makeAllMessagesIsReadBetweenUsers(req.user._id, req.params.id);
  res.status(200).json({ message: "All Messages marked as read" });
});

const getUnreadMessages = asyncHandler(async (req, res) => {
  try {
    const unreadMessages = await messageService.getUnreadMessages(req.user._id);
    res.status(200).json(unreadMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const result = await messageService.deleteMessage(req.params.id, req.user._id);
  sendResult(res, result);
});

const deleteMessageForMe = asyncHandler(async (req, res) => {
  const result = await messageService.deleteMessageForMe(req.params.id, req.user._id);
  sendResult(res, result);
});

const addLike = asyncHandler(async (req, res) => {
  const result = await messageService.addLike(req.params.messageId, req.user._id);
  sendResult(res, result);
});

module.exports = {
  getUsersInSideBar,
  getMessages,
  sendMessage,
  getMessagesByUser,
  makeAllMessagesIsReadBetweenUsers,
  getUnreadMessages,
  deleteMessageForMe,
  deleteMessage,
  addLike,
};
