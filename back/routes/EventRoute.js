const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/EventController");
const { verifyToken } = require("../Middelwares/verifyToken");

// CRUD Routes
router.post("/", verifyToken, EventController.createEvent);
router.get("/", verifyToken, EventController.getEvents);
router.get("/upcoming", verifyToken, EventController.getUpcomingEvents);
router.get("/search", verifyToken, EventController.searchEvents);
router.get("/user/:id", verifyToken, EventController.getEventsByUser);
router.get("/:id", verifyToken, EventController.getEventById);
router.put("/:id", verifyToken, EventController.updateEvent);
router.delete("/:id", verifyToken, EventController.deleteEvent);

// RSVP Route
router.post("/:id/rsvp", verifyToken, EventController.respondToEvent);

module.exports = router;

