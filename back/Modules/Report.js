const mongoose = require('mongoose')
const joi = require('joi')

const reportSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true
})

const Report = mongoose.model('Report', reportSchema)


const ValidateReport = (data) => {
    const schema = joi.object({
        text: joi.string().required(),
        postId: joi.string().required()
    })
    return schema.validate(data)
}
module.exports = {
    Report,
    ValidateReport
}