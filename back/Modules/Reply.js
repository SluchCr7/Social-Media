const mongoose = require('mongoose')
const joi = require('joi')

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true  ,   
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property for comments
replySchema.virtual("repliesForward", {
    ref: "Reply2",
    localField: "_id",
    foreignField: "replyId"
});

const Reply = mongoose.model('Reply', replySchema)

const ValidateReply = (reply) => {
    const schema = joi.object({
        text: joi.string().required(),
    })
    return schema.validate(reply)
}
const ValidateUpdatedReply = (reply) => {
    const schema = joi.object({
        text: joi.string(),
    })
    return schema.validate(reply)
}

module.exports = { Reply , ValidateReply , ValidateUpdatedReply }