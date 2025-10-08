const mongoose = require('mongoose');
const joi = require('joi');

const StorySchema = new mongoose.Schema({
    text: {
        type: String,
    },
    Photo: {
        type: Array,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    originalStory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        default: null,
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isShared: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const Story = mongoose.model('Story', StorySchema)

const validateStory = (story) => {
    const schema = joi.object({
        text: joi.string(),
        Photo: joi.array(),
    })
    return schema.validate(story)
}


module.exports = { Story, validateStory }