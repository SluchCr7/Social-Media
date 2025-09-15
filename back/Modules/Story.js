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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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