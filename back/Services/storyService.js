const { Story } = require("../Modules/Story");
const { Highlight } = require("../Modules/Highlight");
const { User } = require("../Modules/User");
const { cloudUpload } = require("../Config/cloudUpload");
const { io } = require("../Config/socket");
const { storyPopulate } = require("../Populates/Populate");
const { sendNotificationHelper } = require("../utils/SendNotification");

const response = (status, body) => ({ status, body });

const addNewStory = async ({ body, file, userId }) => {
  const {
    text,
    collaborators = [],
    mentions = [],
    music,
    link,
    isCloseFriends = false
  } = body;

  let photoUrl = "";
  if (file) {
    const result = await cloudUpload(file);
    photoUrl = result.secure_url;
  }

  if (!text && !photoUrl) {
    return response(400, { message: "You must provide at least text or a photo." });
  }

  const parsedCollaborators = typeof collaborators === "string" ? JSON.parse(collaborators) : collaborators;
  const parsedMentions = typeof mentions === "string" ? JSON.parse(mentions) : mentions;
  const parsedMusic = typeof music === "string" ? JSON.parse(music) : music;
  const parsedLink = typeof link === "string" ? JSON.parse(link) : link;

  const story = new Story({
    text: text || "",
    Photo: photoUrl ? [photoUrl] : [],
    owner: userId,
    collaborators: parsedCollaborators,
    mentions: parsedMentions,
    music: parsedMusic,
    link: parsedLink,
    isCloseFriends: isCloseFriends === "true" || isCloseFriends === true,
  });

  await story.save();
  await story.populate(storyPopulate);

  const user = await User.findById(userId);
  user.userLevelPoints += 5;
  user.updateLevelRank();
  await user.save();

  if (parsedMentions?.length > 0) {
    for (const mentionId of parsedMentions) {
      if (mentionId.toString() !== userId.toString()) {
        await sendNotificationHelper({
          sender: userId,
          receiver: mentionId,
          content: `🏷 Mentioned you in a Story`,
          type: "mention",
          actionRef: story._id,
          actionModel: "Story",
        });
      }
    }
  }

  io.emit("new-story", story);
  return response(201, { message: "Story added successfully", story });
};

const getAllStories = async (user) => {
  try {
    const now = new Date();
    const stories = await Story.find({
      expiresAt: { $gt: now },
      isArchived: false,
      isDeleted: false
    })
      .populate(storyPopulate)
      .sort({ createdAt: -1 });

    const filteredStories = stories.filter(story => {
      if (!story.isCloseFriends) return true;
      if (!user) return false;
      return story.owner._id.toString() === user._id.toString();
    });

    return response(200, filteredStories);
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    return response(500, { message: "Error fetching stories" });
  }
};

const deleteStory = async ({ id, userId }) => {
  const story = await Story.findById(id);
  if (!story) return response(404, { message: "Story not found" });
  if (story.owner.toString() !== userId.toString()) {
    return response(401, { message: "Unauthorized" });
  }

  const storyId = story._id;
  story.isDeleted = true;
  story.isArchived = true;
  story.isHighlighted = false;
  story.preserveAfterExpiration = false;
  story.highlightIds = [];
  await story.save();

  await Highlight.updateMany(
    { stories: storyId },
    { $pull: { stories: storyId } }
  );

  io.emit("delete-story", storyId);
  return response(200, { message: "Story deleted successfully" });
};

const getStoriesById = async ({ id, user }) => {
  const story = await Story.findById(id).populate(storyPopulate);
  if (!story || story.isDeleted) return response(404, { message: "Story Not Found" });

  if (user) {
    await Story.findByIdAndUpdate(
      id,
      { $addToSet: { views: user._id } },
      { new: true }
    );
  }

  const updatedStory = await Story.findById(id).populate(storyPopulate);
  return response(200, updatedStory);
};

const viewStory = async ({ id, userId }) => {
  const story = await Story.findById(id);
  if (!story) return response(404, { message: "Story not found" });

  const updatedStory = await Story.findByIdAndUpdate(
    id,
    { $addToSet: { views: userId } },
    { new: true }
  ).populate(storyPopulate);

  io.emit("update-story", updatedStory);
  return response(200, { story: updatedStory });
};

const toggleLoveStory = async ({ id, userId }) => {
  const story = await Story.findById(id);
  if (!story) return response(404, { message: "Story not found" });

  const isLoved = story.loves.includes(userId);
  const update = isLoved ? { $pull: { loves: userId } } : { $addToSet: { loves: userId } };
  const updatedStory = await Story.findByIdAndUpdate(id, update, { new: true }).populate(storyPopulate);

  if (!isLoved && !story.owner.equals(userId)) {
    const owner = await User.findById(story.owner);
    if (!owner.BlockedNotificationFromUsers.includes(userId)) {
      await sendNotificationHelper({
        sender: userId,
        receiver: story.owner,
        content: "❤️ Liked your Story",
        type: "like",
        actionRef: story._id,
        actionModel: "Story",
      });
    }
  }

  io.emit("update-story", updatedStory);
  return response(200, updatedStory);
};

const reactToStory = async ({ id, userId, emoji }) => {
  if (!emoji) return response(400, { message: "Emoji is required" });
  const story = await Story.findById(id);
  if (!story) return response(404, { message: "Story not found" });

  const reactionIndex = story.reactions.findIndex(r => r.user.toString() === userId.toString());
  if (reactionIndex > -1) {
    story.reactions[reactionIndex].emoji = emoji;
    story.reactions[reactionIndex].createdAt = new Date();
  } else {
    story.reactions.push({ user: userId, emoji });
  }

  await story.save();
  const updatedStory = await Story.findById(story._id).populate(storyPopulate);

  if (!story.owner.equals(userId)) {
    await sendNotificationHelper({
      sender: userId,
      receiver: story.owner,
      content: `${emoji} Reacted to your Story`,
      type: "reaction",
      actionRef: story._id,
      actionModel: "Story",
    });
  }

  io.emit("update-story", updatedStory);
  return response(200, updatedStory);
};

const getStoryViewers = async ({ id, userId }) => {
  const story = await Story.findById(id).populate("views", "username profileName profilePhoto");
  if (!story) return response(404, { message: "Story not found" });
  if (story.owner.toString() !== userId.toString()) {
    return response(401, { message: "Only owner can see viewers list" });
  }
  return response(200, story.views);
};

const getRecentStories = async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const now = new Date();
  const stories = await Story.find({
    createdAt: { $gte: yesterday },
    isDeleted: false,
    isArchived: false,
    expiresAt: { $gt: now }
  });
  return response(200, stories);
};

const getUserStories = async (userId) => {
  const now = new Date();
  const stories = await Story.find({
    owner: userId,
    isDeleted: false,
    isArchived: false,
    expiresAt: { $gt: now }
  })
    .populate("owner", "username profilePhoto")
    .sort({ createdAt: -1 });
  return response(200, stories);
};

const getUserArchivedStories = async (userId) => {
  const stories = await Story.find({
    owner: userId,
    isDeleted: false
  })
    .populate("owner", "username profilePhoto")
    .sort({ createdAt: -1 });
  return response(200, stories);
};

const shareStory = async ({ id, userId }) => {
  const originalStory = await Story.findById(id);
  if (!originalStory) return response(404, { message: "Story not found" });

  const sharedStory = new Story({
    text: originalStory.text,
    Photo: originalStory.Photo,
    originalStory: originalStory._id,
    owner: userId,
    isShared: true
  });
  await sharedStory.save();
  await sharedStory.populate(storyPopulate);

  if (!originalStory.owner.equals(userId)) {
    await sendNotificationHelper({
      sender: userId,
      receiver: originalStory.owner,
      content: "🔁 Shared your Story",
      type: "share",
      actionRef: sharedStory._id,
      actionModel: "Story",
    });
  }

  io.emit("new-story", sharedStory);
  return response(201, sharedStory);
};

module.exports = {
  addNewStory,
  getAllStories,
  deleteStory,
  getStoriesById,
  getRecentStories,
  viewStory,
  toggleLoveStory,
  getUserStories,
  getUserArchivedStories,
  shareStory,
  reactToStory,
  getStoryViewers
};
