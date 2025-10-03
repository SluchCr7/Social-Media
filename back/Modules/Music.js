const mongoose = require('mongoose');
const Joi = require('joi');

const MusicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    album: {
        type: String,
        trim: true,
        default: "Single"  // لو مش مرتبط بألبوم
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^https?:\/\/.+/.test(v),
            message: 'Invalid URL'
        }
    },
    cover: {
        type: String,
    },
    // duration: {
    //     type: Number, // بالثواني
    //     required: false
    // },
    genre: {
        type: String,
        enum: ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Other"],
        default: "Other"
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});


const musicValidation = Joi.object({
    title: Joi.string().trim().required().messages({
        'string.empty': 'Title is required'
    }),
    artist: Joi.string().trim().required().messages({
        'string.empty': 'Artist is required'
    }),
    album: Joi.string().trim().optional().allow(""),
    url: Joi.string().uri().required().messages({
        'string.uri': 'Invalid URL format'
    }),
    cover: Joi.string(),
    genre: Joi.string().valid("Pop", "Rock", "HipHop", "Jazz", "Classical", "Other").default("Other"),
});


const Music = mongoose.model('Music', MusicSchema);

module.exports = { Music, musicValidation };