const mongoose = require('mongoose');
const joi = require('joi');

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
}, { timestamps: true });

communitySchema.index({ Category: 1 });
communitySchema.index({ members: 1 });
communitySchema.index({ isPrivate: 1 });
communitySchema.index({ isPrivate: 1, owner: 1, members: 1 });

const Community = mongoose.model('Community', communitySchema);

// Joi Validation
const ValidateCommunity = (obj) => {
    const schema = joi.object({
        Name: joi.string().trim().min(2).max(80).required(),
        description: joi.string().trim().max(500),
        isPrivate: joi.boolean(),
        Category: joi.string().trim().min(1).max(40).required(),
        tags: joi.array().max(12).items(joi.string().trim().min(1).max(30)),
        rules: joi.array().max(20).items(joi.string().trim().min(1).max(200)),
        isForAdults: joi.boolean()
    });
    return schema.validate(obj, { abortEarly: false });
}

const ValidateCommunityUpdate = (obj) => {
    const schema = joi.object({
        Name: joi.string().trim().min(2).max(80),
        Category: joi.string().trim().min(1).max(40),
        description: joi.string().trim().max(500),
        isPrivate: joi.boolean(),
        tags: joi.array().max(12).items(joi.string().trim().min(1).max(30)),
        rules: joi.array().max(20).items(joi.string().trim().min(1).max(200)),
        isForAdults: joi.boolean()
    });
    return schema.validate(obj, { abortEarly: false });
}

module.exports = { Community, ValidateCommunity, ValidateCommunityUpdate };
