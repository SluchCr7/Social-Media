const route = require('express').Router();
const {
    searchGlobal,
    getTrending,
    getSuggestedUsers,
    addToSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    getExploreContent
} = require('../Controllers/SearchController');
const { verifyToken } = require('../Middelwares/verifyToken');

route.get('/', verifyToken, searchGlobal);
route.get('/trending', verifyToken, getTrending);
route.get('/suggested-users', verifyToken, getSuggestedUsers);
route.get('/history', verifyToken, getSearchHistory);
route.post('/history', verifyToken, addToSearchHistory);
route.delete('/history', verifyToken, clearSearchHistory);
route.get('/explore', verifyToken, getExploreContent);

module.exports = route;
