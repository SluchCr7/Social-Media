const mongoose = require('mongoose')
const joi = require('joi')

const reportSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  reason: {
    type: String,
    enum: ["spam", "harassment", "violence", "nudity", "hate", "other"],
    default: "other",
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "rejected", "resolved"],
    default: "pending"
  }
}, {
  timestamps: true
})

// 🔒 منع التكرار
reportSchema.index({ owner: 1, postId: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema)

const ValidateReport = (data) => {
  const schema = joi.object({
    text: joi.string().min(5).max(500).required(),
    postId: joi.string().required(),
    reason: joi.string().valid("spam", "harassment", "violence", "nudity", "hate", "other").required()
  })
  return schema.validate(data)
}

module.exports = {
  Report,
  ValidateReport
}
