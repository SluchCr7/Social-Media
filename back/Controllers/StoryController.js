const { validateStory, Story } = require("../Modules/Story");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const {v2} = require('cloudinary');

/**
 * @desc Add a new story (image, text, or both)
 * @route POST /api/stories
 * @access Private
 */

const addNewStory = asyncHandler(async (req, res) => {
    const { text } = req.body;
  
    let photoUrl = "";
  
    // إذا كانت هناك صورة، قم برفعها إلى Cloudinary
    if (req.files && req.files.image && req.files.image.length > 0) {
      const image = req.files.image;
      const result = await v2.uploader.upload(image[0].path, {
        resource_type: "image",
      });
      photoUrl = result.secure_url;
    }

    // التأكد أن إما النص أو الصورة موجودين
    if (!text && !photoUrl) {
      return res.status(400).json({ message: "يجب إضافة نص أو صورة على الأقل." });
    }
  
    // إنشاء الـ Story
    const story = new Story({
      text: text || '',
      Photo: photoUrl,
      owner: req.user._id,
    });
  
    await story.save();
  
    res.status(201).json({ message: "Story added successfully", story });
  fs.unlinkSync(req.file.path);
  });
/**
 * @desc Get all stories
 * @route GET /api/stories
 * @access Private
 */

const getAllStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().populate('owner', 'username profilePhoto')
    .populate('likes', 'username profilePhoto')
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
    .populate('owner', 'username profilePhoto')
    .populate('likes', 'username profilePhoto')
    .populate('views', 'username profilePhoto');

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
    .populate('likes', 'username profilePhoto')
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
    .populate('likes', 'username profilePhoto')
    .populate('views', 'username profilePhoto');

  res.status(200).json({
    story: updatedStory
  });
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
  viewStory
};