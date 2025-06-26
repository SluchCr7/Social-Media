const mongoose = require('mongoose')
const joi = require('joi')

const Reply2Schema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
        required: true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

const Reply2 = mongoose.model('Reply2', Reply2Schema)


const ValidateReply2 = (reply) => {
    const schema = joi.object({
        text: joi.string().required(),
    })
    return schema.validate(reply)
}

const ValidateUpdatedReply2 = (reply) => {
    const schema = joi.object({
        text: joi.string(),
    })
    return schema.validate(reply)
}


module.exports = {Reply2 , ValidateReply2 , ValidateUpdatedReply2}