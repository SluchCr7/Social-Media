const asyncHandler= require('express-async-handler')
const {Reply , ValidateReply , ValidateUpdatedReply} = require('../Modules/Reply')

const getAllReplies = asyncHandler(async (req, res) => {
    const replies = await Reply.find().populate({
        path: 'owner',
        model: 'User'
    }).populate({
        path: 'commentId',
        model: 'Comment'
    }).populate('repliesForward')
    res.status(200).json(replies)
})

const addNewReply = asyncHandler(async (req, res) => {
    const { error } = ValidateReply(req.body)
    if (error) {
        res.status(400).json({message : error.details[0].message})
    }
    const reply = new Reply({
        text: req.body.text,
        owner: req.user._id,
        commentId: req.params.id
    })
    await reply.save()
    res.status(201).json(reply)
})

const deleteReply = asyncHandler(async (req, res) => {
    const reply = await Reply.findById(req.params.id)
    if (!reply) {
        res.status(404)
        throw new Error('Reply not found')
    }
    await reply.remove()
    res.status(200).json({ message: 'Reply deleted' })
})

const getReplyById = asyncHandler(async (req, res) => {
    const reply = await Reply.findById(req.params.id)
    if (!reply) {
        res.status(404)
        throw new Error('Reply not found')
    }
    res.status(200).json(reply)
})

const likeReply = asyncHandler(async (req, res) => {
    const reply = await Reply.findById(req.params.id)
    if (!reply) {
        res.status(404)
        throw new Error('Reply not found')
    }
    if(reply.likes.includes(req.user._id)){
        reply = await Reply.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Reply Unliked"})
    }else{
        reply = await Reply.findByIdAndUpdate(req.params.id, {
            $push: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Reply Liked"})
    }
})

const editReply = asyncHandler(async (req, res) => {
    const { error } = ValidateUpdatedReply(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    await Reply.findByIdAndUpdate(req.params.id, {
        $set: {
            text : req.body.text
        }
    },{new : true})
    res.status(200).json({message : "Reply Updated Successfully"})
})

module.exports = {getAllReplies , addNewReply , deleteReply ,editReply, getReplyById , likeReply}