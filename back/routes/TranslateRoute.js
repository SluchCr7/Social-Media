const express = require("express");
// const translateText = require("../Controllers/TranslateController");
const {translateText} = require("../Controllers/TranslateController");
const { verifyToken } = require('../Middelwares/verifyToken');
const route = express.Router();

// POST /api/translate
route.post("/", verifyToken, translateText);

module.exports = route;
