const axios = require("axios");

/**
 * @desc Translate text to the requested language
 * @route POST /api/translate
 * @access Public
 */
const translateText = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        message: "Please provide both text and target language."
      });
    }

    // Using Google Translate free endpoint (client=gtx)
    // This is more reliable and supports more languages than public LibreTranslate instances
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURI(text)}`;

    const response = await axios.get(url);

    // Google Translate response format for 'single' endpoint: [[["translated", "original", ...]], ...]
    if (response.data && response.data[0]) {
      const translatedText = response.data[0].map(item => item[0]).join('');

      return res.status(200).json({
        success: true,
        translatedText: translatedText,
        detectedSourceLang: response.data[2] // Google sends detected language as the 3rd element
      });
    }

    throw new Error("Invalid response from translation service");

  } catch (error) {
    console.error("❌ Translation Error:", error.message);

    // Fallback or detailed error message
    return res.status(500).json({
      success: false,
      message: "An error occurred during translation. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = { translateText };