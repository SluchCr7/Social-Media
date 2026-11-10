const axios = require('axios');

const getNews = async (query) => {
  try {
    const { category, country, lang, max } = query;
    const params = {
      apikey: process.env.SECRET_KEY_NEWS,
      category: category || 'general',
      country: country || 'us',
      lang: lang || 'en',
      max: max || 10
    };

    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params,
    });

    return { status: 200, body: response.data };
  } catch (error) {
    console.error('Error fetching news:', error.message);
    return { status: 500, body: { error: 'Failed to fetch news' } };
  }
};

module.exports = { getNews };
