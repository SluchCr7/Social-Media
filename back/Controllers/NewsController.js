const axios = require('axios');

const getNews = async (req, res) => {
  try {
    const { keywords = 'football', countries = 'gb' } = req.query;

    const response = await axios.get('http://api.mediastack.com/v1/news', {
      params: {
        access_key: process.env.SECRET_KEY_NEWS,
        keywords,
        countries
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { getNews };
