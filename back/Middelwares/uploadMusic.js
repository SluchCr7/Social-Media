const multer = require("multer");

// 🧠 استخدم نفس التخزين في الذاكرة
const storage = multer.memoryStorage();

// ⚙️ إعداد الـ fileFilter لقبول الصوت والصورة فقط
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio") || file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio and image files are allowed!"), false);
  }
};

// ⚖️ تحديد الحدود (يمكنك ضبطها حسب حاجتك)
const limits = {
  fileSize: 20 * 1024 * 1024, // أقصى حجم 20MB (للصوت والصورة)
};

// 🧩 إنشاء الـ multer instance
const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
