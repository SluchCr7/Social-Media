const { Highlight, ValidateHighlight, ValidateHighlightUpdate } = require("../Modules/Highlight");
const { cloudUpload, cloudRemove } = require("../Config/cloudUpload");
const { Story } = require("../Modules/Story");

const response = (status, body) => ({ status, body });

const updateStoriesHighlightMetadata = async (storyIds, highlightId) => {
  if (!Array.isArray(storyIds) || storyIds.length === 0) return;
  await Story.updateMany(
    { _id: { $in: storyIds }, isDeleted: false },
    {
      $addToSet: { highlightIds: highlightId },
      $set: {
        isHighlighted: true,
        preserveAfterExpiration: true,
      },
    }
  );
};

const removeHighlightMetadataFromStories = async (storyIds, highlightId) => {
  if (!Array.isArray(storyIds) || storyIds.length === 0) return;

  await Story.updateMany(
    { _id: { $in: storyIds } },
    { $pull: { highlightIds: highlightId } }
  );

  const expiredStories = await Story.find({
    _id: { $in: storyIds },
    expiresAt: { $lte: new Date() },
    isDeleted: false,
    $or: [{ highlightIds: { $exists: false } }, { highlightIds: [] }],
  });

  if (expiredStories.length > 0) {
    const expiredIds = expiredStories.map((story) => story._id);
    await Story.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { isHighlighted: false, preserveAfterExpiration: false } }
    );
  }
};

const createHighlight = async ({ body, file, userId }) => {
  let storyIdsInput = body.storyIds || body.stories;
  if (typeof storyIdsInput === 'string') {
    try {
      const parsed = JSON.parse(storyIdsInput);
      if (Array.isArray(parsed)) storyIdsInput = parsed;
      else storyIdsInput = [storyIdsInput];
    } catch (e) {
      storyIdsInput = [storyIdsInput];
    }
  }
  if (storyIdsInput) body.storyIds = storyIdsInput;

  const { error } = ValidateHighlight(body);
  if (error) return response(400, { message: error.details[0].message });

  const { title, description, isPublic, tags, color, order } = body;
  let coverImageUrl = null;
  if (file) {
    const uploadResult = await cloudUpload(file);
    coverImageUrl = uploadResult.secure_url;
  }

  let finalStoryIds = [];
  if (storyIdsInput) {
    finalStoryIds = Array.isArray(storyIdsInput) ? storyIdsInput : [storyIdsInput];
    finalStoryIds = [...new Set(finalStoryIds.map((id) => id.toString()))];
  }

  const validStories = finalStoryIds.length
    ? await Story.find({ _id: { $in: finalStoryIds }, owner: userId, isDeleted: false })
    : [];
  const validStoryIds = validStories.map((story) => story._id);

  const highlight = await Highlight.create({
    user: userId,
    title,
    description: description || '',
    coverImage: coverImageUrl || (validStories[0]?.Photo?.[0] || null),
    stories: validStoryIds,
    isPublic: isPublic !== undefined ? isPublic : true,
    tags: tags || [],
    color: color || '#6366f1',
    order: order || 0
  });

  await updateStoriesHighlightMetadata(validStoryIds, highlight._id);
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  return response(201, highlight);
};

const getUserHighlights = async (userId) => {
  const highlights = await Highlight.find({ user: userId })
    .populate({
      path: "stories",
      match: { isDeleted: false },
      select: "Photo text originalStory createdAt owner views loves reactions music link",
    })
    .sort({ order: 1, createdAt: -1 });
  return response(200, highlights);
};

const getHighlightById = async (id) => {
  const highlight = await Highlight.findById(id).populate({
    path: 'stories',
    match: { isDeleted: false }
  });
  if (!highlight) return response(404, { message: "Highlight not found" });

  highlight.viewCount += 1;
  await highlight.save();
  return response(200, highlight);
};

const deleteHighlight = async ({ id, userId }) => {
  const highlight = await Highlight.findById(id);
  if (!highlight) return response(404, { message: "Highlight not found" });
  if (highlight.user.toString() !== userId.toString()) {
    return response(403, { message: "Not authorized to delete this highlight" });
  }

  if (highlight.coverImage) {
    try {
      await cloudRemove(highlight.coverImage);
    } catch (err) {
      console.error("Failed to delete cover image:", err);
    }
  }

  await removeHighlightMetadataFromStories(highlight.stories, highlight._id);
  await highlight.deleteOne();
  return response(200, { message: "Highlight deleted successfully" });
};

const addStoryToHighlight = async ({ highlightId, body, userId }) => {
  const { storyId, storyIds } = body;
  let idsToProcess = [];
  if (storyId) idsToProcess.push(storyId);
  if (storyIds) {
    if (Array.isArray(storyIds)) idsToProcess = [...idsToProcess, ...storyIds];
    else if (typeof storyIds === 'string') {
      try {
        const parsed = JSON.parse(storyIds);
        if (Array.isArray(parsed)) idsToProcess = [...idsToProcess, ...parsed];
        else idsToProcess.push(storyIds);
      } catch (e) {
        idsToProcess.push(storyIds);
      }
    }
  }

  idsToProcess = [...new Set(idsToProcess)];
  if (idsToProcess.length === 0) {
    return response(400, { message: "storyId or storyIds is required" });
  }

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) return response(404, { message: "Highlight not found" });

  const existingIds = highlight.stories.map(id => id.toString());
  const newIds = idsToProcess.filter(id => !existingIds.includes(id.toString()));
  if (newIds.length === 0) {
    return response(400, { message: "All stories already in highlight" });
  }

  const validStories = await Story.find({ _id: { $in: newIds }, owner: userId, isDeleted: false });
  if (validStories.length === 0) {
    return response(404, { message: "No valid stories found" });
  }

  const validIds = validStories.map(s => s._id);
  highlight.stories.push(...validIds);
  highlight.stories = [...new Set(highlight.stories.map((id) => id.toString()))];
  await highlight.save();
  await updateStoriesHighlightMetadata(validIds, highlight._id);
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });

  return response(200, {
    message: `${validIds.length} stories added successfully`,
    highlight
  });
};

const updateHighlight = async ({ id, body, file, userId }) => {
  const { error } = ValidateHighlightUpdate(body);
  if (error) return response(400, { message: error.details[0].message });

  const { title, description, isPublic, tags, color, order } = body;
  const highlight = await Highlight.findOne({ _id: id, user: userId });
  if (!highlight) return response(404, { message: "Highlight not found" });

  if (title !== undefined) highlight.title = title;
  if (description !== undefined) highlight.description = description;
  if (isPublic !== undefined) highlight.isPublic = isPublic;
  if (tags !== undefined) highlight.tags = tags;
  if (color !== undefined) highlight.color = color;
  if (order !== undefined) highlight.order = order;

  if (file) {
    if (highlight.coverImage) await cloudRemove(highlight.coverImage).catch(() => { });
    const uploadResult = await cloudUpload(file);
    highlight.coverImage = uploadResult.secure_url;
  }

  await highlight.save();
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });
  return response(200, highlight);
};

const removeStoryFromHighlight = async ({ highlightId, storyId, userId }) => {
  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) return response(404, { message: "Highlight not found" });

  const storyIndex = highlight.stories.findIndex((story) => story.toString() === storyId);
  if (storyIndex === -1) {
    return response(404, { message: "Story not part of highlight" });
  }

  highlight.stories = highlight.stories.filter((story) => story.toString() !== storyId);
  await highlight.save();
  await removeHighlightMetadataFromStories([storyId], highlight._id);
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });
  return response(200, { message: "Story removed successfully", highlight });
};

const updateStoriesOrder = async ({ highlightId, storyIds, userId }) => {
  if (!Array.isArray(storyIds)) return response(400, { message: "storyIds must be an array" });

  const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
  if (!highlight) return response(404, { message: "Highlight not found" });

  const existingIds = highlight.stories.map(id => id.toString());
  const allExist = storyIds.every(id => existingIds.includes(id.toString()));
  if (!allExist) return response(400, { message: "Invalid story IDs in reorder list" });

  highlight.stories = storyIds;
  await highlight.save();
  await highlight.populate({
    path: 'stories',
    match: { isDeleted: false }
  });
  return response(200, { message: "Stories reordered successfully", highlight });
};

const reorderHighlights = async ({ highlightIds, userId }) => {
  if (!Array.isArray(highlightIds)) {
    return response(400, { message: "highlightIds must be an array" });
  }

  const updatePromises = highlightIds.map((id, index) =>
    Highlight.findOneAndUpdate(
      { _id: id, user: userId },
      { order: index },
      { new: true }
    )
  );
  await Promise.all(updatePromises);
  return response(200, { message: "Highlights reordered successfully" });
};

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
