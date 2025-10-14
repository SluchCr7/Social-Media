const express = require('express')
require('dotenv').config()
const cors = require('cors')
const connectDB = require('./Config/db')
const { errorhandler } = require('./Middelwares/errorHandler')
const cookieParser = require('cookie-parser');
const { app, server } = require('./Config/socket')
const path = require('path')

// Database connection
connectDB()

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.DOMAIN_NAME,
}));
app.use(express.json());
app.use(cookieParser())

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.use('/api/auth', require('./routes/UserRoute'))
app.use('/api/message', require('./routes/MessageRoute'))
app.use('/api/notification', require('./routes/NotificationRoute'))
app.use('/api/post', require('./routes/PostRoute'))
app.use('/api/comment', require('./routes/CommentRoute'))
app.use('/api/community', require('./routes/CommunityRoute'))
app.use('/api/news', require('./routes/NewsRoute'))
app.use('/api/story', require('./routes/StoryRoute'))
app.use('/api/password', require('./routes/PasswordRoute'))
app.use('/api/report', require('./routes/ReportRoute'))
app.use('/api/events', require('./routes/EventRoute'))
app.use('/api/reel', require('./routes/ReelRoute'))
app.use('/api/music', require('./routes/MusicRoute'))
app.use('/api/translate', require('./routes/TranslateRoute'))
app.use('/api/admin', require('./routes/AdminRoute'))
app.use(errorhandler)


// ================== Scheduled Posts System ==================
const { processScheduledPosts } = require("./utils/schedulePosts");

// فحص المنشورات المجدولة كل دقيقة
setInterval(() => {
    processScheduledPosts(global.io); // global.io لو عندك socket.io
}, 60 * 1000);

console.log("📅 Scheduled post processor is running every 1 minute...");

// Listen on port
server.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`)
})
