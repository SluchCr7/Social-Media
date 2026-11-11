const multer = require("multer");

const videoUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("video/")) cb(null, true);
    else {
      const error = new Error("Only video files are allowed");
      error.statusCode = 400;
      cb(error);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
});

module.exports = videoUpload;
