// const { Server } = require("socket.io");
// const http = require("http");
// const express = require("express");
// const cors = require('cors');
// const app = express();
// const server = http.createServer(app);

// // Setup socket.io with CORS
// const io = new Server(server, {
//     cors: {
//         origin: process.env.DOMAIN_NAME,
//     },
// });
// function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }



// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// module.exports ={ io, app, server , getReceiverSocketId };

const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Setup socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN_NAME,
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// 🔹 دالة لإرجاع socketId للمستلم
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // 🔹 إرسال قائمة الأونلاين
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // لما يفصل المستخدم
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

/**
 * 🔹 دالة إرسال إشعار فوري
 * @param {string} receiverId - آي دي المستلم
 * @param {object} notification - بيانات الإشعار
 */
function sendNotification(receiverId, notification) {
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification", notification);
    console.log("📩 Sent notification to:", receiverId);
  }
}

/**
 * 🔹 دالة إرسال رسالة فورية
 * @param {string} receiverId - آي دي المستلم
 * @param {object} message - بيانات الرسالة
 */
function sendMessage(receiverId, message) {
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
    console.log("💬 Sent message to:", receiverId);
  }
}

module.exports = { io, app, server, getReceiverSocketId, sendNotification, sendMessage };
