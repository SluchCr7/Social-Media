const { Highlight, ValidateHighlight, ValidateHighlightUpdate } = require("../Modules/Highlight");
const { cloudUpload, cloudRemove } = require("../Config/cloudUpload");
const { Story } = require("../Modules/Story");
const asyncHandler = require("express-async-handler");
const { sendNotificationHelper } = require("../utils/SendNotification");

// ================== Create Highlight ==================
const createHighlight = asyncHandler(async (req, res) => {
  const { error } = ValidateHighlight(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, storyIds, isPublic, tags, color, order } = req.body;
  const userId = req.user._id;

  let coverImageUrl = null;

  // Upload cover image
  if (req.file) {
    const uploadResult = await cloudUpload(req.file);
    coverImageUrl = uploadResult.secure_url;
  }

  let finalStoryIds = [];
  if (storyIds) {
    finalStoryIds = Array.isArray(storyIds) ? storyIds : [storyIds];
  }

  // Create highlight
  const highlight = await Highlight.create({
    user: userId,
    title,
    description: description || '',
    coverImage: coverImageUrl,
    stories: finalStoryIds,
    isPublic: isPublic !== undefined ? isPublic : true,
    tags: tags || [],
    color: color || '#6366f1',
    order: order || 0
  });

  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  res.status(201).json(highlight);
});

// ================== Get User Highlights ==================
const getUserHighlights = asyncHandler(async (req, res) => {
  const highlights = await Highlight.find({ user: req.params.userId })
    .populate({
      path: "stories",
      match: { isDeleted: false },
      select: "Photo text originalStory createdAt owner views loves reactions music link",
    })
    .sort({ order: 1, createdAt: -1 });

  res.status(200).json(highlights);
});

// ================== Get Single Highlight ==================
const getHighlightById = asyncHandler(async (req, res) => {
  const highlight = await Highlight.findById(req.params.id).populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found" });
  }

  // Increment view count
  highlight.viewCount += 1;
  await highlight.save();

  res.status(200).json(highlight);
});

// ================== Delete Highlight ==================
const deleteHighlight = asyncHandler(async (req, res) => {
  const highlight = await Highlight.findById(req.params.id);

  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found" });
  }

  // Check ownership
  if (highlight.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this highlight" });
  }

  // Delete cover image if exists
  if (highlight.coverImage) {
    try {
      await cloudRemove(highlight.coverImage);
    } catch (err) {
      console.error("Failed to delete cover image:", err);
    }
  }

  await highlight.deleteOne();
  res.status(200).json({ message: "Highlight deleted successfully" });
});

// ================== Add Story to Highlight ==================
const addStoryToHighlight = asyncHandler(async (req, res) => {
  const { highlightId } = req.params;
  const { storyId, storyIds } = req.body;
  const userId = req.user?._id;

  let idsToProcess = [];
  if (storyId) idsToProcess.push(storyId);
  if (storyIds && Array.isArray(storyIds)) idsToProcess = [...idsToProcess, ...storyIds];

  idsToProcess = [...new Set(idsToProcess)];

  if (idsToProcess.length === 0) {
    return res.status(400).json({ message: "storyId or storyIds is required" });
  }

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) return res.status(404).json({ message: "Highlight not found" });

  const existingIds = highlight.stories.map(id => id.toString());
  const newIds = idsToProcess.filter(id => !existingIds.includes(id.toString()));

  if (newIds.length === 0) {
    return res.status(400).json({ message: "All stories already in highlight" });
  }

  // Verify ownership of stories
  const validStories = await Story.find({ _id: { $in: newIds }, owner: userId });
  if (validStories.length === 0) {
    return res.status(404).json({ message: "No valid stories found" });
  }

  // Add validated IDs
  const validIds = validStories.map(s => s._id);
  highlight.stories.push(...validIds);
  await highlight.save();

  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  return res.status(200).json({
    message: `${validIds.length} stories added successfully`,
    highlight
  });
});

// ================== Update Highlight ==================
const updateHighlight = asyncHandler(async (req, res) => {
  const { error } = ValidateHighlightUpdate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params;
  const { title, description, isPublic, tags, color, order } = req.body;
  const userId = req.user._id;

  const highlight = await Highlight.findOne({ _id: id, user: userId });
  if (!highlight) return res.status(404).json({ message: "Highlight not found" });

  if (title !== undefined) highlight.title = title;
  if (description !== undefined) highlight.description = description;
  if (isPublic !== undefined) highlight.isPublic = isPublic;
  if (tags !== undefined) highlight.tags = tags;
  if (color !== undefined) highlight.color = color;
  if (order !== undefined) highlight.order = order;

  if (req.file) {
    if (highlight.coverImage) await cloudRemove(highlight.coverImage).catch(() => { });
    const uploadResult = await cloudUpload(req.file);
    highlight.coverImage = uploadResult.secure_url;
  }

  await highlight.save();
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  res.status(200).json(highlight);
});

// ================== Remove Story from Highlight ==================
const removeStoryFromHighlight = asyncHandler(async (req, res) => {
  const { highlightId, storyId } = req.params;
  const userId = req.user?._id;

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) return res.status(404).json({ message: "Highlight not found" });

  highlight.stories = highlight.stories.filter(s => s.toString() !== storyId);
  await highlight.save();
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  return res.status(200).json({ message: "Story removed successfully", highlight });
});

// ================== Reorder Highlight Stories ==================
const updateStoriesOrder = asyncHandler(async (req, res) => {
  const { highlightId } = req.params;
  const { storyIds } = req.body; // New order
  const userId = req.user._id;

  if (!Array.isArray(storyIds)) return res.status(400).json({ message: "storyIds must be an array" });

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) return res.status(404).json({ message: "Highlight not found" });

  // Ensure all storyIds in the request are already in the highlight
  // (Security/Integrity check)
  const existingIds = highlight.stories.map(id => id.toString());
  const allExist = storyIds.every(id => existingIds.includes(id.toString()));

  if (!allExist) return res.status(400).json({ message: "Invalid story IDs in reorder list" });

  highlight.stories = storyIds;
  await highlight.save();
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  res.status(200).json({ message: "Stories reordered successfully", highlight });
});

// ================== Reorder Highlights List ==================
const reorderHighlights = asyncHandler(async (req, res) => {
  const { highlightIds } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(highlightIds)) return res.status(400).json({ message: "highlightIds must be an array" });

  const updatePromises = highlightIds.map((id, index) =>
    Highlight.findOneAndUpdate(
      { _id: id, user: userId },
      { order: index },
      { new: true }
    )
  );

  await Promise.all(updatePromises);
  res.status(200).json({ message: "Highlights reordered successfully" });
});

module.exports = {
  createHighlight,
  getUserHighlights,
  getHighlightById,
  deleteHighlight,
  addStoryToHighlight,
  updateHighlight,
  removeStoryFromHighlight,
  reorderHighlights,
  updateStoriesOrder
};