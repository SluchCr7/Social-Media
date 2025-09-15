const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ["birthday", "meeting", "public", "custom"],
      default: "custom"
    },
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    repeatYearly: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
