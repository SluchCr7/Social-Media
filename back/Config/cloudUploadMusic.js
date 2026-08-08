const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { getCloudinaryConfig } = require('./cloudinaryConfig');

const config = getCloudinaryConfig();

cloudinary.config(config);

const ensureCloudinaryConfig = () => {
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET or the legacy Cloudinary env vars.');
  }
};

// ✅ رفع ملفات الصوت (audio) إلى Cloudinary
const cloudUploadMusic = (file) => {
  return new Promise((resolve, reject) => {
    try {
      ensureCloudinaryConfig();
    } catch (error) {
      return reject(error);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary بيعامل audio و video بنفس الـ resource
        folder: 'music',        // فولدر مخصص للموسيقى
      },
      (error, result) => {
        if (error) {
          console.error("Cloud music upload error:", error);
          return reject(new Error('Failed to upload music to cloud'));
        }
        resolve(result);
      }
    );

    // نحول الـ buffer لستريم ونبعتها لـ Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// ✅ حذف ملف صوت من Cloudinary
const cloudRemoveMusic = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video', // لازم نفس النوع
    });
    return result;
  } catch (error) {
    console.error("Cloud music delete error:", error);
    throw new Error('Failed to delete music from cloud');
  }
};

module.exports = { cloudUploadMusic, cloudRemoveMusic };
