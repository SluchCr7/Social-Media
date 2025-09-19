const { validateStory, Story } = require("../Modules/Story");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const {v2} = require('cloudinary');
// 🔔 Socket.io & Notifications
const { getReceiverSocketId, io } = require("../Config/socket");
const { Notification } = require("../Modules/Notification");
const { cloudUpload } = require("../Config/cloudUpload"); // اللي انت عامله

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
  const { text } = req.body;
  let photoUrl = "";

  // ✅ رفع الصورة لو موجودة
  if (req.file) { 
    const result = await cloudUpload(req.file); 
    photoUrl = result.secure_url;
  }

  // ✅ التأكد أن فيه نص أو صورة (واحدة على الأقل)
  if (!text && !photoUrl) {
    return res
      .status(400)
      .json({ message: "يجب إضافة نص أو صورة على الأقل." });
  }

  // ✅ إنشاء وحفظ القصة
  const story = new Story({
    text: text || "",
    Photo: photoUrl || "",
    owner: req.user._id,
  });

  await story.save();

  res.status(201).json({ message: "Story added successfully", story });
});



/**
 * @desc Get all stories
 * @route GET /api/stories
 * @access Private
 */

const getAllStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().populate('owner', 'username profileName profilePhoto')
    .populate('loves', 'username profilePhoto')
    .populate('views', 'username profilePhoto');
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
  const story = await Story.findById(req.params.id)
    .populate('owner', 'username profileName profilePhoto')
    .populate('loves', 'username profileName profilePhoto')
    .populate('views', 'username profileName profilePhoto');

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
  const updatedStory = await Story.findById(req.params.id)
    .populate('owner', 'username profilePhoto')
    .populate('loves', 'username profilePhoto')
    .populate('views', 'username profilePhoto');

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
  )
    .populate('owner', 'username profilePhoto')
    .populate('loves', 'username profilePhoto')
    .populate('views', 'username profilePhoto');

  res.status(200).json({
    story: updatedStory
  });
});


const toggleLoveStory = asyncHandler(async (req, res) => {
  // const story = await Story.findById(req.params.id);
  // if (!story) {
  //   return res.status(404).json({ message: "Story not found" });
  // }

  // const userId = req.user._id;

  // // إذا كان المستخدم قد أحب الستوري مسبقًا، يتم إزالة الحب
  // if (story.loves.includes(userId)) {
  //   story.loves.pull(userId);
  //   await story.save();
  //   return res.status(200).json({ message: "Love removed", story });
  // }

  // // إذا لم يكن المستخدم قد أحب الستوري بعد، يتم الإضافة
  // story.loves.push(userId);
  // await story.save();

  // res.status(200).json({ message: "Love added", story });
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

    // إنشاء إشعار لصاحب البوست
// ✅ إرسال إشعار فقط إذا اللايك ليس على بوستك
    if (!story.owner.equals(req.user._id)) {
      const newNotify = new Notification({
        content: "love your Story",
        type: "like",
        sender: req.user._id,
        receiver: story.owner,
        actionRef: story._id,
        actionModel: "Story",
      });
      await newNotify.save();

      // إرسال الإشعار عبر السوكيت إذا كان متصل
      const receiverSocketId = getReceiverSocketId(story.owner);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", newNotify);
      }
    }
  }

  // جلب البوست كامل بعد التعديل مع كل populate
  const updatedStory = await Story.findById(req.params.id)
    .populate("owner", "username profileName profilePhoto")
    .populate('loves', 'username profilePhoto')
    .populate('views', 'username profilePhoto');

  res.status(200).json(updatedStory);
});


const getRecentStories = asyncHandler(async (req, res) => {
  
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stories = await Story.find({ createdAt: { $gte: yesterday } } )

  res.status(200).json(stories);
});


module.exports = {
  addNewStory,
    getAllStories,
    deleteStory,
  getStoriesById, getRecentStories,
  viewStory, toggleLoveStory
};