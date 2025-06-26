const asyncHandler= require('express-async-handler')
const {Reply2 , ValidateReply2 , ValidateUpdatedReply2 } = require('../Modules/Reply2')

const getAllRepliesonReply = asyncHandler(async (req, res) => {
    const replies = await Reply2.find().populate({
        path: 'owner',
        model: 'User'
    }).populate({
        path: 'replyId',
        model: 'Reply'
    })
    res.status(200).json(replies)
})

const addNewReply = asyncHandler(async (req, res) => {
    const { error } = ValidateReply2(req.body)
    if (error) {
        res.status(400).json({message : error.details[0].message})
    }
    const reply = new Reply2({
        text: req.body.text,
        owner: req.user._id,
        replyId: req.params.id
    })
    await reply.save()
    res.status(201).json(reply)
})

const deleteReply = asyncHandler(async (req, res) => {
    const reply = await Reply2.findById(req.params.id)
    if (!reply) {
        res.status(404)
        throw new Error('Reply not found')
    }
    await reply.remove()
    res.status(200).json({ message: 'Reply deleted' })
})

const getReplyById = asyncHandler(async (req, res) => {
    const reply = await Reply2.findById(req.params.id)
    if (!reply) {
        res.status(404)
        throw new Error('Reply not found')
    }
    res.status(200).json(reply)
})

const likeReplyForward = asyncHandler(async (req, res) => {
    const reply = await Reply2.findById(req.params.id)
    if (!reply) {
        res.status(404)
        throw new Error('Reply not found')
    }
    if(reply.likes.includes(req.user._id)){
        reply = await Reply2.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Reply Unliked"})
    }else{
        reply = await Reply2.findByIdAndUpdate(req.params.id, {
            $push: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Reply Liked"})
    }
})


const editReply2 = asyncHandler(async (req, res) => {
    const { error } = ValidateUpdatedReply2(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    await Reply2.findByIdAndUpdate(req.params.id, {
        $set: {
            text : req.body.text
        }
    },{new : true})
    res.status(200).json({message : "Reply Updated Successfully"})
})


module.exports = {getAllRepliesonReply, addNewReply, editReply2, deleteReply, getReplyById,likeReplyForward}