// const express = require('express')
// require('dotenv').config()
// const cors = require('cors')
// const helmet = require('helmet')
// const rateLimit = require('express-rate-limit')
// const compression = require('compression')
// const morgan = require('morgan')
// const xssProtection = require('./Middelwares/xssProtection')
// const connectDB = require('./Config/db')
// const { notfound, errorhandler } = require('./Middelwares/errorHandler')
// const cookieParser = require('cookie-parser');
// const { app, server } = require('./Config/socket')
// const path = require('path')
// const { processScheduledPosts } = require("./utils/schedulePosts");
// const { Story } = require('./Modules/Story');
// const cron = require('node-cron');

// // Database connection
// connectDB()

// // --- Security & Utility Middlewares ---

// // 1. Security Headers
// app.use(helmet({
//     crossOriginResourcePolicy: false, // Allows loading images from cloud/external sources
// }));

// // 2. Request Logging
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

// // 3. Rate Limiting (Prevents Brute-force & DDoS)
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 500, // Limit each IP to 500 requests per window
//     message: 'Too many requests from this IP, please try again after 15 minutes',
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use('/api/', limiter);

// // 4. Data Sanitization & Body Parsing
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(xssProtection);
// app.use(cookieParser());

// // 5. Performance
// app.use(compression());

// // 6. CORS
// app.use(cors({
//     origin: process.env.DOMAIN_NAME || 'http://localhost:3000',
//     credentials: true,
// }));

// // 7. CSRF Protection: Validate Origin / Referer for state-changing operations
// app.use((req, res, next) => {
//   const method = req.method.toUpperCase();
//   if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
//     const origin = req.headers.origin || req.headers.referer;
//     const allowedOrigin = process.env.DOMAIN_NAME || 'http://localhost:3000';
//     if (origin && !origin.startsWith(allowedOrigin)) {
//       return res.status(403).json({ message: 'CSRF protection: request origin not authorized' });
//     }
//   }
//   next();
// });

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })
// app.use("/api" , require("./routes"))
// app.use(notfound)
// app.use(errorhandler)

// // ================== Scheduled Posts System and Story Cleanup ==================

// // Function responsible for archiving expired stories after 24h
// const archiveExpiredStories = async () => {
//     try {
//         const now = new Date();

//         // Archive all expired stories without setting isDeleted: true
//         const archiveResult = await Story.updateMany(
//             {
//                 expiresAt: { $lt: now },
//                 isArchived: false,
//                 isDeleted: false
//             },
//             { $set: { isArchived: true } }
//         );

//         if (archiveResult.modifiedCount > 0) {
//             console.log(`[Cron Job] Archived ${archiveResult.modifiedCount} expired stories.`);
//         }
//     } catch (error) {
//         console.error("Error in story archiving cron job:", error);
//     }
// };

// cron.schedule('0 * * * *', archiveExpiredStories, {
//     scheduled: true,
//     timezone: "Asia/Riyadh"
// });
// console.log("Story archiving job scheduled (Hourly).");

// setInterval(() => {
//     processScheduledPosts(global.io);
// }, 60 * 1000);

// server.listen(process.env.PORT, () => {
//     console.log(`🚀 Server is running on port ${process.env.PORT}`)
// })


require("dotenv").config();

const connectDB = require("./Config/db");
const app = require("./app");
const { server } = require("./Config/socket");
const startJobs = require("./jobs");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);

            const stopJobs = startJobs(global.io);

            // Optional graceful shutdown
            const shutdown = () => {
                stopJobs();

                server.close(() => {
                    process.exit(0);
                });
            };

            process.once("SIGINT", shutdown);
            process.once("SIGTERM", shutdown);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
