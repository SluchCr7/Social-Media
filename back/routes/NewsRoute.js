const route = require('express').Router()
const { getNews } = require('../Controllers/NewsController')

route.route('/')
    .get(getNews)

module.exports = route