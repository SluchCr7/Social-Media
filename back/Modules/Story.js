const mongoose = require('mongoose');
const joi = require('joi');

const StorySchema = new mongoose.Schema({
    text: {
        type: String,
    },
    Photo: {
        type: Array, // Stores media URL
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reactions: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            emoji: { type: String }, // e.g., '🔥', '😂', '😮'
            createdAt: { type: Date, default: Date.now }
        }
    ],
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    originalStory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        default: null,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    music: {
        title: String,
        artist: String,
        url: String,
        cover: String
    },
    link: {
        url: String,
        text: String
    },
    isShared: {
        type: Boolean,
        default: false,
    },
    isHighlighted: {
        type: Boolean,
        default: false,
    },
    highlightIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Highlight'
        }
    ],
    preserveAfterExpiration: {
        type: Boolean,
        default: false
    },
    isCloseFriends: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 24 * 60 * 60 * 1000) // Default 24h
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

// Virtual for isExpired
StorySchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});

StorySchema.index({ owner: 1, expiresAt: -1 });
StorySchema.index({ expiresAt: 1 });
StorySchema.index({ highlightIds: 1 });

const Story = mongoose.model('Story', StorySchema)

const validateStory = (story) => {
    const schema = joi.object({
        text: joi.string(),
        Photo: joi.array(),
    })
    return schema.validate(story)
}


module.exports = { Story, validateStory }