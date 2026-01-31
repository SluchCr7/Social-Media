const { Event, ValidateEvent, ValidateEventUpdate } = require("../Modules/Event");
const { EventPopulate } = require("../Populates/Populate");
const asyncHandler = require("express-async-handler");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { User } = require("../Modules/User");

// ================== Create Event ==================
exports.createEvent = asyncHandler(async (req, res) => {
  const { error } = ValidateEvent(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const event = await Event.create({
    ...req.body,
    createdBy: req.user._id,
    invitedUsers: req.body.invitedUsers || [],
    reminders: req.body.reminders || [],
    tags: req.body.tags || [],
    repeatYearly: req.body.repeatYearly || false,
    repeatPattern: req.body.repeatPattern || "none"
  });

  await event.populate(EventPopulate);

  // Send notifications to invited users
  if (event.invitedUsers?.length > 0) {
    for (const userId of event.invitedUsers) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: userId,
        content: `invited you to "${event.title}"`,
        type: "event-invite",
        actionRef: event._id,
        actionModel: "Event"
      });
    }
  }

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event
  });
});

// ================== Get All Events ==================
exports.getEvents = asyncHandler(async (req, res) => {
  const { type, status, priority, startDate, endDate } = req.query;

  let query = {};

  // Filter by type
  if (type) query.type = type;

  // Filter by status
  if (status) query.status = status;

  // Filter by priority
  if (priority) query.priority = priority;

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const events = await Event.find(query)
    .populate(EventPopulate)
    .sort({ date: 1 });

  res.status(200).json({ success: true, events });
});

// ================== Get Event By ID ==================
exports.getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(EventPopulate);

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.status(200).json({ success: true, event });
});

// ================== Get Events By User ==================
exports.getEventsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { upcoming, past, status } = req.query;

  let query = {
    $or: [
      { createdBy: userId },
      { invitedUsers: userId },
      { "attendees.user": userId }
    ]
  };

  // Filter by upcoming/past
  if (upcoming === "true") {
    query.date = { $gte: new Date() };
  } else if (past === "true") {
    query.date = { $lt: new Date() };
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const events = await Event.find(query)
    .populate(EventPopulate)
    .sort({ date: 1 });

  res.status(200).json({ success: true, events });
});

// ================== Update Event ==================
exports.updateEvent = asyncHandler(async (req, res) => {
  const { error } = ValidateEventUpdate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  // Check if user is creator
  if (event.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to update this event" });
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate(EventPopulate);

  // Notify attendees of changes
  if (updatedEvent.invitedUsers?.length > 0) {
    for (const userId of updatedEvent.invitedUsers) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: userId,
        content: `updated the event "${updatedEvent.title}"`,
        type: "event-update",
        actionRef: updatedEvent._id,
        actionModel: "Event"
      });
    }
  }

  res.status(200).json({ success: true, message: "Event updated", event: updatedEvent });
});

// ================== Delete Event ==================
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  // Check if user is creator
  if (event.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
  }

  await event.deleteOne();

  res.status(200).json({ success: true, message: "Event deleted" });
});

// ================== RSVP to Event ==================
exports.respondToEvent = asyncHandler(async (req, res) => {
  const { status } = req.body; // accepted, declined, maybe
  const eventId = req.params.id;
  const userId = req.user._id;

  if (!["accepted", "declined", "maybe"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid RSVP status" });
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  // Check if user is invited
  if (!event.invitedUsers.includes(userId)) {
    return res.status(403).json({ success: false, message: "You are not invited to this event" });
  }

  // Update or add attendee response
  const attendeeIndex = event.attendees.findIndex(a => a.user.toString() === userId.toString());

  if (attendeeIndex > -1) {
    event.attendees[attendeeIndex].status = status;
    event.attendees[attendeeIndex].respondedAt = new Date();
  } else {
    event.attendees.push({
      user: userId,
      status,
      respondedAt: new Date()
    });
  }

  await event.save();
  await event.populate(EventPopulate);

  // Notify event creator
  await sendNotificationHelper({
    sender: userId,
    receiver: event.createdBy,
    content: `${status} your event invitation for "${event.title}"`,
    type: "event-rsvp",
    actionRef: event._id,
    actionModel: "Event"
  });

  res.status(200).json({ success: true, message: "RSVP updated", event });
});

// ================== Get Upcoming Events ==================
exports.getUpcomingEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { days = 7 } = req.query;

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + parseInt(days));

  const events = await Event.find({
    $or: [
      { createdBy: userId },
      { invitedUsers: userId }
    ],
    date: { $gte: startDate, $lte: endDate },
    status: { $ne: "cancelled" }
  })
    .populate(EventPopulate)
    .sort({ date: 1 })
    .limit(20);

  res.status(200).json({ success: true, events });
});

// ================== Search Events ==================
exports.searchEvents = asyncHandler(async (req, res) => {
  const { q, type, priority } = req.query;
  const userId = req.user._id;

  let query = {
    $or: [
      { createdBy: userId },
      { invitedUsers: userId }
    ]
  };

  if (q) {
    query.$and = [
      {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { location: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } }
        ]
      }
    ];
  }

  if (type) query.type = type;
  if (priority) query.priority = priority;

  const events = await Event.find(query)
    .populate(EventPopulate)
    .sort({ date: 1 })
    .limit(50);

  res.status(200).json({ success: true, events });
});
