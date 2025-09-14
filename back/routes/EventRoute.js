const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/EventController");
const { verifyToken } = require("../Middelwares/verifyToken"); // لو عندك نظام auth

// CRUD Routes
router.post("/", verifyToken, EventController.createEvent);      // إنشاء حدث
router.get("/", verifyToken, EventController.getEvents);         // جلب كل الأحداث
router.get("/:id", verifyToken, EventController.getEventById);   // جلب حدث واحد
router.put("/:id", verifyToken, EventController.updateEvent);    // تحديث حدث
router.delete("/:id", verifyToken, EventController.deleteEvent); // حذف حدث

module.exports = router;
