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
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent',
});

const Comment = mongoose.model('Comment', commentSchema);

const ValidateComment = (comment) => {
  const schema = joi.object({
    text: joi.string().required(),
    parent: joi.string().allow(null),
    postId: joi.string().required(),
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


// const mongoose = require('mongoose')
// const joi = require('joi')

// const commentSchema = new mongoose.Schema({
//     text: {
//         type: String,
//         required: true
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     postId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Post',
//         required: true
//     },
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject : {virtuals: true}
// });

// // Add virtual property Posts
// commentSchema.virtual("replies", {
//     ref: "Reply",
//     localField: "_id",
//     foreignField: "commentId"
// })

// const Comment = mongoose.model('Comment', commentSchema)

// const ValidateComment = (comment) => {
//     const schema = joi.object({
//         text: joi.string().required(),
//     })
//     return schema.validate(comment)
// }
// const ValidateUpdateComment = (comment) => {
//     const schema = joi.object({
//         text: joi.string(),
//     })
//     return schema.validate(comment)
// }

// module.exports = { Comment, ValidateComment , ValidateUpdateComment }