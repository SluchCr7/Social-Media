const mongoose = require('mongoose');
const joi = require('joi');
const slugify = require('slugify'); // لتوليد slug تلقائياً

const communitySchema = new mongoose.Schema({
    Picture: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId: null
        }
    },
    Cover: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId: null
        }
    },
    Name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        default: "Group Description"
    },
    members: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    Admins: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    Category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    rules: {
        type: [String],
        default: []
    },
    joinRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    isPrivate: {
        type: Boolean,
        default: false
    },
    isForAdults: {
        type: Boolean,
        default: false
    },
    memberCount: {
        type: Number,
        default: 0
    },
    postCount: {
        type: Number,
        default: 0
    },
    pinnedPosts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    ]
}, { timestamps: true });

// توليد slug تلقائياً قبل حفظ الـ document
communitySchema.pre('save', function(next) {
    if (this.isModified('Name')) {
        this.slug = slugify(this.Name, { lower: true, strict: true });
    }
    next();
});

const Community = mongoose.model('Community', communitySchema);

// Joi Validation
const ValidateCommunity = (obj) => {
    const schema = joi.object({
        Name: joi.string().required(),
        description: joi.string(),
        isPrivate: joi.boolean(),
        Category: joi.string().required(),
        tags: joi.array().items(joi.string()),
        rules: joi.array().items(joi.string()),
        isForAdults: joi.boolean()
    });
    return schema.validate(obj, { abortEarly: false });
}

const ValidateCommunityUpdate = (obj) => {
    const schema = joi.object({
        Name: joi.string(),
        description: joi.string(),
        isPrivate: joi.boolean(),
        tags: joi.array().items(joi.string()),
        rules: joi.array().items(joi.string()),
        isForAdults: joi.boolean()
    });
    return schema.validate(obj, { abortEarly: false });
}

module.exports = { Community, ValidateCommunity, ValidateCommunityUpdate };
