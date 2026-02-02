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
        default: "Single"
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
        default: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80"
    },
    duration: {
        type: Number, // بالثواني
    },
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
    },
    // ✅ الإضافات المطلوبة
    tags: [{
        type: String,
        trim: true
    }],
    releaseDate: {
        type: Date,
        default: Date.now
    },
    language: {
        type: String,
        trim: true,
        default: "Unknown"
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    listenCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// ✅ تحسين أداء البحث عن طريق الفهرسة
MusicSchema.index({
    title: 'text',
    artist: 'text',
    album: 'text',
    genre: 'text',
    tags: 'text'
});

MusicSchema.methods.updatePopularity = async function ({ threshold = 50 } = {}) {
    if (!this.likes) this.likes = [];

    const isNowPopular = this.likes.length >= threshold;

    // فقط احفظ إذا تغيرت الحالة
    if (this.isPopular !== isNowPopular) {
        this.isPopular = isNowPopular;
        await this.save();
    }

    return this;
};

// 🎯 Joi validation المحدثة
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
    cover: Joi.string().uri(),
    genre: Joi.string().valid("Pop", "Rock", "HipHop", "Jazz", "Classical", "Other").default("Other"),
    tags: Joi.array().items(Joi.string().trim()),
    releaseDate: Joi.date(),
    language: Joi.string().trim().default("Unknown")
});

const Music = mongoose.model('Music', MusicSchema);

module.exports = { Music, musicValidation };
