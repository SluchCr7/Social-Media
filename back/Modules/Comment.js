const mongoose = require('mongoose');
const joi = require('joi');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isEdited: { type: Boolean, default: false },

  // Unified Target System
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Post', 'Reel', 'Comment'],
    default: 'Post'
  },

  // Optimized hierarchy for fetching full trees
  rootId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'rootType',
    index: true
  },
  rootType: {
    type: String,
    enum: ['Post', 'Reel'],
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private', 'community'],
    default: 'public'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// 🚀 Performance Indexing for Pagination & Lazy Loading
commentSchema.index({ targetId: 1, targetType: 1, createdAt: -1, _id: -1 });
commentSchema.index({ rootId: 1, rootType: 1, createdAt: -1, _id: -1 });
commentSchema.index({ owner: 1, createdAt: -1 });

// Virtual for replies to maintain compatibility with existing tree builders if needed
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'targetId',
  match: { targetType: 'Comment' }
});

const Comment = mongoose.model('Comment', commentSchema);

const ValidateComment = (comment) => {
  const schema = joi.object({
    text: joi.string().required(),
    targetId: joi.string().required(),
    targetType: joi.string().valid('Post', 'Reel', 'Comment').required(),
  });
  return schema.validate(comment);
};

const ValidateUpdateComment = (comment) => {
  const schema = joi.object({
    text: joi.string(),
  });
  return schema.validate(comment);
};

module.exports = { Comment, ValidateComment, ValidateUpdateComment };
