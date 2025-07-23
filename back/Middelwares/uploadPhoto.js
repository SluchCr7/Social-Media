const multer = require("multer");

const photoUpload = multer({
  storage: multer.memoryStorage(), // ✅ لا حفظ على قرص
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new Error("Only image files allowed!"), false);
  },
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});

module.exports = photoUpload;
