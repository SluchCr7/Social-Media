const { 
  getUsersInSideBar, 
  getMessages, 
  sendMessage, 
  getMessagesByUser, 
  makeAllMessagesIsReadBetweenUsers, 
  getUnreadMessages 
} = require('../Controllers/MessageController');

const route = require('express').Router();
const { verifyToken } = require('../Middelwares/verifyToken');
const photoUpload = require('../Middelwares/uploadPhoto');

route.route('/users')
    .get(verifyToken, getUsersInSideBar);

// ✅ خلي unread قبل :id
route.route('/messages/unread')
    .get(verifyToken, getUnreadMessages);

route.route('/messages/:id')
    .get(verifyToken, getMessages);

route.route("/send/:id")
    .post(
      verifyToken,
      photoUpload.fields([{ name: 'image', maxCount: 10 }]),
      sendMessage
    );

route.route('/user/:id')
    .get(getMessagesByUser);

route.route('/read/:id')
    .patch(verifyToken, makeAllMessagesIsReadBetweenUsers);
    
module.exports = route;
