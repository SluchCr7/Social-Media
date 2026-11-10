const newsService = require('../Services/newsService');

const getNews = async (req, res) => {
  try {
    const result = await newsService.getNews(req.query);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { getNews };
