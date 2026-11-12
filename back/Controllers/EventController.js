const asyncHandler = require("express-async-handler");
const eventService = require("../Services/eventService");

const sendResult = (res, result) => res.status(result.status).json(result.body);

exports.createEvent = asyncHandler(async (req, res) => {
  const result = await eventService.createEvent(req.body, req.user._id);
  sendResult(res, result);
});

exports.getEvents = asyncHandler(async (req, res) => {
  const result = await eventService.getEvents(req.query, req.user._id);
  sendResult(res, result);
});

exports.getEventById = asyncHandler(async (req, res) => {
  const result = await eventService.getEventById(req.params.id, req.user._id);
  sendResult(res, result);
});

exports.getEventsByUser = asyncHandler(async (req, res) => {
  const result = await eventService.getEventsByUser(
    req.params.id,
    req.query,
    req.user._id
  );
  sendResult(res, result);
});

exports.getUpcomingEvents = asyncHandler(async (req, res) => {
  const result = await eventService.getUpcomingEvents(req.user._id, req.query);
  sendResult(res, result);
});

exports.searchEvents = asyncHandler(async (req, res) => {
  const result = await eventService.searchEvents(req.user._id, req.query);
  sendResult(res, result);
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const result = await eventService.updateEvent(req.params.id, req.body, req.user._id);
  sendResult(res, result);
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  const result = await eventService.deleteEvent(req.params.id, req.user._id);
  sendResult(res, result);
});

exports.respondToEvent = asyncHandler(async (req, res) => {
  const result = await eventService.respondToEvent(
    req.params.id,
    req.user._id,
    req.body.status
  );
  sendResult(res, result);
});
