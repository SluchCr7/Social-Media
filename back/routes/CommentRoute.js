const { getAllComments, addNewComment,updateComment, deleteComment, getCommentById , likeComment} = require('../Controllers/CommentController')
const route = require('express').Router()
const { verifyToken } = require('../Middelwares/verifyToken')

route.route('/')
    .get(getAllComments)

route.route('/add/:id')
    .post(verifyToken,addNewComment)

route.route('/:id')
    .get(getCommentById)
    .delete(deleteComment)

route.route('/like/:id')
    .put(verifyToken, likeComment)
    
route.route('/update/:id')
    .put(verifyToken,updateComment)
module.exports = route