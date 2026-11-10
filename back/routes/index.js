const express = require("express");
const router = express.Router();

router.use("/auth", require("./UserRoute"));
router.use("/message", require("./MessageRoute"));
router.use("/notification", require("./NotificationRoute"));
router.use("/post", require("./PostRoute"));
router.use("/comment", require("./CommentRoute"));
router.use("/community", require("./CommunityRoute"));
router.use("/news", require("./NewsRoute"));
router.use("/story", require("./StoryRoute"));
router.use("/password", require("./PasswordRoute"));
router.use("/report", require("./ReportRoute"));
router.use("/events", require("./EventRoute"));
router.use("/reel", require("./ReelRoute"));
router.use("/music", require("./MusicRoute"));
router.use("/translate", require("./TranslateRoute"));
router.use("/admin", require("./AdminRoute"));
router.use("/highlight", require("./HighlightRoute"));
router.use("/search", require("./SearchRoute"));

module.exports = router;