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
    profileName: {
        type: String,
        default: "@User_sluchit",
        // unique: true
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId: null,
            isSensitive: false
        }
    },
    coverPhoto: {
        type: Object,
        default: {
            url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
            publicId: null,
            isSensitive: false
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    verifyAt: {
        type: Date
    },
    description: {
        type: String,
        default: "Profile Description"
    },
    isAccountWithPremiumVerify: {
        type: Boolean,
        default: false
    },
    country: {
        type: String,
        default: "Unknown"
    },
    city: {
        type: String,
        default: "Unknown"
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
    phone: {
        type: String,
        default: ""
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
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
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
            ref: "Post"
        }
    ],
    lastLogin: {
        type: Date,
        default: Date.now
    },

    loginHistory: [
        {
            date: { type: Date, default: Date.now }, // وقت تسجيل الدخول
            ip: { type: String },                    // عنوان IP (اختياري)
            device: { type: String },                // نوع الجهاز (اختياري)
            location: { type: String },              // الدولة أو المدينة (اختياري)
        }
    ],

    accountStatus: {
        type: String,
        enum: ['active', 'banned', 'suspended'],
        default: 'active'
    },
    suspendedUntil: {
        type: Date, // التاريخ اللي هينتهي عنده الـ suspension
        default: null
    },
    userLevelRank: {
        type: String,
        enum: ["Junior", "Challenger", "Warrior", "Elite", "Master", "Legend"],
        default: "Junior"
    },
    userLevelPoints: {
        type: Number,
        default: 0
    },
    nextLevelPoints: {
        type: Number,
        default: 2000  // أول ليفل بعد Junior
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
        type: Date,
        default: null
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    acceptedTerms: {
        type: Boolean,
        default: false
    },
    acceptedCookies: {
        type: Boolean,
        default: false
    },
    preferedLanguage: {
        type: String,
        default: "English"
    },
    interests: {
        type: [String],
        default: ["General"]
    },
    myMusicPlaylist: {
        type: Array,
        default: []
    },
    isContainAdultContent: {
        type: Boolean,
        default: false
    },
    showOnlineStatus: {
        type: Boolean,
        default: true
    },
    BlockedNotificationFromUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    savedReels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel"
        }
    ],
    searchHistory: [
        {
            query: String,
            searchType: { type: String, enum: ['user', 'post', 'community', 'hashtag', 'text'], default: 'text' },
            refId: { type: mongoose.Schema.Types.ObjectId }, // Optional reference to the searched item
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 🔹 Virtuals
UserSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "owner"
})

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

UserSchema.virtual("joinedCommunities", {
    ref: "Community",              // الموديل المرتبط
    localField: "_id",             // هذا المستخدم
    foreignField: "members",       // مكان تخزين المستخدم في مجتمع
});
UserSchema.virtual("adminCommunities", {
    ref: "Community",
    localField: "_id",
    foreignField: "Admins",
});

UserSchema.virtual("stories", {
    ref: "Story",
    localField: "_id",
    foreignField: "owner",
    match: { isDeleted: false }
})

UserSchema.virtual("activeStories", {
    ref: "Story",
    localField: "_id",
    foreignField: "owner",
    match: () => ({
        expiresAt: { $gt: new Date() },
        isArchived: false,
        isDeleted: false
    })
})

UserSchema.virtual("reports", {
    ref: "Report",
    localField: "_id",
    foreignField: "owner"
})

UserSchema.virtual("notifications", {
    ref: "Notification",
    localField: "_id",
    foreignField: "receiver",
});
UserSchema.virtual("reels", {
    ref: "Reel",
    localField: "_id",
    foreignField: "owner",
});
UserSchema.virtual("audios", {
    ref: "Music",
    localField: "_id",
    foreignField: "owner",
});
UserSchema.virtual("highlights", {
    ref: "Highlight",
    localField: "_id",
    foreignField: "user",
});

// 🔹 Update Level Rank
UserSchema.methods.updateLevelRank = function () {
    if (this.userLevelPoints >= 15000) {
        this.userLevelRank = "Legend";
        this.nextLevelPoints = 15000;
        this.isAccountWithPremiumVerify = true
    } else if (this.userLevelPoints >= 10000) {
        this.userLevelRank = "Master";
        this.nextLevelPoints = 15000;
    } else if (this.userLevelPoints >= 7000) {
        this.userLevelRank = "Elite";
        this.nextLevelPoints = 10000;
    } else if (this.userLevelPoints >= 4000) {
        this.userLevelRank = "Warrior";
        this.nextLevelPoints = 7000;
    } else if (this.userLevelPoints >= 2000) {
        this.userLevelRank = "Challenger";
        this.nextLevelPoints = 4000;
    } else {
        this.userLevelRank = "Junior";
        this.nextLevelPoints = 2000;
    }
};

const User = mongoose.model('User', UserSchema)

// ================== Joi Validations ==================
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
        city: joi.string().max(50).allow(null),
        socialLinks: joi.object({
            github: joi.string().uri().allow('', null),
            twitter: joi.string().uri().allow('', null),
            linkedin: joi.string().uri().allow('', null),
            facebook: joi.string().uri().allow('', null),
            website: joi.string().uri().allow('', null),
        }).default({}),
        relationshipStatus: joi.string().valid('Single', 'In a Relationship', 'Married', "It's Complicated").allow(null),
        partner: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null),
        interests: joi.array().items(joi.string()).allow(null),
        showOnlineStatus: joi.boolean().allow(null),
        preferedLanguage: joi.string().allow('', null),
    })

    return schema.validate(user)
}


const validatePasswordUpdate = (user) => {
    const schema = joi.object({
        oldPassword: joi.string().required(),
        newPassword: joi.string().min(6).required(),
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
    });
    return schema.validate(user);
};

module.exports = {
    User,
    validateUserLinks,
    LoginValidate,
    validateEmail,
    ValidateUser,
    validateUserUpdate,
    validatePasswordUpdate
}
