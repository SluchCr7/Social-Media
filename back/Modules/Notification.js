const mongoose = require('mongoose');
const joi = require('joi');

const notificationSchema = new mongoose.Schema({
    content : {
        type: String,
        required: true
    },
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true,
})

const Notification = mongoose.model('Notification', notificationSchema)

const ValidateNotification = (notification) => {
    const schema = joi.object({
        content: joi.string().required(),
    })
    return schema.validate(notification)
}

module.exports = { Notification, ValidateNotification }