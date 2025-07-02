const mongoose = require('mongoose')
const joi = require('joi')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileName : {
        type: String,
        default : "@User_sluchit"
    },
    profilePhoto:{
        type : Object, 
        default:{
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId : null
        }
    },
    isAdmin: {
        type: Boolean,
        default : false
    },
    isVerify: {
        type: Boolean,
        default : false
    },
    description : {
        type: String,
        default : "Profile Description"
    },
    country : {
        type: String,
        default : "India"
    },
    phone : {
        type: String,
        default : "0000000000"
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    following : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    savedPosts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    pinsPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ], 
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject : {virtuals: true}
});

// Add virtual property Posts
UserSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "owner"
})
// Add virtual property Posts
UserSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "owner"
})

// Add virtual property Posts
UserSchema.virtual("replies", {
    ref: "Reply",
    localField: "_id",
    foreignField: "owner"
})

// Add virtual property Posts
UserSchema.virtual("replies2", {
    ref: "Reply2",
    localField: "_id",
    foreignField: "owner"
})

UserSchema.virtual("communities", {
    ref: "Community",
    localField: "_id",
    foreignField: "owner"
})
UserSchema.virtual("stories", {
    ref: "Story",
    localField: "_id",
    foreignField: "owner"
})

const User = mongoose.model('User', UserSchema)

const LoginValidate = (user) => {
    const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
    })
    return schema.validate(user)
}

const ValidateUser = (user) => {
    const schema = joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
    })
    return schema.validate(user)
}


const validateUserUpdate = (user) => {
    const schema = joi.object({
        username: joi.string(),
        description: joi.string(),
        profileName : joi.string(),
    })
    return schema.validate(user)
}

const validatePasswordUpdate = (user) => {
    const schema = joi.object({
        password: joi.string().required(),
    })
    return schema.validate(user)
}
module.exports = {User, LoginValidate, ValidateUser, validateUserUpdate, validatePasswordUpdate}