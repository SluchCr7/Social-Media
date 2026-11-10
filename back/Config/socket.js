
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const { verifyAccessToken } = require("../utils/tokenUtils");
const { User } = require("../Modules/User");

const app = express();
const server = http.createServer(app);

const allowedOrigin =
    process.env.DOMAIN_NAME || "http://localhost:3000";

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        credentials: true,
    },
});

// userId => Set of socketIds
const userSocketMap = new Map();

function parseCookieHeader(cookieHeader) {
    const cookies = {};

    if (!cookieHeader) return cookies;

    for (const pair of cookieHeader.split(";")) {
        const idx = pair.indexOf("=");

        if (idx === -1) continue;

        const key = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();

        try {
            cookies[key] = decodeURIComponent(value);
        } catch {
            cookies[key] = value;
        }
    }

    return cookies;
}

function getReceiverSocketId(userId) {
    const socketIds = userSocketMap.get(String(userId));

    return socketIds ? [...socketIds] : [];
}

function getOnlineUsers() {
    return [...userSocketMap.keys()];
}

// Authentication
io.use(async (socket, next) => {
    try {
        const cookies = parseCookieHeader(
            socket.request?.headers?.cookie
        );

        const token = cookies.accessToken;

        if (!token) {
            return next(new Error("Authentication required"));
        }

        const { payload, expired, error } = verifyAccessToken(token);

        if (expired || error || !payload?._id) {
            return next(new Error("Invalid or expired authentication"));
        }

        const user = await User.findById(payload._id)
            .select("_id accountStatus suspendedUntil isAdmin username");

        if (!user) {
            return next(new Error("Authentication failed"));
        }

        if (
            user.accountStatus === "banned" ||
            (
                user.accountStatus === "suspended" &&
                user.suspendedUntil &&
                new Date(user.suspendedUntil) > new Date()
            )
        ) {
            return next(new Error("Account access denied"));
        }

        socket.userId = String(user._id);

        socket.user = {
            _id: String(user._id),
            isAdmin: Boolean(user.isAdmin),
            username: user.username,
        };

        next();
    } catch (error) {
        console.error("[Socket Authentication]", error.message);

        next(new Error("Socket authentication failed"));
    }
});

// Connections
io.on("connection", (socket) => {
    const userId = socket.userId;

    if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
    }

    userSocketMap.get(userId).add(socket.id);

    console.log(`Socket connected: ${userId}`);

    io.emit("getOnlineUsers", getOnlineUsers());

    socket.on("disconnect", () => {
        const socketIds = userSocketMap.get(userId);

        if (socketIds) {
            socketIds.delete(socket.id);

            if (socketIds.size === 0) {
                userSocketMap.delete(userId);
            }
        }

        io.emit("getOnlineUsers", getOnlineUsers());

        console.log(`Socket disconnected: ${userId}`);
    });
});

// Notifications
function sendNotification(receiverId, notification) {
    const socketIds = getReceiverSocketId(receiverId);

    socketIds.forEach((socketId) => {
        io.to(socketId).emit("notification", notification);
    });
}

// Messages
function sendMessage(receiverId, message) {
    const socketIds = getReceiverSocketId(receiverId);

    socketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", message);
    });
}

module.exports = {
    io,
    app,
    server,
    getReceiverSocketId,
    sendNotification,
    sendMessage,
};
