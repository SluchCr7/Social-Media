const {
  addNewNotify,
  getAllNotify,
  deleteNotify,
  getAllNotificationsByUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  clearAllNotifications,
} = require('../Controllers/NotificationController');

const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');

// 🔒 جميع الراوتات محمية بالتحقق من التوكن

// 👤 إشعارات المستخدم الحالي
route.get('/user', verifyToken, getAllNotificationsByUser);
route.get('/user/unread-count', verifyToken, getUnreadCount);
route.patch('/:id/read', verifyToken, markAsRead);
route.patch('/read-all', verifyToken, markAllAsRead);
route.delete('/clear', verifyToken, clearAllNotifications);

// 🔔 إشعار واحد
route.post('/:id', verifyToken, addNewNotify);
route.delete('/:id', verifyToken, deleteNotify);

// 🛠️ (Admin) جميع الإشعارات
route.get('/', verifyToken, getAllNotify);

module.exports = route;
