const route = require('express').Router();
const {sendResetPasswordLink , resetPassword} = require("../Controllers/PassController")

route.route("/reset")
    .post(sendResetPasswordLink)
route.route("/reset-password/:id/:token")
    .post(resetPassword)
module.exports = route