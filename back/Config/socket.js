const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require('cors');
const app = express();
const server = http.createServer(app);

// Setup socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN_NAME,
    },
});
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}



// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports ={ io, app, server , getReceiverSocketId };