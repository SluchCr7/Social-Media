const mongoose = require('mongoose');
const joi = require('joi');
const User = require('./User'); // تأكد من المسار الصحيح لموديل المستخدم

const PostSchema = new mongoose.Schema({
  text: String,
  Photos: Array,
  Videos: Array,
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
  originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  isShared: { type: Boolean, default: false },
  privacy: { type: String, enum: ['public', 'friends'], default: 'public' },
  Hashtags: [String],
  links: [{
    type: String,
    validate: {
      validator: v => /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(v),
      message: props => `${props.value} is not a valid URL`
    }
  }],
  status: { type: String, enum: ["scheduled", "pending", "published", "failed"], default: "published" },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },
  isCommentOff: { type: Boolean, default: false },
  isContainWorst: { type: Boolean, default: false },
  music: { type: mongoose.Schema.Types.ObjectId, ref: 'Music', default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Virtuals
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

// ✅ بعد الحفظ (create أو save)
PostSchema.post('save', async function (doc, next) {
  try {
    if (doc.isContainWorst && doc.owner) {
      await User.findByIdAndUpdate(doc.owner, { $set: { isContainAdultContent: true } });
    }
    next();
  } catch (err) {
    console.error("Error updating user adult content flag after save:", err);
    next(err);
  }
});

// ✅ بعد التعديل (findOneAndUpdate)
PostSchema.post('findOneAndUpdate', async function (doc, next) {
  try {
    if (!doc) return next();

    // إذا تم تعيين isContainWorst إلى true
    if (doc.isContainWorst && doc.owner) {
      await User.findByIdAndUpdate(doc.owner, { $set: { isContainAdultContent: true } });
    }

    next();
  } catch (err) {
    console.error("Error updating user adult content flag after update:", err);
    next(err);
  }
});

// ✅ Joi Validation
const ValidatePost = (post) => {
  const schema = joi.object({
    text: joi.string().allow('', null),
    Hashtags: joi.array().items(joi.string()).optional(),
    community: joi.string().optional(),
    image: joi.any().optional(),
    mentions: joi.array().items(joi.string()).optional(),
    links: joi.array().items(
      joi.string().uri().message("Invalid link format")
    ).optional()
  });
  return schema.validate(post);
};

const Post = mongoose.model('Post', PostSchema);
module.exports = { Post, ValidatePost };
