const mongoose = require('mongoose');
const Joi = require('joi');

const highlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  coverImage: {
    type: String
  },
  stories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Story" }
  ],
  archivedStories: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      text: { type: String },
      Photo: { type: Array },
      originalStory: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
      createdAt: { type: Date }
    }
  ],
  // Additional metadata
  viewCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  tags: [String],
  color: {
    type: String,
    default: '#6366f1'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for story count
highlightSchema.virtual('storyCount').get(function () {
  return this.archivedStories?.length || 0;
});

// Indexes for better performance
highlightSchema.index({ user: 1, createdAt: -1 });
highlightSchema.index({ user: 1, order: 1 });

// Validation schemas
function ValidateHighlight(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().max(50).required(),
    description: Joi.string().trim().max(200).allow(''),
    storyIds: Joi.array().items(Joi.string()),
    isPublic: Joi.boolean(),
    tags: Joi.array().items(Joi.string().max(20)),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    order: Joi.number().min(0)
  });
  return schema.validate(obj);
}

function ValidateHighlightUpdate(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().max(50),
    description: Joi.string().trim().max(200).allow(''),
    isPublic: Joi.boolean(),
    tags: Joi.array().items(Joi.string().max(20)),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    order: Joi.number().min(0)
  });
  return schema.validate(obj);
}

const Highlight = mongoose.model("Highlight", highlightSchema);

module.exports = {
  Highlight,
  ValidateHighlight,
  ValidateHighlightUpdate
};