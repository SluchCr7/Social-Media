const cloudinary = require('cloudinary').v2;
const path = require('path');
const DatauriParser = require('datauri/parser');
const { getCloudinaryConfig } = require('./cloudinaryConfig');

const parser = new DatauriParser();

const cloudinaryConfig = getCloudinaryConfig();
cloudinary.config(cloudinaryConfig);

const ensureCloudinaryConfig = () => {
  if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET or the legacy Cloudinary env vars.');
  }
};

// ✅ Cloudinary upload from memory (buffer)
const cloudUpload = async (file) => {
  try {
    ensureCloudinaryConfig();

    const ext = path.extname(file.originalname);
    const dataUri = parser.format(ext, file.buffer);

    const result = await cloudinary.uploader.upload(dataUri.content, {
      resource_type: 'auto',
    });

    return result;
  } catch (error) {
    console.error("Cloud upload error:", error);
    throw new Error('Failed to upload image to cloud');
  }
};

// ✅ Cloudinary delete
const cloudRemove = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloud delete error:", error);
    throw new Error('Failed to delete image from cloud');
  }
};

module.exports = { cloudUpload, cloudRemove };
