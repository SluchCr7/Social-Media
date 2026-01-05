const express = require("express");
const router = express.Router();
const { createHighlight, getUserHighlights, deleteHighlight, addStoryToHighlight, updateHighlight, removeStoryFromHighlight } = require("../Controllers/HighlightController");
const { verifyToken } = require("../Middelwares/verifyToken");
const photoUpload = require('../Middelwares/uploadPhoto');

router.post("/", verifyToken, photoUpload.single("image"), createHighlight);
router.get("/:userId", getUserHighlights);
router.delete("/:id", verifyToken, deleteHighlight);
router.post("/:highlightId/add-story", verifyToken, addStoryToHighlight);
router.put("/:id", verifyToken, photoUpload.single("image"), updateHighlight); // ✅ Update Route
router.delete("/:highlightId/story/:storyId", verifyToken, removeStoryFromHighlight); // ✅ Remove Story Route
module.exports = router;

