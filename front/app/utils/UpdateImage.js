import axios from "axios";

/**
 * دالة عامة لرفع الصور أو تحديث الـ cover أو الـ avatar لأي كيان.
 * @param {string} endpoint - الرابط الكامل للـ API endpoint.
 * @param {File} file - ملف الصورة المرفوعة.
 * @param {string} token - توكن المستخدم للمصادقة.
 * @returns {Promise<object|null>} - البيانات المرجعة أو null عند الفشل.
 */
export const uploadImageHandler = async (endpoint, file, token,showAlert) => {
  if (!endpoint || !file) {
    console.error("uploadImageHandler: endpoint or file missing.");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/${endpoint}`,
        formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    showAlert(res.data.message || "Image uploaded successfully.");
    return res.data;
  } catch (err) {
    console.error("Image upload error:", err);
    throw err; // نخلي اللي بيستدعيها يتعامل مع الخطأ لو حابب
  }
};
