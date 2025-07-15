const mongoose = require('mongoose')
const joi = require('joi')

const PostSchema = new mongoose.Schema({
    text: {
      type: String,
    },
    Photos: {
      type: Array,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // New fields for sharing
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    Hashtags: [
      {
        type: String,
      },
    ],
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null }, 
    isCommentOff : {
        type : Boolean,
        default : false
    },
    
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
  
  // Virtual property for comments
  PostSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId"
  });
  PostSchema.virtual("reports", {
    ref: "Report",
    localField: "_id",
    foreignField: "postId"
  })
const Post = mongoose.model('Post', PostSchema)


const ValidatePost = (post) => {
    const schema = joi.object({
      text: joi.string(),
      Hashtags: joi.array(),
      community: joi.string(),
    })
    return schema.validate(post)
}

module.exports = {Post, ValidatePost}