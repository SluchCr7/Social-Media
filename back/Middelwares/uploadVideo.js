const multer = require("multer");

const videoUpload = multer({
  storage : multer.memoryStorage(), 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video")) cb(null, true);
    else cb(new Error("Only video files are allowed!"), false);
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB حد أقصى للفيديو
});

module.exports = videoUpload;
