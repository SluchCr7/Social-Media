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

  // Upload cover image if provided
  if (req.file) {
    const uploadResult = await cloudUpload(req.file);
    coverImageUrl = uploadResult.secure_url;
  }

  // Prepare archived stories
  let archivedStories = [];
  let idsToProcess = [];

  if (storyIds) {
    idsToProcess = Array.isArray(storyIds) ? storyIds : [storyIds];
  }

  if (idsToProcess.length > 0) {
    const stories = await Story.find({ _id: { $in: idsToProcess }, owner: userId });
    archivedStories = stories.map(s => ({
      _id: s._id,
      text: s.text,
      Photo: s.Photo,
      originalStory: s.originalStory,
      createdAt: s.createdAt
    }));
  }

  // Create highlight
  const highlight = await Highlight.create({
    user: userId,
    title,
    description: description || '',
    coverImage: coverImageUrl,
    stories: [],
    archivedStories: archivedStories,
    isPublic: isPublic !== undefined ? isPublic : true,
    tags: tags || [],
    color: color || '#6366f1',
    order: order || 0
  });

  // Format response
  const response = highlight.toObject();
  response.stories = highlight.archivedStories;
  delete response.archivedStories;

  res.status(201).json(response);
});

// ================== Get User Highlights ==================
const getUserHighlights = asyncHandler(async (req, res) => {
  let highlights = await Highlight.find({ user: req.params.userId })
    .populate({
      path: "stories",
      select: "Photo text originalStory createdAt",
    })
    .sort({ order: 1, createdAt: -1 });

  const processedHighlights = await Promise.all(highlights.map(async (h) => {
    // Lazy Migration: migrate old data on demand
    if ((!h.archivedStories || h.archivedStories.length === 0) && h.stories && h.stories.length > 0) {
      const validStories = h.stories.filter(s => s && s._id);

      if (validStories.length > 0) {
        h.archivedStories = validStories.map(s => ({
          _id: s._id,
          text: s.text,
          Photo: s.Photo,
          originalStory: s.originalStory,
          createdAt: s.createdAt
        }));
        h.stories = [];
        await h.save();
      }
    }

    const obj = h.toObject();
    if (h.archivedStories && h.archivedStories.length > 0) {
      obj.stories = h.archivedStories;
    }
    delete obj.archivedStories;

    return obj;
  }));

  res.status(200).json(processedHighlights);
});

// ================== Get Single Highlight ==================
const getHighlightById = asyncHandler(async (req, res) => {
  const highlight = await Highlight.findById(req.params.id);

  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found" });
  }

  // Increment view count
  highlight.viewCount += 1;
  await highlight.save();

  const obj = highlight.toObject();
  if (highlight.archivedStories && highlight.archivedStories.length > 0) {
    obj.stories = highlight.archivedStories;
  }
  delete obj.archivedStories;

  res.status(200).json(obj);
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

  // Delete cover image from cloudinary if exists
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

  // Support both single storyId and multiple storyIds
  let idsToProcess = [];
  if (storyId) idsToProcess.push(storyId);
  if (storyIds && Array.isArray(storyIds)) idsToProcess = [...idsToProcess, ...storyIds];

  // Remove duplicates from request
  idsToProcess = [...new Set(idsToProcess)];

  if (idsToProcess.length === 0) {
    return res.status(400).json({ message: "storyId or storyIds is required" });
  }

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found" });
  }

  // Filter out stories already in the highlight
  const existingIds = highlight.archivedStories.map(s => s._id.toString());
  const newIds = idsToProcess.filter(id => !existingIds.includes(id.toString()));

  if (newIds.length === 0) {
    return res.status(400).json({ message: "All stories already in highlight" });
  }

  // Verify all new stories exist and belong to user
  const stories = await Story.find({ _id: { $in: newIds }, owner: userId });

  if (stories.length === 0) {
    return res.status(404).json({ message: "No valid stories found to add" });
  }

  // Add stories to archive
  stories.forEach(story => {
    highlight.archivedStories.push({
      _id: story._id,
      text: story.text,
      Photo: story.Photo,
      originalStory: story.originalStory,
      createdAt: story.createdAt
    });
  });

  await highlight.save();

  const updatedHighlight = highlight.toObject();
  updatedHighlight.stories = highlight.archivedStories;
  delete updatedHighlight.archivedStories;

  return res.status(200).json({
    message: stories.length === 1 ? "Story added successfully" : `${stories.length} stories added successfully`,
    highlight: updatedHighlight
  });
});

// ================== Update Highlight ==================
const updateHighlight = asyncHandler(async (req, res) => {
  const { error } = ValidateHighlightUpdate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;
  const { title, description, isPublic, tags, color, order } = req.body;
  const userId = req.user._id;

  const highlight = await Highlight.findOne({ _id: id, user: userId });
  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found or unauthorized" });
  }

  // Update fields
  if (title !== undefined) highlight.title = title;
  if (description !== undefined) highlight.description = description;
  if (isPublic !== undefined) highlight.isPublic = isPublic;
  if (tags !== undefined) highlight.tags = tags;
  if (color !== undefined) highlight.color = color;
  if (order !== undefined) highlight.order = order;

  // Update cover image if provided
  if (req.file) {
    // Delete old cover if exists
    if (highlight.coverImage) {
      try {
        await cloudRemove(highlight.coverImage);
      } catch (err) {
        console.error("Failed to delete old cover:", err);
      }
    }
    const uploadResult = await cloudUpload(req.file);
    highlight.coverImage = uploadResult.secure_url;
  }

  await highlight.save();

  // Format response
  const response = highlight.toObject();
  if (highlight.archivedStories && highlight.archivedStories.length > 0) {
    response.stories = highlight.archivedStories;
  }
  delete response.archivedStories;

  res.status(200).json(response);
});

// ================== Remove Story from Highlight ==================
const removeStoryFromHighlight = asyncHandler(async (req, res) => {
  const { highlightId, storyId } = req.params;
  const userId = req.user?._id;

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) {
    return res.status(404).json({ message: "Highlight not found or unauthorized" });
  }

  // Check if story exists in highlight
  const storyExists = highlight.archivedStories && highlight.archivedStories.some(s => s._id.equals(storyId));
  if (!storyExists) {
    return res.status(404).json({ message: "Story not found in this highlight" });
  }

  // Remove story
  highlight.archivedStories = highlight.archivedStories.filter(s => !s._id.equals(storyId));

  await highlight.save();

  // Format response
  const updatedHighlight = highlight.toObject();
  updatedHighlight.stories = highlight.archivedStories;
  delete updatedHighlight.archivedStories;

  return res.status(200).json({
    message: "Story removed successfully",
    highlight: updatedHighlight
  });
});

// ================== Reorder Highlights ==================
const reorderHighlights = asyncHandler(async (req, res) => {
  const { highlightIds } = req.body; // Array of highlight IDs in new order
  const userId = req.user._id;

  if (!Array.isArray(highlightIds)) {
    return res.status(400).json({ message: "highlightIds must be an array" });
  }

  // Update order for each highlight
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
  reorderHighlights
};