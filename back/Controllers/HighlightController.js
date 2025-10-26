const Highlight = require("../Modules/Highlight");
const { cloudUpload } = require("../utils/cloudinary"); // تأكد من المسار الصحيح

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

module.exports = {
  createHighlight,
  getUserHighlights,
  deleteHighlight,
};