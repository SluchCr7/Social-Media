const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

// ✅ Cloudinary upload for videos (buffer -> stream)
const cloudUploadVideo = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // نحدد إنها فيديو
        folder: 'reels',        // ممكن تغير اسم الفولدر لو عايز
      },
      (error, result) => {
        if (error) {
          console.error("Cloud video upload error:", error);
          return reject(new Error('Failed to upload video to cloud'));
        }
        resolve(result);
      }
    );

    // نحول الـ buffer لستريم ونبعتها لـ Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

module.exports = { cloudUploadVideo };
