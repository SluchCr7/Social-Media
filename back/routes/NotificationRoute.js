const { addNewNotify, getAllNotify, deleteNotify, getAllNotificationsByUser } = require('../Controllers/NotificationController');
const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');

route.route('/add')
    .post(verifyToken, addNewNotify)

route.route('/')
    .get(verifyToken, getAllNotify)

route.route('/user')
    .get(verifyToken , getAllNotificationsByUser)

route.route('/:id')
    .delete(verifyToken, deleteNotify)

module.exports = route