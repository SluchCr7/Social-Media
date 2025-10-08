const mongoose = require('mongoose');
const joi = require('joi');

const PostSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  Photos: {
    type: Array,
  },
  Videos: {
    type: Array,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledAt: { type: Date, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hahas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // ✅ مشاركة
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
  isShared: {
    type: Boolean,
    default: false,
  },
  
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private', 'custom'],
    default: 'public'
  },

  Hashtags: [
    {
      type: String,
    },
  ],

  // ✅ روابط
  links: [
    {
      type: String,
      validate: {
        validator: function (v) {
          // يتحقق أن الرابط يبدأ بـ http أو https
          return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: props => `${props.value} is not a valid URL`
      }
    }
  ],

  status: {
    type: String,
    enum: ["scheduled", "pending", "published", "failed"],
    default: "published",
  },

  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },

  isCommentOff: {
    type: Boolean,
    default: false
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId"
});

PostSchema.virtual("reports", {
  ref: "Report",
  localField: "_id",
  foreignField: "postId"
});

const Post = mongoose.model('Post', PostSchema);

// ✅ Joi Validation
const ValidatePost = (post) => {
  const schema = joi.object({
    text: joi.string().allow('', null),
    Hashtags: joi.array().items(joi.string()).optional(),
    community: joi.string().optional(),
    image: joi.any().optional(),
    mentions: joi.array().items(joi.string()).optional(),
    // ✅ تحقق من الروابط
    links: joi.array().items(
      joi.string().uri().message("Invalid link format")
    ).optional()
  });
  return schema.validate(post);
};

module.exports = { Post, ValidatePost };
