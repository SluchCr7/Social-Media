const translateService = require("../Services/translateService");

/**
 * @desc Translate text to the requested language
 * @route POST /api/translate
 * @access Public
 */
const translateText = async (req, res) => {
  try {
    const result = await translateService.translateText(req.body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("❌ Translation Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during translation. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = { translateText };
