const {
    addNewNotify,
    getAllNotify,
    deleteNotify,
    getAllNotificationsByUser,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = require('../Controllers/NotificationController');
  
  const route = require('express').Router();
  const { verifyToken } = require('../Middelwares/verifyToken');
  
  // 🔒 جميع الراوتات محمية بالتحقق من التوكن
  
  // ✅ إضافة إشعار جديد (تحديد الـ Receiver في البارام)
  route.post('/:id', verifyToken, addNewNotify);
  
  // ✅ جميع الإشعارات الخاصة بالمستخدم الحالي
  route.get('/user', verifyToken, getAllNotificationsByUser);
  
  // ✅ عدد الإشعارات غير المقروءة
  route.get('/user/unread-count', verifyToken, getUnreadCount);
  
  // ✅ تحديد إشعار معين كمقروء
  route.patch('/:id/read', verifyToken, markAsRead);
  
  // ✅ تحديد كل الإشعارات كمقروءة
  route.patch('/read-all', verifyToken, markAllAsRead);
  
  // ✅ حذف إشعار
  route.delete('/:id', verifyToken, deleteNotify);
  
  // ✅ جميع الإشعارات في النظام (Admin use)
  route.get('/', verifyToken, getAllNotify);
  
  module.exports = route;
  