const { Event, ValidateEvent, ValidateEventUpdate } = require("../Modules/Event");
const { User } = require("../Modules/User");
const { EventPopulate } = require("../Populates/Populate");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { io, getReceiverSocketId } = require("../Config/socket");

const result = (status, body) => ({ status, body });

const getId = (value) => value?._id?.toString() || value?.toString();

const isPublicEvent = (event) =>
  event?.visibility === "public" && event?.isPrivate !== true;

const getEventParticipantIds = (...events) => {
  const ids = new Set();
  events.forEach((event) => {
    if (!event) return;
    [event.createdBy, ...(event.invitedUsers || []), ...(event.attendees || []).map((attendee) => attendee.user)]
      .map(getId)
      .filter(Boolean)
      .forEach((id) => ids.add(id));
  });
  return [...ids];
};

const emitToEventParticipants = (eventName, payload, ...events) => {
  const socketIds = new Set();
  getEventParticipantIds(...events).forEach((userId) => {
    getReceiverSocketId(userId).forEach((socketId) => socketIds.add(socketId));
  });
  socketIds.forEach((socketId) => io.to(socketId).emit(eventName, payload));
};

const validateEventConsistency = (values = {}, existingEvent = null) => {
  const startTime = values.startTime !== undefined ? values.startTime : existingEvent?.startTime;
  const endTime = values.endTime !== undefined ? values.endTime : existingEvent?.endTime;
  if (startTime && endTime) {
    const toMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    if (toMinutes(endTime) <= toMinutes(startTime)) {
      return "End time must be after start time";
    }
  }

  const date = values.date !== undefined ? new Date(values.date) : existingEvent?.date;
  const repeatPattern =
    values.repeatPattern !== undefined ? values.repeatPattern : existingEvent?.repeatPattern;
  const repeatYearly =
    values.repeatYearly !== undefined ? values.repeatYearly : existingEvent?.repeatYearly;
  let repeatUntil = existingEvent?.repeatUntil;
  if (values.repeatUntil !== undefined) {
    repeatUntil = values.repeatUntil === null ? null : new Date(values.repeatUntil);
  }
  const isRecurring = (repeatPattern && repeatPattern !== "none") || repeatYearly;

  if (isRecurring && repeatUntil && date && repeatUntil < date) {
    return "Repeat-until date must be on or after the event date";
  }
  return null;
};

async function getVisibleEventFilter(userId) {
  const followedUserIds = await User.find({ followers: userId }).distinct("_id");
  return {
    $or: [
      { createdBy: userId },
      { invitedUsers: userId },
      { "attendees.user": userId },
      { visibility: "public", isPrivate: { $ne: true } },
      {
        visibility: "followers",
        isPrivate: { $ne: true },
        createdBy: { $in: followedUserIds },
      },
    ],
  };
}

async function createEvent(body, userId) {
  const { error } = ValidateEvent(body);
  if (error) {
    return result(400, { success: false, message: error.details[0].message });
  }
  const consistencyError = validateEventConsistency(body);
  if (consistencyError) {
    return result(400, { success: false, message: consistencyError });
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

  if (isPublicEvent(event)) {
    io.emit("event:create", event);
  } else {
    emitToEventParticipants("event:create", event, event);
  }
  return result(201, {
    success: true,
    message: "Event created successfully",
    event,
  });
}

async function getEvents(filters, userId) {
  const { type, status, priority, startDate, endDate } = filters;
  const query = await getVisibleEventFilter(userId);
  if (type) query.type = type;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
      if (Number.isNaN(query.date.$gte.getTime())) {
        return result(400, { success: false, message: "Invalid start date" });
      }
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
      if (Number.isNaN(query.date.$lte.getTime())) {
        return result(400, { success: false, message: "Invalid end date" });
      }
    }
    if (query.date.$gte && query.date.$lte && query.date.$gte > query.date.$lte) {
      return result(400, { success: false, message: "Start date must be before end date" });
    }
  }
  const events = await Event.find(query).populate(EventPopulate).sort({ date: 1 });
  return result(200, { success: true, events });
}

async function getEventById(id, userId) {
  const event = await Event.findOne({
    _id: id,
    ...(await getVisibleEventFilter(userId)),
  }).populate(EventPopulate);
  if (!event) return result(404, { success: false, message: "Event not found" });
  return result(200, { success: true, event });
}

async function getEventsByUser(userId, filters, requesterId) {
  if (getId(userId) !== getId(requesterId)) {
    return result(403, { success: false, message: "Not authorized to view these events" });
  }

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
  const dayCount = Number(days);
  if (!Number.isInteger(dayCount) || dayCount < 1 || dayCount > 30) {
    return result(400, { success: false, message: "Days must be between 1 and 30" });
  }
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + dayCount);

  const events = await Event.find({
    $or: [
      { createdBy: userId },
      { invitedUsers: userId },
      { "attendees.user": userId },
    ],
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
  const query = await getVisibleEventFilter(userId);

  if (q) {
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$and = [
      {
        $or: [
          { title: { $regex: escapedQuery, $options: "i" } },
          { description: { $regex: escapedQuery, $options: "i" } },
          { location: { $regex: escapedQuery, $options: "i" } },
          { tags: { $in: [new RegExp(escapedQuery, "i")] } },
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
  const consistencyError = validateEventConsistency(body, event);
  if (consistencyError) {
    return result(400, { success: false, message: consistencyError });
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  ).populate(EventPopulate);
  if (isPublicEvent(updatedEvent)) {
    io.emit("event:update", updatedEvent);
  } else {
    if (isPublicEvent(event)) io.emit("event:delete", id);
    emitToEventParticipants("event:update", updatedEvent, event, updatedEvent);
  }
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
  if (isPublicEvent(event)) {
    io.emit("event:delete", id);
  } else {
    emitToEventParticipants("event:delete", id, event);
  }
  return result(200, { success: true, message: "Event deleted" });
}

async function respondToEvent(id, userId, status) {
  if (!["accepted", "declined", "maybe"].includes(status)) {
    return result(400, { success: false, message: "Invalid RSVP status" });
  }
  const event = await Event.findById(id);
  if (!event) return result(404, { success: false, message: "Event not found" });
  const isInvited = event.invitedUsers.some(
    (invitedUserId) => invitedUserId.toString() === userId.toString()
  );
  if (!isInvited) {
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
  emitToEventParticipants("event:update", event, event);
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
