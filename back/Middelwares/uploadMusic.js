const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isAudio = file.fieldname === "audio" && file.mimetype?.startsWith("audio/");
  const isImage = file.fieldname === "image" && file.mimetype?.startsWith("image/");
  if (isAudio || isImage) {
    cb(null, true);
  } else {
    const error = new Error(file.fieldname === "audio"
      ? "Only audio files are allowed"
      : "Only image artwork is allowed");
    error.statusCode = 400;
    cb(error, false);
  }
};

const limits = {
  fileSize: 25 * 1024 * 1024,
  files: 2,
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
