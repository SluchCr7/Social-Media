const { getAllReplies , addNewReply , deleteReply ,editReply, getReplyById , likeReply } = require('../Controllers/ReplyController')
const route = require('express').Router()
const { verifyToken } = require('../Middelwares/verifyToken')

route.route('/')
    .get(getAllReplies)

route.route('/add/:id')
    .post(verifyToken,addNewReply)

route.route('/:id')
    .get(getReplyById)
    .delete(deleteReply)

route.route("/like/:id")
    .put(verifyToken, likeReply)

route.route("/update/:id")
    .put(editReply)
    
module.exports = route  