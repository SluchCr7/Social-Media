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
const addNewStory = asyncHandler(async (req, res) => {
  const { text, collaborators = [] } = req.body;
  let photoUrl = "";

  // ✅ رفع الصورة إن وجدت
  if (req.file) {
    const result = await cloudUpload(req.file);
    photoUrl = result.secure_url;
  }

  // ✅ التأكد من وجود نص أو صورة
  if (!text && !photoUrl) {
    return res.status(400).json({ message: "يجب إضافة نص أو صورة على الأقل." });
  }

  // ✅ إنشاء القصة الجديدة
  const story = new Story({
    text: text || "",
    Photo: photoUrl ? [photoUrl] : [], // تأكد أن Photo دايمًا Array
    owner: req.user._id,
    collaborators, // ← array of user IDs
  });

  await story.save();
  await story.populate(storyPopulate);

  // ✅ إضافة نقاط لصاحب القصة
  const user = await User.findById(req.user._id);
  user.userLevelPoints += 5;
  user.updateLevelRank();
  await user.save();

  // 🔔 إرسال تنبيه فوري عبر السوكيت لجميع المستخدمين (أو المتابعين فقط لو حابب)
  io.emit("new-story", story);

  res.status(201).json({ message: "Story added successfully", story });
});

const getAllStories = asyncHandler(async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // ✅ جلب القصص الحديثة فقط (آخر 24 ساعة)
    // ✅ واستثناء القصص الـ Highlighted لأنها دائمة
    const stories = await Story.find({
      createdAt: { $gte: twentyFourHoursAgo },
      $or: [
        { isHighlighted: { $exists: false } },
        { isHighlighted: false }
      ]
    })
      .populate(storyPopulate)
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب القصص" });
  }
});

/**
 * @desc Delete a story
 * @route DELETE /api/stories/:id
 * @access Private
 */

const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  const storyId = story._id;
  await story.remove();

  // 🔔 إخبار الجميع بحذف القصة لتحديث الواجهة فوراً
  io.emit("delete-story", storyId);

  res.status(200).json({ message: "Story deleted successfully" });
});

/**
 * @desc get posts by id
 * @route POST /api/story/:id
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
    { $addToSet: { views: req.user._id } }, // يمنع التكرار
    { new: true }
  );

  // إعادة تحميل الستوري بعد إضافة المشاهدة
  const updatedStory = await Story.findById(req.params.id).populate(storyPopulate);

  res.status(200).json(updatedStory);
});


/**
 * @desc Mark a story as viewed by the current user
 * @route POST /api/stories/view/:id
 * @access Private
 */
const viewStory = asyncHandler(async (req, res) => {
  const storyId = req.params.id;

  // البحث عن الستوري
  const story = await Story.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  // إضافة المستخدم الحالي لقائمة المشاهدات إذا لم يكن موجوداً مسبقاً
  const updatedStory = await Story.findByIdAndUpdate(
    storyId,
    { $addToSet: { views: req.user._id } }, // $addToSet يمنع التكرار
    { new: true }
  ).populate(storyPopulate);

  // 🔔 تحديث القصة عند الجميع (المشاهدات)
  io.emit("update-story", updatedStory);

  res.status(200).json({
    story: updatedStory
  });
});


const toggleLoveStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  // جلب بيانات صاحب الستوري
  const owner = await User.findById(story.owner);

  // إذا كان المستخدم قد أعجب مسبقًا → إلغاء اللايك
  if (story.loves.includes(req.user._id)) {
    await Story.findByIdAndUpdate(req.params.id, {
      $pull: { loves: req.user._id },
    });
  } else {
    // إضافة لايك
    await Story.findByIdAndUpdate(req.params.id, {
      $push: { loves: req.user._id },
    });

    // ✅ إرسال إشعار فقط إذا:
    // - المستخدم الحالي ليس هو صاحب الستوري
    // - وصاحب الستوري لم يقم بحظر الإشعارات منه
    if (
      !story.owner.equals(req.user._id) &&
      !owner.BlockedNotificationFromUsers.includes(req.user._id)
    ) {
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

  const updatedStory = await Story.findById(req.params.id).populate(storyPopulate);

  // 🔔 تحديث القصة عند الجميع (اللايكات)
  io.emit("update-story", updatedStory);

  res.status(200).json(updatedStory);
});



const getRecentStories = asyncHandler(async (req, res) => {

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stories = await Story.find({ createdAt: { $gte: yesterday } })

  res.status(200).json(stories);
});


// GET /api/story/user/:id
const getUserStories = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const stories = await Story.find({ owner: userId })
    .populate("owner", "username profilePhoto")
    .sort({ createdAt: -1 });

  if (!stories.length) {
    return res.status(404).json({ message: "No stories found" });
  }

  res.json(stories);
});

const shareStory = asyncHandler(async (req, res) => {
  const originalStory = await Story.findById(req.params.id).populate(
    "owner",
    "username profileName profilePhoto BlockedNotificationFromUsers"
  );

  if (!originalStory) {
    return res.status(404).json({ message: "Story not found" });
  }

  const sharedStory = new Story({
    text: originalStory.text,
    Photo: originalStory.Photo,
    originalStory: originalStory._id,
    owner: req.user._id,
  });

  // ✅ إرسال إشعار فقط إذا لم يكن المستخدم هو نفس المالك ولم يتم حظره
  if (
    !originalStory.owner._id.equals(req.user._id) &&
    !originalStory.owner.BlockedNotificationFromUsers.includes(req.user._id)
  ) {
    await sendNotificationHelper({
      sender: req.user._id,
      receiver: originalStory.owner._id,
      content: "🔁 Shared your Story",
      type: "share",
      actionRef: sharedStory._id,
      actionModel: "Story",
    });
  }

  await sharedStory.save();
  await sharedStory.populate(storyPopulate);

  // 🔔 إخبار الجميع بالقصة المشتركة الجديدة
  io.emit("new-story", sharedStory);

  res.status(201).json(sharedStory);
});



module.exports = {
  addNewStory,
  getAllStories,
  deleteStory,
  getStoriesById, getRecentStories,
  viewStory, toggleLoveStory, getUserStories, shareStory
};