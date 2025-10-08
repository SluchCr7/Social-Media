const { validateStory, Story } = require("../Modules/Story");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const {v2} = require('cloudinary');
// 🔔 Socket.io & Notifications
const { getReceiverSocketId, io } = require("../Config/socket");
const { Notification } = require("../Modules/Notification");
const { cloudUpload } = require("../Config/cloudUpload"); // اللي انت عامله
const { User} = require('../Modules/User');
const { storyPopulate } = require("../Populates/Populate");
const { sendNotificationHelper } = require("../utils/SendNotification");

/**
 * @desc Add a new story (image, text, or both)
 * @route POST /api/stories
 * @access Private
 */

// const addNewStory = asyncHandler(async (req, res) => {
//   const { text } = req.body;
//   let photoUrl = "";

//   // ✅ رفع الصورة لو موجودة
//   if (req.files && req.files.image && req.files.image.length > 0) {
//     const image = req.files.image[0]; // أول صورة
//     const result = await v2.uploader.upload(image.path, {
//       resource_type: "image",
//     });
//     photoUrl = result.secure_url;

//     // بعد الرفع إحذف الملف المحلي
//     fs.unlinkSync(image.path);
//   }

//   // ✅ التأكد أن فيه نص أو صورة (واحدة على الأقل)
//   if (!text && !photoUrl) {
//     return res
//       .status(400)
//       .json({ message: "يجب إضافة نص أو صورة على الأقل." });
//   }

//   // ✅ إنشاء وحفظ القصة
//   const story = new Story({
//     text: text || "",      // نص (ممكن يكون موجود مع الصورة أو لوحده)
//     Photo: photoUrl || "", // صورة (ممكن تكون مع النص أو لوحدها)
//     owner: req.user._id,
//   });

//   await story.save();

//   res.status(201).json({ message: "Story added successfully", story });
// });
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

  // ✅ إضافة نقاط لصاحب القصة
  const user = await User.findById(req.user._id);
  user.userLevelPoints += 5;
  user.updateLevelRank();
  await user.save();

  const collaboratorIds = collaborators.map(c => {
    if (typeof c === "string") return c;         
    if (c?._id) return c._id.toString();         
    return null;                                  
  }).filter(Boolean);                            

  await Promise.all(
    collaboratorIds.map(id => {
      if (String(id) === String(req.user._id)) return null; 

      return sendNotificationHelper({
        sender: req.user._id,
        receiver: id, // الآن ID فقط
        content: `${user.username} added you as a collaborator in a story 🎉`,
        type: "collaborator",
        actionRef: story._id,
        actionModel: "Story",
      }).catch(err => console.error(`Failed to notify ${id}:`, err.message));
    })
  );

  res.status(201).json({ message: "Story added successfully", story });
});

/**
 * @desc Get all stories
 * @route GET /api/stories
 * @access Private
 */

const getAllStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().populate(storyPopulate);
  res.status(200).json(stories);
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
  await story.remove();
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

  res.status(200).json({
    story: updatedStory
  });
});


const toggleLoveStory = asyncHandler(async (req, res) => {

  // جلب البوست الأساسي
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }

  // إذا كان المستخدم قد أعجب بالبوست مسبقًا → إلغاء اللايك
  if (story.loves.includes(req.user._id)) {
    await Story.findByIdAndUpdate(
      req.params.id,
      { $pull: { loves: req.user._id } }
    );
  } else {
    // إضافة لايك
    await Story.findByIdAndUpdate(
      req.params.id,
      { $push: { loves: req.user._id } }
    );


    if (!story.owner.equals(req.user._id)) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: story.owner,
        content: "love your Story",
        type: "like",
        actionRef: story._id,
        actionModel: "Story",
      });
    }
  }

  // جلب البوست كامل بعد التعديل مع كل populate
  const updatedStory = await Story.findById(req.params.id)
    .populate(storyPopulate);
  
  res.status(200).json(updatedStory);
});


const getRecentStories = asyncHandler(async (req, res) => {
  
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stories = await Story.find({ createdAt: { $gte: yesterday } } )

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
    "username profileName profilePhoto"
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
  if (!originalStory.owner.equals(req.user._id)) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: originalStory.owner,
        content: "Shared your Story",
        type: "share",
        actionRef: sharedStory._id,
        actionModel: "Story",
      });
  }
  await sharedStory.save();
  await sharedStory.populate(storyPopulate);

  // ✅ رجع بوست كامل فقط
  res.status(201).json(sharedStory);
});



module.exports = {
  addNewStory,
    getAllStories,
    deleteStory,
  getStoriesById, getRecentStories,
  viewStory, toggleLoveStory,getUserStories,shareStory
};