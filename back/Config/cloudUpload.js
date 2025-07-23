const cloudinary = require('cloudinary').v2;
const path = require('path');
const DatauriParser = require('datauri/parser');

const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

// ✅ Cloudinary upload from memory (buffer)
const cloudUpload = async (file) => {
  try {
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
