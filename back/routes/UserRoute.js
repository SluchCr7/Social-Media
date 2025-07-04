const route = require('express').Router()
const { DeleteUser ,makeUserAdmin , getAllUsers , getUserById , RegisterNewUser , LoginUser, verifyAccount, uploadPhoto , makeFollow , updatePassword , updateProfile , savePost , pinPost} = require('../Controllers/UserController')
const photoUpload = require('../Middelwares/uploadPhoto')
const {verifyToken} = require('../Middelwares/verifyToken')
route.route("/")
    .get(getAllUsers)

route.route("/:id")
    .get(getUserById)
    .delete(DeleteUser)

route.route("/login")
    .post(LoginUser)

route.route("/register")    
    .post(RegisterNewUser)

route.route("/admin/:id")
    .put(makeUserAdmin)

route.route("/:id/verify/:token")
    .get(verifyAccount)

route.route("/photo")
    .post(verifyToken, photoUpload.single("image"), uploadPhoto)

route.route("/follow/:id")
    .put(verifyToken, makeFollow)
route.route('/save/:id')
    .put(verifyToken, savePost)

route.route('/update')
    .put(verifyToken, updateProfile)

route.route("/update/pass")
    .put(verifyToken, updatePassword)
    
route.route('/pin/:id')
    .put(verifyToken, pinPost)
    
module.exports = route