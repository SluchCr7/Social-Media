const Highlight = require("../Modules/Highlight");
const { cloudUpload } = require("../Config/cloudUpload"); // تأكد من المسار الصحيح
const { Story } = require("../Modules/Story");

// POST /api/highlights
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

    // ✅ إعداد القصص للأرشفة (فك الارتباط بانتهاء الصلاحة)
    let archivedStories = [];
    if (storyIds && Array.isArray(storyIds) && storyIds.length > 0) {
      const stories = await Story.find({ _id: { $in: storyIds }, owner: userId });
      archivedStories = stories.map(s => ({
        _id: s._id,
        text: s.text,
        Photo: s.Photo,
        originalStory: s.originalStory,
        createdAt: s.createdAt
      }));
    }

    // ✅ إنشاء الـ Highlight مع البيانات المضمنة
    const highlight = await Highlight.create({
      user: userId,
      title,
      coverImage: coverImageUrl,
      stories: [], // نترك المصفوفة القديمة فارغة للجديد
      archivedStories: archivedStories,
    });

    // ❌ لم نعد بحاجة لتحديث حالة isHighlighted في الستوري الأصلية
    // لأننا احتفظنا بنسخة كاملة منها هنا

    // ✅ تنسيق الاستجابة لتناسب الواجهة (mapping)
    const response = highlight.toObject();
    response.stories = highlight.archivedStories;
    delete response.archivedStories;

    res.status(201).json(response);
  } catch (err) {
    console.error("Create Highlight Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/highlights/:userId
// GET /api/highlights/:userId
const getUserHighlights = async (req, res) => {
  try {
    let highlights = await Highlight.find({ user: req.params.userId })
      .populate({
        path: "stories",
        select: "Photo text originalStory createdAt",
      }); // نحتاج الـ populate من أجل عملية الترحيل (Migration) فقط

    const processedHighlights = await Promise.all(highlights.map(async (h) => {
      // ✅ Lazy Migration: ترحيل البيانات القديمة عند الطلب
      if ((!h.archivedStories || h.archivedStories.length === 0) && h.stories && h.stories.length > 0) {

        // تصفية العناصر الفارغة (التي حذفت بالفعل)
        const validStories = h.stories.filter(s => s && s._id);

        if (validStories.length > 0) {
          h.archivedStories = validStories.map(s => ({
            _id: s._id,
            text: s.text,
            Photo: s.Photo,
            originalStory: s.originalStory,
            createdAt: s.createdAt
          }));
          // إفراغ المصفوفة القديمة لتجنب التكرار وتوفير المساحة
          h.stories = [];
          await h.save();
        }
      }

      const obj = h.toObject();
      // إذا وجدنا قصص مؤرشفة، نعيدها في الحقل stories الذي تتوقعه الواجهة الأمامية
      if (h.archivedStories && h.archivedStories.length > 0) {
        obj.stories = h.archivedStories;
      }
      // إخفاء الحقل الداخلي
      delete obj.archivedStories;

      return obj;
    }));

    res.status(200).json(processedHighlights);
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
const addStoryToHighlight = async (req, res) => {
  try {
    const { highlightId } = req.params;
    const { storyId } = req.body;
    const userId = req.user?._id;

    if (!storyId)
      return res.status(400).json({ message: "storyId is required" });

    // التحقق من أن الهايلايت موجودة فعلاً وتخص المستخدم
    const highlight = await Highlight.findOne({ _id: highlightId, user: userId });
    if (!highlight)
      return res.status(404).json({ message: "Highlight not found" });

    // ✅ التحقق من التكرار في الأرشيف
    const alreadyExists = highlight.archivedStories && highlight.archivedStories.some(s => s._id.equals(storyId));
    if (alreadyExists) {
      return res.status(400).json({ message: "Story already in highlight" });
    }

    // التحقق أن الستوري الأصلية موجودة
    const story = await Story.findOne({ _id: storyId, owner: userId });
    if (!story)
      return res.status(404).json({ message: "Story not found or unauthorized" });

    // ✅ إضافة القصة إلى الأرشيف الدائم
    highlight.archivedStories.push({
      _id: story._id,
      text: story.text,
      Photo: story.Photo,
      originalStory: story.originalStory,
      createdAt: story.createdAt
    });

    await highlight.save();

    // ❌ لا نحدث الستوري الأصلية (decoupled)

    const updatedHighlight = highlight.toObject();
    updatedHighlight.stories = highlight.archivedStories;
    delete updatedHighlight.archivedStories;

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
  deleteHighlight, addStoryToHighlight
};