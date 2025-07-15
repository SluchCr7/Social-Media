const express = require('express')
// const app = express()
require('dotenv').config()
const cors = require('cors')
const connectDB = require('./Config/db')
const { errorhandler } = require('./Middelwares/errorHandler')
const cookieParser = require('cookie-parser');
const {app , server} = require('./Config/socket')
const path = require('path')    
// Database connection
connectDB()

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
app.use(errorhandler)



// Listen on port 3001
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})