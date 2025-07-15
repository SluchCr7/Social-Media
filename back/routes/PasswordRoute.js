const route = require('express').Router();
const bcrypt = require("bcrypt");
const {sendResetPasswordLink , resetPassword} = require("../Controllers/PassController")
const { verifyToken } = require('../Middelwares/verifyToken')

route.route("/reset")
    .post(sendResetPasswordLink)
route.route("/reset-password/:id/:token")
    .get(verifyToken , resetPassword)
module.exports = route