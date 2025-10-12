const mongoose = require("mongoose");
const Joi =require("joi");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    Photos : {
        type: Array,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    deletedFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    scheduledAt: { type: Date, default: null },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema)

const ValidateMessage = (message) => {
    const schema = Joi.object({
        text: Joi.string().required(),
    })
    return schema.validate(message)
}   

module.exports = { Message, ValidateMessage }