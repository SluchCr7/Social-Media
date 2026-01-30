const route = require('express').Router();
const { searchGlobal } = require('../Controllers/SearchController');
const { verifyToken } = require('../Middelwares/verifyToken');

route.get('/', verifyToken, searchGlobal);

module.exports = route;
