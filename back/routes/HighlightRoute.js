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
    reorderHighlights
} = require("../Controllers/HighlightController");
const { verifyToken } = require("../Middelwares/verifyToken");
const photoUpload = require('../Middelwares/uploadPhoto');

// Highlight CRUD
router.post("/", verifyToken, photoUpload.single("image"), createHighlight);
router.get("/user/:userId", getUserHighlights);
router.get("/:id", getHighlightById);
router.put("/:id", verifyToken, photoUpload.single("image"), updateHighlight);
router.delete("/:id", verifyToken, deleteHighlight);

// Story management
router.post("/:highlightId/add-story", verifyToken, addStoryToHighlight);
router.delete("/:highlightId/story/:storyId", verifyToken, removeStoryFromHighlight);

// Reorder
router.post("/reorder", verifyToken, reorderHighlights);

module.exports = router;
