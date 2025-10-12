const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');
const photoUpload = require('../Middelwares/uploadPhoto');

const {
  getUsersInSideBar,
  getMessages,
  sendMessage,
  getMessagesByUser,
  makeAllMessagesIsReadBetweenUsers,
  getUnreadMessages,
  deleteMessage,
  deleteFor,
  addLike,
} = require('../Controllers/MessageController');

// 🧩 قائمة المستخدمين في الـ Sidebar
route.route('/users')
  .get(verifyToken, getUsersInSideBar);

// 🧩 الرسائل غير المقروءة
route.route('/messages/unread')
  .get(verifyToken, getUnreadMessages);

// 🧩 جلب الرسائل بين المستخدمين
route.route('/messages/:id')
  .get(verifyToken, getMessages);

// 🧩 إرسال رسالة جديدة (نص أو صور)
route.route('/send/:id')
  .post(
    verifyToken,
    photoUpload.fields([{ name: 'image', maxCount: 10 }]),
    sendMessage
  );

// 🧩 جلب كل الرسائل التي استقبلها مستخدم معين
route.route('/user/:id')
  .get(verifyToken, getMessagesByUser);

// 🧩 جعل كل الرسائل بين مستخدمين مقروءة
route.route('/read/:id')
  .patch(verifyToken, makeAllMessagesIsReadBetweenUsers);

// 🧩 حذف الرسالة نهائيًا من قاعدة البيانات (للأدمن أو المرسل فقط مثلاً)
route.route('/delete/:id')
  .delete(verifyToken, deleteMessage);

// 🧩 حذف الرسالة من عند المستخدم فقط (Soft delete)
route.route('/deleteFor/:id')
  .patch(verifyToken, deleteFor);

// 🧩 إضافة / إزالة لايك على الرسالة
route.route('/like/:messageId')
  .patch(verifyToken, addLike);

module.exports = route;
