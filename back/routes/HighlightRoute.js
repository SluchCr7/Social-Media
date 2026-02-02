const express = require("express");
const router = express.Router();
const {
    createHighlight,
    getUserHighlights,
    getHighlightById,
    deleteHighlight,
    addStoryToHighlight,
    updateHighlight,
    removeStoryFromHighlight,
    reorderHighlights,
    updateStoriesOrder
} = require("../Controllers/HighlightController");
const { verifyToken } = require("../Middelwares/verifyToken");
const photoUpload = require('../Middelwares/uploadPhoto');

// Highlight CRUD
router.post("/", verifyToken, photoUpload.single("image"), createHighlight);
router.get("/user/:userId", getUserHighlights);
router.get("/:id", getHighlightById);
router.put("/:id", verifyToken, photoUpload.single("image"), updateHighlight);
router.patch("/:id", verifyToken, photoUpload.single("image"), updateHighlight); // Support PATCH
router.delete("/:id", verifyToken, deleteHighlight);

// Story management
router.post("/:highlightId/add-story", verifyToken, addStoryToHighlight); // Keep for compatibility
router.patch("/:highlightId/stories", verifyToken, addStoryToHighlight); // User suggested
router.delete("/:highlightId/story/:storyId", verifyToken, removeStoryFromHighlight); // Keep for compatibility
router.delete("/:highlightId/stories/:storyId", verifyToken, removeStoryFromHighlight); // User suggested

// Reorder
router.post("/reorder", verifyToken, reorderHighlights);
router.patch("/:highlightId/reorder-stories", verifyToken, updateStoriesOrder);

module.exports = router;
