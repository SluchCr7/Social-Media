const multer = require("multer");

const musicUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio")) cb(null, true);
    else cb(new Error("Only audio files are allowed!"), false);
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB حد أقصى للملفات الصوتية
  },
});

module.exports = musicUpload;
