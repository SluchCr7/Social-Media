const { Story } = require("../Modules/Story");
const asyncHandler = require("express-async-handler");
// 🔔 Socket.io & Notifications
const { io } = require("../Config/socket");
const { cloudUpload } = require("../Config/cloudUpload");
const { User } = require('../Modules/User');
const { storyPopulate } = require("../Populates/Populate");
const { sendNotificationHelper } = require("../utils/SendNotification");

/**
 * @desc Add a new story (image, text, or both)
 * @route POST /api/stories
 * @access Private
 */
/**
 * @desc Add a new story (image, text, or both)
 * @route POST /api/stories/add
 * @access Private
 */
const addNewStory = asyncHandler(async (req, res) => {
  const {
    text,
    collaborators = [],
    mentions = [],
    music,
    link,
    isCloseFriends = false
  } = req.body;

  let photoUrl = "";

  // ✅ رفع الصورة إن وجدت
  if (req.file) {
    const result = await cloudUpload(req.file);
    photoUrl = result.secure_url;
  }

  // ✅ التأكد من وجود نص أو صورة
  if (!text && !photoUrl) {
    return res.status(400).json({ message: "You must provide at least text or a photo." });
  }

  // Parsing JSON if sent as strings (typical with FormData)
  const parsedCollaborators = typeof collaborators === "string" ? JSON.parse(collaborators) : collaborators;
  const parsedMentions = typeof mentions === "string" ? JSON.parse(mentions) : mentions;
  const parsedMusic = typeof music === "string" ? JSON.parse(music) : music;
  const parsedLink = typeof link === "string" ? JSON.parse(link) : link;

  // ✅ إنشاء القصة الجديدة
  const story = new Story({
    text: text || "",
    Photo: photoUrl ? [photoUrl] : [],
    owner: req.user._id,
    collaborators: parsedCollaborators,
    mentions: parsedMentions,
    music: parsedMusic,
    link: parsedLink,
    isCloseFriends: isCloseFriends === "true" || isCloseFriends === true,
  });

  await story.save();
  await story.populate(storyPopulate);

  // ✅ إضافة نقاط لصاحب القصة
  const user = await User.findById(req.user._id);
  user.userLevelPoints += 5;
  user.updateLevelRank();
  await user.save();

  // 🔔 Send notifications for mentions
  if (parsedMentions?.length > 0) {
    for (const mentionId of parsedMentions) {
      if (mentionId.toString() !== req.user._id.toString()) {
        await sendNotificationHelper({
          sender: req.user._id,
          receiver: mentionId,
          content: `🏷 Mentioned you in a Story`,
          type: "mention",
          actionRef: story._id,
          actionModel: "Story",
        });
      }
    }
  }

  // 🔔 إرسال تنبيه فوري عبر السوكيت
  io.emit("new-story", story);

  res.status(201).json({ message: "Story added successfully", story });
});

/**
 * @desc Get all active stories
 * @route GET /api/stories
 * @access Public/Private
 */
const getAllStories = asyncHandler(async (req, res) => {
  try {
    const now = new Date();

    // 1. Filter out expired stories (default logic)
    // 2. Filter stories by privacy (Close Friends check if user is logged in)
    let query = {
      expiresAt: { $gt: now },
      $or: [
        { isHighlighted: { $exists: false } },
        { isHighlighted: false }
      ]
    };

    const stories = await Story.find(query)
      .populate(storyPopulate)
      .sort({ createdAt: -1 });

    // Filter Close Friends stories if necessary
    const filteredStories = stories.filter(story => {
      if (!story.isCloseFriends) return true;
      if (!req.user) return false;
      // Should check if req.user is in story.owner's close friends list
      // For now, let's assume if it's close friends, only the owner or someone they explicitly allow sees it.
      // This part requires a CloseFriends list on User model which might be missing.
      // For simplicity, let's allow owner to see it.
      return story.owner._id.toString() === req.user._id.toString();
    });

    res.status(200).json(filteredStories);
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    res.status(500).json({ message: "Error fetching stories" });
  }
});

/**
 * @desc Delete a story
 * @route DELETE /api/stories/delete/:id
 * @access Private
 */
const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const storyId = story._id;
  await story.remove();

  // 🔔 إخبار الجميع بحذف القصة لتحديث الواجهة فوراً
  io.emit("delete-story", storyId);

  res.status(200).json({ message: "Story deleted successfully" });
});

/**
 * @desc Get story by ID
 * @route GET /api/stories/:id
 * @access Private
 */
const getStoriesById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).populate(storyPopulate);

  if (!story) {
    return res.status(404).json({ message: "Story Not Found" });
  }

  // إضافة المستخدم الحالي إلى المشاهدات إذا لم يكن موجودًا مسبقًا
  await Story.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { views: req.user._id } },
    { new: true }
  );

  const updatedStory = await Story.findById(req.params.id).populate(storyPopulate);
  res.status(200).json(updatedStory);
});


/**
 * @desc Mark a story as viewed
 * @route POST /api/stories/view/:id
 * @access Private
 */
const viewStory = asyncHandler(async (req, res) => {
  const storyId = req.params.id;

  const story = await Story.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  const updatedStory = await Story.findByIdAndUpdate(
    storyId,
    { $addToSet: { views: req.user._id } },
    { new: true }
  ).populate(storyPopulate);

  io.emit("update-story", updatedStory);

  res.status(200).json({ story: updatedStory });
});


/**
 * @desc Toggle love or React to a story
 */
const toggleLoveStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  const isLoved = story.loves.includes(req.user._id);
  const update = isLoved ? { $pull: { loves: req.user._id } } : { $addToSet: { loves: req.user._id } };

  const updatedStory = await Story.findByIdAndUpdate(req.params.id, update, { new: true }).populate(storyPopulate);

  if (!isLoved && !story.owner.equals(req.user._id)) {
    const owner = await User.findById(story.owner);
    if (!owner.BlockedNotificationFromUsers.includes(req.user._id)) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: story.owner,
        content: "❤️ Liked your Story",
        type: "like",
        actionRef: story._id,
        actionModel: "Story",
      });
    }
  }

  io.emit("update-story", updatedStory);
  res.status(200).json(updatedStory);
});

/**
 * @desc Add reaction to story
 * @route POST /api/stories/react/:id
 * @access Private
 */
const reactToStory = asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  if (!emoji) return res.status(400).json({ message: "Emoji is required" });

  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: "Story not found" });

  // Update or Add reaction
  const reactionIndex = story.reactions.findIndex(r => r.user.toString() === req.user._id.toString());
  if (reactionIndex > -1) {
    story.reactions[reactionIndex].emoji = emoji;
    story.reactions[reactionIndex].createdAt = new Date();
  } else {
    story.reactions.push({ user: req.user._id, emoji });
  }

  await story.save();
  const updatedStory = await Story.findById(story._id).populate(storyPopulate);

  // Notify owner
  if (!story.owner.equals(req.user._id)) {
    await sendNotificationHelper({
      sender: req.user._id,
      receiver: story.owner,
      content: `${emoji} Reacted to your Story`,
      type: "reaction",
      actionRef: story._id,
      actionModel: "Story",
    });
  }

  io.emit("update-story", updatedStory);
  res.status(200).json(updatedStory);
});

/**
 * @desc Get story viewers
 * @route GET /api/stories/viewers/:id
 * @access Private
 */
const getStoryViewers = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).populate("views", "username profileName profilePhoto");
  if (!story) return res.status(404).json({ message: "Story not found" });

  if (story.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Only owner can see viewers list" });
  }

  res.status(200).json(story.views);
});

const getRecentStories = asyncHandler(async (req, res) => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stories = await Story.find({ createdAt: { $gte: yesterday } });
  res.status(200).json(stories);
});


const getUserStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({ owner: req.params.id })
    .populate("owner", "username profilePhoto")
    .sort({ createdAt: -1 });

  if (!stories.length) return res.status(404).json({ message: "No stories found" });
  res.json(stories);
});

const shareStory = asyncHandler(async (req, res) => {
  const originalStory = await Story.findById(req.params.id);
  if (!originalStory) return res.status(404).json({ message: "Story not found" });

  const sharedStory = new Story({
    text: originalStory.text,
    Photo: originalStory.Photo,
    originalStory: originalStory._id,
    owner: req.user._id,
    isShared: true
  });

  await sharedStory.save();
  await sharedStory.populate(storyPopulate);

  if (!originalStory.owner.equals(req.user._id)) {
    await sendNotificationHelper({
      sender: req.user._id,
      receiver: originalStory.owner,
      content: "🔁 Shared your Story",
      type: "share",
      actionRef: sharedStory._id,
      actionModel: "Story",
    });
  }

  io.emit("new-story", sharedStory);
  res.status(201).json(sharedStory);
});

module.exports = {
  addNewStory,
  getAllStories,
  deleteStory,
  getStoriesById,
  getRecentStories,
  viewStory,
  toggleLoveStory,
  getUserStories,
  shareStory,
  reactToStory,
  getStoryViewers
};
