import api from './api';

/**
 * دالة عامة لرفع الصور أو تحديث الـ cover أو الـ avatar لأي كيان.
 * @param {string} endpoint - الرابط النسبي للـ API endpoint.
 * @param {File} file - ملف الصورة المرفوعة.
 * @param {string} token - اختياري للتوافق مع الإصدارات السابقة.
 * @param {function} showAlert - دالة إشعار المستخدم.
 * @returns {Promise<object|null>} - البيانات المرجعة أو null عند الفشل.
 */
export const uploadImageHandler = async (endpoint, file, token, showAlert) => {
  if (!endpoint || !file) {
    console.error('uploadImageHandler: endpoint or file missing.');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image', file);

    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const res = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (typeof showAlert === 'function') {
      showAlert(res.data?.message || 'Image uploaded successfully.');
    }
    return res.data;
  } catch (err) {
    console.error('Image upload error:', err);
    throw err;
  }
};
