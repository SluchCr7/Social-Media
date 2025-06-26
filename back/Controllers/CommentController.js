const asyncHandler= require('express-async-handler')
const {Comment, ValidateComment , ValidateUpdateComment} = require('../Modules/Comment')

const getAllComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find().populate('owner').populate('postId')
    .populate({
        path: 'replies',
        populate: {
            path: 'owner',
            model: 'User',
        }
    })
    res.status(200).json(comments)
})

const addNewComment = asyncHandler(async (req, res) => {
    const { error } = ValidateComment(req.body)
    if (error) {
        res.status(400).json({message : error.details[0].message})
    }
    const postId = req.params.id
    const comment = new Comment({
        text: req.body.text,
        owner: req.user._id,
        postId: postId
    })
    await comment.save()
    res.status(201).json(comment)
})

const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        res.status(404)
        throw new Error('Comment not found')
    }
    await comment.remove()
    res.status(200).json({ message: 'Comment deleted' })
})

const getCommentById = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        res.status(404)
        throw new Error('Comment not found')
    }
    res.status(200).json(comment)
})


const likeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        res.status(404)
        throw new Error('Comment not found')
    }
    if(comment.likes.includes(req.user._id)){
        comment = await Comment.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Comment Unliked"})
    }else{
        comment = await Comment.findByIdAndUpdate(req.params.id, {
            $push: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Comment Liked"})
    }
})

const updateComment = asyncHandler(async (req, res) => {
    const { error } = ValidateUpdateComment(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    await Comment.findByIdAndUpdate(req.params.id, {
        $set: {
            text : req.body.text
        }
    },{new : true})
    res.status(200).json({message : "Comment Updated Successfully"})
})

module.exports = { getAllComments,updateComment, addNewComment, deleteComment, getCommentById , likeComment }
