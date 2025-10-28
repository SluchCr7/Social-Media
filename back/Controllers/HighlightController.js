const Highlight = require("../Modules/Highlight");
const { cloudUpload } = require("../Config/cloudUpload"); // تأكد من المسار الصحيح
const Story = require("../Modules/Story");

// POST /api/highlights
const createHighlight = async (req, res) => {
  try {
    const { title, storyIds } = req.body;
    const userId = req.user._id;

    let coverImageUrl = null;

    // ✅ لو المستخدم أرسل صورة
    if (req.file) {
      const uploadResult = await cloudUpload(req.file);
      coverImageUrl = uploadResult.secure_url;
    }

    // ✅ إنشاء الـ Highlight في قاعدة البيانات
    const highlight = await Highlight.create({
      user: userId,
      title,
      coverImage: coverImageUrl,
      stories: storyIds,
    });

    // ✅ تحديث القصص لجعلها "مُظللة" لمنع حذفها التلقائي
    await Story.updateMany(
      { _id: { $in: storyIds } },
      { $set: { isHighlighted: true } }
    );

    res.status(201).json(highlight);
  } catch (err) {
    console.error("Create Highlight Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/highlights/:userId
const getUserHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find({ user: req.params.userId })
      .populate({
        path: "stories",
        select: "Photo text originalStory createdAt",
      });

    res.status(200).json(highlights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/highlights/:id
const deleteHighlight = async (req, res) => {
  try {
    await Highlight.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Highlight deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * إضافة Story جديدة إلى Highlight موجودة
 * @route POST /api/highlights/:highlightId/add-story
 */
export const addStoryToHighlight = async (req, res) => {
  try {
    const { highlightId } = req.params;
    const { storyId } = req.body;
    const userId = req.user?._id; // assuming you use auth middleware

    if (!storyId)
      return res.status(400).json({ message: "storyId is required" });

    // التحقق من أن الهايلايت موجودة فعلاً وتخص المستخدم
    const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
    if (!highlight)
      return res.status(404).json({ message: "Highlight not found" });

    // التحقق أن الستوري موجودة وتخص نفس المستخدم
    const story = await Story.findOne({ _id: storyId, owner: userId });
    if (!story)
      return res.status(404).json({ message: "Story not found or unauthorized" });

    // تجنب التكرار
    if (highlight.stories.includes(storyId)) {
      return res.status(400).json({ message: "Story already in highlight" });
    }

    highlight.stories.push(storyId);
    await highlight.save();

    // ✅ تحديث القصة لجعلها "مُظللة" لمنع حذفها التلقائي
    await Story.findByIdAndUpdate(storyId, { $set: { isHighlighted: true } });
    // إعادة highlight كاملة بعد التحديث
    const updatedHighlight = await Highlight.findById(highlightId)
      .populate("stories");

    return res.status(200).json({
      message: "Story added successfully",
      highlight: updatedHighlight
    });

  } catch (error) {
    console.error("Add story to highlight error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createHighlight,
  getUserHighlights,
  deleteHighlight,addStoryToHighlight
};