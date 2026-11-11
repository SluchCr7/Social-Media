const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { getCloudinaryConfig } = require('./cloudinaryConfig');

const cloudinaryConfig = getCloudinaryConfig();
cloudinary.config(cloudinaryConfig);

const ensureCloudinaryConfig = () => {
  if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
    throw new Error('Cloudinary is not configured. Please configure the Cloudinary environment variables.');
  }
};

const cloudUploadVideo = (file) => {
  ensureCloudinaryConfig();
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

const cloudRemoveVideo = (publicId) => {
  ensureCloudinaryConfig();
  return cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
};

module.exports = { cloudUploadVideo, cloudRemoveVideo };
