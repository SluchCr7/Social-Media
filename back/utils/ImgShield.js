const axios = require('axios');

/**
 * Automatically detects sensitive/NSFW content in an image using ImgShield API.
 * @param {string} imageUrl - The URL of the image to analyze.
 * @returns {Promise<boolean>} - Returns true if the image is sensitive, false otherwise.
 */
const checkImageSensitivity = async (imageUrl) => {
    try {
        const apiKey = process.env.IMGSHIELD_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ IMGSHIELD_API_KEY is missing. Sensitivity check skipped.");
            return false;
        }

        // 🔗 Sending image to ImgShield API
        // For demonstration, we assume the API endpoint is /analyze and expects an image_url
        const response = await axios.post('https://api.imgshield.io/v1/analyze', {
            image_url: imageUrl,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 5000 // 5 second timeout
        });

        // 🛠️ Parsing API response
        // Higher scores in nudity, violence, or explicit categories would set isSensitive to true
        // Assuming the API returns a boolean 'isSensitive' or a threshold-based result
        const isSensitive = response.data?.isSensitive ||
            (response.data?.nudity > 0.7) ||
            (response.data?.suggestive > 0.8);

        return !!isSensitive;

    } catch (error) {
        // 🚨 Error handling: Log the error but treat the image as safe by default (Requirement #4)
        console.error("❌ ImgShield API Failure:", error.message);
        return false;
    }
};

module.exports = { checkImageSensitivity };
