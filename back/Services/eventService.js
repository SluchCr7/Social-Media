const { Event, ValidateEvent, ValidateEventUpdate } = require("../Modules/Event");
const { EventPopulate } = require("../Populates/Populate");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { io } = require("../Config/socket");

const result = (status, body) => ({ status, body });

async function createEvent(body, userId) {
  const { error } = ValidateEvent(body);
  if (error) {
    return result(400, { success: false, message: error.details[0].message });
  }

  const event = await Event.create({
    ...body,
    createdBy: userId,
    invitedUsers: body.invitedUsers || [],
    reminders: body.reminders || [],
    tags: body.tags || [],
    repeatYearly: body.repeatYearly || false,
    repeatPattern: body.repeatPattern || "none",
  });
  await event.populate(EventPopulate);

  if (event.invitedUsers?.length > 0) {
    for (const invitedUserId of event.invitedUsers) {
      await sendNotificationHelper({
        sender: userId,
        receiver: invitedUserId,
        content: `invited you to "${event.title}"`,
        type: "event-invite",
        actionRef: event._id,
        actionModel: "Event",
      });
    }
  }

  io.emit("event:create", event);
  return result(201, {
    success: true,
    message: "Event created successfully",
    event,
  });
}

async function getEvents(filters) {
  const { type, status, priority, startDate, endDate } = filters;
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const events = await Event.find(query).populate(EventPopulate).sort({ date: 1 });
  return result(200, { success: true, events });
}

async function getEventById(id) {
  const event = await Event.findById(id).populate(EventPopulate);
  if (!event) return result(404, { success: false, message: "Event not found" });
  return result(200, { success: true, event });
}

async function getEventsByUser(userId, filters) {
  const { upcoming, past, status } = filters;
  const query = {
    $or: [
      { createdBy: userId },
      { invitedUsers: userId },
      { "attendees.user": userId },
    ],
  };
  if (upcoming === "true") {
    query.date = { $gte: new Date() };
  } else if (past === "true") {
    query.date = { $lt: new Date() };
  }
  if (status) query.status = status;
  const events = await Event.find(query).populate(EventPopulate).sort({ date: 1 });
  return result(200, { success: true, events });
}

async function getUpcomingEvents(userId, filters) {
  const { days = 7 } = filters;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + parseInt(days));

  const events = await Event.find({
    $or: [{ createdBy: userId }, { invitedUsers: userId }],
    date: { $gte: startDate, $lte: endDate },
    status: { $ne: "cancelled" },
  })
    .populate(EventPopulate)
    .sort({ date: 1 })
    .limit(20);

  return result(200, { success: true, events });
}

async function searchEvents(userId, filters) {
  const { q, type, priority } = filters;
  const query = {
    $or: [{ createdBy: userId }, { invitedUsers: userId }],
  };

  if (q) {
    query.$and = [
      {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { location: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } },
        ],
      },
    ];
  }

  if (type) query.type = type;
  if (priority) query.priority = priority;

  const events = await Event.find(query)
    .populate(EventPopulate)
    .sort({ date: 1 })
    .limit(50);

  return result(200, { success: true, events });
}

async function updateEvent(id, body, userId) {
  const { error } = ValidateEventUpdate(body);
  if (error) {
    return result(400, { success: false, message: error.details[0].message });
  }

  const event = await Event.findById(id);
  if (!event) return result(404, { success: false, message: "Event not found" });
  if (event.createdBy.toString() !== userId.toString()) {
    return result(403, {
      success: false,
      message: "Not authorized to update this event",
    });
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  ).populate(EventPopulate);
  if (updatedEvent.invitedUsers?.length > 0) {
    for (const invitedUserId of updatedEvent.invitedUsers) {
      await sendNotificationHelper({
        sender: userId,
        receiver: invitedUserId,
        content: `updated the event "${updatedEvent.title}"`,
        type: "event-update",
        actionRef: updatedEvent._id,
        actionModel: "Event",
      });
    }
  }
  io.emit("event:update", updatedEvent);
  return result(200, { success: true, message: "Event updated", event: updatedEvent });
}

async function deleteEvent(id, userId) {
  const event = await Event.findById(id);
  if (!event) return result(404, { success: false, message: "Event not found" });
  if (event.createdBy.toString() !== userId.toString()) {
    return result(403, {
      success: false,
      message: "Not authorized to delete this event",
    });
  }

  await event.deleteOne();
  io.emit("event:delete", id);
  return result(200, { success: true, message: "Event deleted" });
}

async function respondToEvent(id, userId, status) {
  if (!["accepted", "declined", "maybe"].includes(status)) {
    return result(400, { success: false, message: "Invalid RSVP status" });
  }
  const event = await Event.findById(id);
  if (!event) return result(404, { success: false, message: "Event not found" });
  if (!event.invitedUsers.includes(userId)) {
    return result(403, {
      success: false,
      message: "You are not invited to this event",
    });
  }

  const attendeeIndex = event.attendees.findIndex(
    (attendee) => attendee.user.toString() === userId.toString()
  );
  if (attendeeIndex > -1) {
    event.attendees[attendeeIndex].status = status;
    event.attendees[attendeeIndex].respondedAt = new Date();
  } else {
    event.attendees.push({ user: userId, status, respondedAt: new Date() });
  }
  await event.save();
  await event.populate(EventPopulate);

  await sendNotificationHelper({
    sender: userId,
    receiver: event.createdBy,
    content: `${status} your event invitation for "${event.title}"`,
    type: "event-rsvp",
    actionRef: event._id,
    actionModel: "Event",
  });
  io.emit("event:update", event);
  return result(200, { success: true, message: "RSVP updated", event });
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getEventsByUser,
  getUpcomingEvents,
  searchEvents,
  updateEvent,
  deleteEvent,
  respondToEvent,
};
