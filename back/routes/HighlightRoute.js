const express = require("express");
const router = express.Router();
const { createHighlight, getUserHighlights, deleteHighlight } = require("../Controllers/HighlightController");
const { verifyToken } = require("../Middelwares/verifyToken"); // لو عندك نظام auth
const photoUpload = require('../Middelwares/uploadPhoto');

router.post("/", verifyToken,photoUpload.single("image"), createHighlight);
router.get("/:userId", getUserHighlights);
router.delete("/:id", verifyToken, deleteHighlight);

module.exports = router;
