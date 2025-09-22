const mongoose = require('mongoose')
const joi = require('joi')

// const reportSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 500
//   },
//   reason: {
//     type: String,
//     enum: ["spam", "harassment", "violence", "nudity", "hate", "other"],
//     default: "other",
//     required: true
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   postId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Post',
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ["pending", "reviewed", "rejected", "resolved"],
//     default: "pending"
//   }
// }, {
//   timestamps: true
// })

// // 🔒 منع التكرار
// reportSchema.index({ owner: 1, postId: 1 }, { unique: true });

// const Report = mongoose.model('Report', reportSchema)

// const ValidateReport = (data) => {
//   const schema = joi.object({
//     text: joi.string().min(5).max(500).required(),
//     postId: joi.string().required(),
//     reason: joi.string().valid("spam", "harassment", "violence", "nudity", "hate", "other").required()
//   })
//   return schema.validate(data)
// }


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
  reportedOnType: {
    type: String,
    enum: ["post", "comment", "user"],
    default: "post",
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "rejected", "resolved"],
    default: "pending"
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low"
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 🔒 منع التكرار حسب نوع البلاغ والهدف
reportSchema.index({ owner: 1, reportedOnType: 1, postId: 1, commentId: 1, reportedUserId: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema);
const ValidateReport = (data) => {
  const schema = joi.object({
    text: joi.string().min(5).max(500).required(),
    reason: joi.string().valid("spam", "harassment", "violence", "nudity", "hate", "other").required(),
    reportedOnType: joi.string().valid("post", "comment", "user").required(),
    postId: joi.when('reportedOnType', { is: 'post', then: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), otherwise: joi.forbidden() }),
    commentId: joi.when('reportedOnType', { is: 'comment', then: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), otherwise: joi.forbidden() }),
    reportedUserId: joi.when('reportedOnType', { is: 'user', then: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), otherwise: joi.forbidden() }),
    severity: joi.string().valid("low", "medium", "high", "critical").optional()
  });
  return schema.validate(data);
};


module.exports = {
  Report,
  ValidateReport
}