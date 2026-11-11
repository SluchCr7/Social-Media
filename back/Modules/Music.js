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
    publicId: {
        type: String,
        trim: true,
    },
    cover: {
        type: String,
        default: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80"
    },
    coverPublicId: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number, // بالثواني
    },
    genre: {
        type: String,
        enum: ["Pop", "Rock", "HipHop", "Jazz", "Classical", "Lo-Fi", "Electronic", "Ambient", "Trap", "Other"],
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
MusicSchema.index({ genre: 1, createdAt: -1 });
MusicSchema.index({ isTrending: 1, listenCount: -1 });

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
    title: Joi.string().trim().max(120),
    artist: Joi.string().trim().max(120),
    album: Joi.string().trim().max(120),
    url: Joi.string().uri().optional().allow("").messages({
        'string.uri': 'Invalid URL format'
    }),
    cover: Joi.string().uri(),
    genre: Joi.string().valid("Pop", "Rock", "HipHop", "Jazz", "Classical", "Lo-Fi", "Electronic", "Ambient", "Trap", "Other"),
    tags: Joi.array().items(Joi.string().trim().max(40)).max(20),
    releaseDate: Joi.date(),
    language: Joi.string().trim().max(40)
}).min(1);

const Music = mongoose.model('Music', MusicSchema);

module.exports = { Music, musicValidation };
