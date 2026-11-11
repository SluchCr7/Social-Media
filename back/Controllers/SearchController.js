const asyncHandler = require("express-async-handler");
const searchService = require("../Services/searchService");

const searchGlobal = asyncHandler(async (req, res) => {
    const { q = '', type = 'all', sortBy = 'relevance', dateRange = 'all', hasMedia = 'false', verifiedOnly = 'false' } = req.query;
    if (
        typeof q !== 'string' ||
        q.length > 100 ||
        !['all', 'users', 'posts', 'communities', 'hashtags'].includes(type) ||
        !['relevance', 'recent', 'popular'].includes(sortBy) ||
        !['all', 'day', 'week', 'month', 'year'].includes(dateRange) ||
        !['true', 'false'].includes(hasMedia) ||
        !['true', 'false'].includes(verifiedOnly)
    ) {
        return res.status(400).json({ message: 'Invalid search query.' });
    }

    const results = await searchService.searchGlobal(req.query);
    res.status(200).json(results);
});

const getTrending = asyncHandler(async (req, res) => {
    const results = await searchService.getTrending();
    res.status(200).json(results);
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
    const users = await searchService.getSuggestedUsers(req.user._id);
    res.status(200).json(users);
});

const addToSearchHistory = asyncHandler(async (req, res) => {
    const result = await searchService.addToSearchHistory(req.body, req.user._id);
    res.status(result.status).json(result.body);
});

const getSearchHistory = asyncHandler(async (req, res) => {
    const history = await searchService.getSearchHistory(req.user._id);
    res.status(200).json(history);
});

const clearSearchHistory = asyncHandler(async (req, res) => {
    const result = await searchService.clearSearchHistory(req.query.id, req.user._id);
    res.status(result.status).json(result.body);
});

const getExploreContent = asyncHandler(async (req, res) => {
    if (!['trending', 'photos', 'videos', 'tags', 'users'].includes(req.query.tab || 'trending')) {
        return res.status(400).json({ message: 'Invalid Explore tab.' });
    }
    const content = await searchService.getExploreContent(req.query, req.user._id);
    res.status(200).json(content);
});

module.exports = {
    searchGlobal,
    getTrending,
    getSuggestedUsers,
    addToSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    getExploreContent
};
