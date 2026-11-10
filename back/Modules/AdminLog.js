const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. 'BAN_USER', 'SUSPEND_USER', 'ACTIVATE_USER', 'TOGGLE_ADMIN', 'TOGGLE_VERIFY', 'DELETE_POST', 'BROADCAST_ANNOUNCEMENT', 'SYSTEM_CLEANUP'
    },
    targetType: {
      type: String,
      enum: ['User', 'Post', 'Comment', 'Community', 'Report', 'System'],
      default: 'User',
    },
    targetId: {
      type: String,
      default: null,
    },
    details: {
      type: Object,
      default: {},
    },
    ip: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

AdminLogSchema.index({ createdAt: -1 });

const AdminLog = mongoose.model('AdminLog', AdminLogSchema);

module.exports = { AdminLog };
