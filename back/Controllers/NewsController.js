const axios = require('axios');

const getNews = async (req, res) => {
  try {
    // استخدام قيم افتراضية فقط في حال عدم إرسالها من المستخدم
    const {
      category,
      country,
      lang,
      max
    } = req.query;

    const params = {
      apikey: process.env.SECRET_KEY_NEWS,
      category: category || 'general',  // الافتراضي: general
      country: country || 'us',         // الافتراضي: us
      lang: lang || 'en',               // الافتراضي: en
      max: max || 10                    // الافتراضي: 10 نتائج
    };

    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { getNews };
