const multer = require("multer");

const mediaUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed!"), false);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});

module.exports = mediaUpload;
