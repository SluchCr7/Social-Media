import axios from "axios";
/**
 * @desc ترجم النصوص إلى اللغة المطلوبة
 * @route POST /api/translate
 * @access Public
 */
export const translateText = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang)
      return res
        .status(400)
        .json({ success: false, message: "الرجاء إرسال النص واللغة الهدف" });

    // LibreTranslate API
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text",
    });

    return res.status(200).json({
      success: true,
      translatedText: response.data.translatedText,
    });
  } catch (error) {
    console.error("❌ Translation Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء الترجمة",
      error: error.message,
    });
  }
};
