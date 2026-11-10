const axios = require("axios");

const translateText = async (body) => {
  try {
    const { text, targetLang } = body;

    if (!text || !targetLang) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Please provide both text and target language."
        }
      };
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURI(text)}`;
    const response = await axios.get(url);

    if (response.data && response.data[0]) {
      const translatedText = response.data[0].map(item => item[0]).join('');

      return {
        status: 200,
        body: {
          success: true,
          translatedText: translatedText,
          detectedSourceLang: response.data[2]
        }
      };
    }

    throw new Error("Invalid response from translation service");
  } catch (error) {
    console.error("❌ Translation Error:", error.message);
    return {
      status: 500,
      body: {
        success: false,
        message: "An error occurred during translation. Please try again later.",
        error: error.message,
      }
    };
  }
};

module.exports = { translateText };
