const mongoose = require("mongoose");
const Joi = require("joi");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    date: {
      type: Date,
      required: true
    },
    // Time range for events
    startTime: {
      type: String, // Format: "HH:mm"
      default: "09:00"
    },
    endTime: {
      type: String, // Format: "HH:mm"
      default: "10:00"
    },
    // Location details
    location: {
      type: String,
      trim: true,
      maxlength: 300
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    meetingLink: {
      type: String,
      trim: true
    },
    // Event categorization
    type: {
      type: String,
      enum: ["birthday", "meeting", "public", "custom", "reminder", "deadline"],
      default: "custom"
    },
    // Color coding for visual organization
    color: {
      type: String,
      default: "#6366f1" // Indigo
    },
    // Recurrence settings
    repeatYearly: {
      type: Boolean,
      default: false
    },
    repeatPattern: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none"
    },
    repeatUntil: {
      type: Date
    },
    // Participants and RSVP
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined", "maybe"],
          default: "pending"
        },
        respondedAt: Date
      }
    ],
    // Reminders
    reminders: [
      {
        time: {
          type: Number, // Minutes before event
          required: true
        },
        sent: {
          type: Boolean,
          default: false
        }
      }
    ],
    // Attachments
    attachments: [
      {
        url: String,
        publicId: String,
        name: String,
        type: String, // image, document, etc.
        size: Number
      }
    ],
    // Privacy and visibility
    isPrivate: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: String,
      enum: ["public", "private", "followers", "invited"],
      default: "private"
    },
    // Additional metadata
    tags: [String],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled"
    },
    notes: {
      type: String,
      maxlength: 1000
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for checking if event is upcoming
EventSchema.virtual('isUpcoming').get(function () {
  return this.date > new Date();
});

// Virtual for checking if event is today
EventSchema.virtual('isToday').get(function () {
  const today = new Date();
  const eventDate = new Date(this.date);
  return eventDate.toDateString() === today.toDateString();
});

// Validation schemas
function ValidateEvent(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    description: Joi.string().trim().max(2000).allow(""),
    date: Joi.date().required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    location: Joi.string().trim().max(300).allow(""),
    isVirtual: Joi.boolean(),
    meetingLink: Joi.string().uri().allow(""),
    type: Joi.string().valid("birthday", "meeting", "public", "custom", "reminder", "deadline"),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    repeatYearly: Joi.boolean(),
    repeatPattern: Joi.string().valid("none", "daily", "weekly", "monthly", "yearly"),
    repeatUntil: Joi.date(),
    invitedUsers: Joi.array().items(Joi.string()),
    reminders: Joi.array().items(Joi.object({
      time: Joi.number().min(0).required()
    })),
    isPrivate: Joi.boolean(),
    visibility: Joi.string().valid("public", "private", "followers", "invited"),
    tags: Joi.array().items(Joi.string().max(50)),
    priority: Joi.string().valid("low", "medium", "high", "urgent"),
    notes: Joi.string().max(1000).allow("")
  });
  return schema.validate(obj);
}

function ValidateEventUpdate(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().max(200),
    description: Joi.string().trim().max(2000).allow(""),
    date: Joi.date(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    location: Joi.string().trim().max(300).allow(""),
    isVirtual: Joi.boolean(),
    meetingLink: Joi.string().uri().allow(""),
    type: Joi.string().valid("birthday", "meeting", "public", "custom", "reminder", "deadline"),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    repeatYearly: Joi.boolean(),
    repeatPattern: Joi.string().valid("none", "daily", "weekly", "monthly", "yearly"),
    repeatUntil: Joi.date(),
    invitedUsers: Joi.array().items(Joi.string()),
    reminders: Joi.array().items(Joi.object({
      time: Joi.number().min(0).required(),
      sent: Joi.boolean()
    })),
    isPrivate: Joi.boolean(),
    visibility: Joi.string().valid("public", "private", "followers", "invited"),
    tags: Joi.array().items(Joi.string().max(50)),
    priority: Joi.string().valid("low", "medium", "high", "urgent"),
    status: Joi.string().valid("scheduled", "ongoing", "completed", "cancelled"),
    notes: Joi.string().max(1000).allow("")
  });
  return schema.validate(obj);
}

module.exports = {
  Event: mongoose.model("Event", EventSchema),
  ValidateEvent,
  ValidateEventUpdate
};
