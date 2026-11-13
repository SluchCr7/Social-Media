
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const xssProtection = require("./Middelwares/xssProtection");
const createCsrfProtection = require("./Middelwares/csrfProtection");
const { notfound, errorhandler } = require("./Middelwares/errorHandler");

const { app } = require("./Config/socket");

// Security Headers
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

// Request Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api/", limiter);

// Body Parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(xssProtection);
app.use(cookieParser());

// Performance
app.use(compression());

// CORS
const allowedOrigins = (process.env.DOMAIN_NAME || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
        try {
            return new URL(origin).origin;
        } catch {
            throw new Error(`Invalid DOMAIN_NAME origin: ${origin}`);
        }
    });

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(createCsrfProtection(allowedOrigins));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/api", require("./routes"));

// Error Handling
app.use(notfound);
app.use(errorhandler);

module.exports = app;
