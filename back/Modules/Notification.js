const mongoose = require('mongoose');
const Joi = require('joi');

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['comment', 'message', 'like', 'follow', 'mention', 'custom', "love" , "community"],
      default: 'custom',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actionRef: {
      // مثلاً يمكن أن يكون هذا الـ ID الخاص بالكومنت أو الرسالة
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'actionModel', // تحديد النموذج المرتبط ديناميكياً
    },
    actionModel: {
      // اسم الموديل المرتبط بـ actionRef (مثل Comment أو Message)
      type: String,
      enum: ['Comment', 'Message', 'Post', "Story" , "Community"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Notification = mongoose.model('Notification', notificationSchema);

// Joi Validation
const validateNotification = (notification) => {
  const schema = Joi.object({
    content: Joi.string().required(),
    type: Joi.string().valid('comment', 'message', 'like', 'follow', 'mention', 'custom').required(),
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    actionRef: Joi.string().optional(),
    actionModel: Joi.string().valid('Comment', 'Message', 'Post').optional(),
  });

  return schema.validate(notification);
};

module.exports = {
  Notification,
  validateNotification,
};
