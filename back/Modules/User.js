
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
    verifyAt : {
        type: Date
    },
    description : {
        type: String,
        default : "Profile Description"
    },
    country: {
        type: String,
        default: "Unknown"
    },
    city : {
        type: String,
        default : "Unknown"
    },
    relationshipStatus: {
        type: String,
        enum: ['Single', 'In a Relationship', 'Married', "It's Complicated"],
        default: 'Single'
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    phone : {
        type: String,
        default : ""
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
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
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
    },
    accountStatus: {
        type: String,
        enum: ['active', 'banned', 'suspended'],
        default: 'active'
    }, 
    userLevelRank : {
        type: String,
        enum: ["Junior", "Intermediate", "Advanced", "Pro"],
        default: "Junior"
    },
    userLevelPoints : {
        type: Number,
        default: 0
    },
    socialLinks: {
        github: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        facebook: { type: String, default: "" },
        website: { type: String, default: "" },
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    dateOfBirth: {
        type : Date,
        default : null
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
    },
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
UserSchema.virtual("reports", {
    ref: "Report",
    localField: "_id",
    foreignField: "owner"
})

UserSchema.methods.updateLevelRank = function () {
  if (this.userLevelPoints >= 2000) this.userLevelRank = "Pro";
  else if (this.userLevelPoints >= 1000) this.userLevelRank = "Advanced";
  else if (this.userLevelPoints >= 500) this.userLevelRank = "Intermediate";
  else this.userLevelRank = "Junior";
};

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
    username: joi.string().min(3).max(30),
    description: joi.string().max(500).allow('', null),
    profileName: joi.string().min(3).max(50).allow('', null),
    country: joi.string().max(50).allow('', null),
    phone: joi.string().pattern(/^\+?[0-9\s\-]{7,20}$/).allow('', null),
    dateOfBirth: joi.date().less('now').allow(null),  
    gender: joi.string().valid('Male', 'Female', 'Other').allow(null),
    city : joi.string().max(50).allow(null),
    socialLinks: joi.object({
        github: joi.string().uri().allow('', null),
        twitter: joi.string().uri().allow('', null),
        linkedin: joi.string().uri().allow('', null),
        facebook: joi.string().uri().allow('', null),
        website: joi.string().uri().allow('', null),
    }).default({}),
    relationshipStatus: joi.string().valid('Single', 'In a Relationship', 'Married', "It's Complicated").allow(null),
    partner: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
  })

  return schema.validate(user)
}


const validatePasswordUpdate = (user) => {
    const schema = joi.object({
        password: joi.string().required(),
    })
    return schema.validate(user)
}


const validateEmail = (user) => {
    const schema = joi.object({
        email: joi.string().email().required(),
    });
    return schema.validate(user);
}

const validateUserLinks = (user) => {
  const schema = joi.object({
    socialLinks: joi.object({
      github: joi.string().uri().allow(""),
      twitter: joi.string().uri().allow(""),
      linkedin: joi.string().uri().allow(""),
      facebook: joi.string().uri().allow(""),
      website: joi.string().uri().allow(""),
    }),
    // باقي الحقول الأخرى...
  });
  return schema.validate(user);
};

module.exports = {User,validateUserLinks, LoginValidate,validateEmail, ValidateUser, validateUserUpdate, validatePasswordUpdate}