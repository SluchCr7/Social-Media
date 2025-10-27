const express = require("express");
const router = express.Router();
const { createHighlight, getUserHighlights, deleteHighlight,addStoryToHighlight } = require("../Controllers/HighlightController");
const { verifyToken } = require("../Middelwares/verifyToken"); // لو عندك نظام auth
const photoUpload = require('../Middelwares/uploadPhoto');

router.post("/", verifyToken,photoUpload.single("image"), createHighlight);
router.get("/:userId", getUserHighlights);
router.delete("/:id", verifyToken, deleteHighlight);
router.post("/:highlightId/add-story", verifyToken, addStoryToHighlight);
module.exports = router;
