const asyncHandler = require("express-async-handler");
const { Post, ValidatePost } = require("../Modules/Post");
const fs = require("fs");
const { User } = require("../Modules/User");
const { Community } = require("../Modules/Community");
const cloudinary = require("cloudinary").v2;
const { moderatePost } = require('../utils/CheckTextPost');
// 🔔 Socket.io & Notifications
const { sendNotificationHelper } = require("../utils/SendNotification");
const { postPopulate } = require("../Populates/Populate");
const streamifier = require("streamifier");

// ================== Get All Posts ==================
const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(postPopulate)
    .lean();

  const total = await Post.countDocuments();
  const pages = Math.ceil(total / limit);

  res.status(200).json({
    posts,
    total,
    page,
    pages,
  });
});

// ================== Add Post ==================

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "posts", resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};



const addPost = async (req, res) => {
  try {
    let { text, Hashtags, community, mentions, scheduledAt, links, privacy } = req.body;
    const userId = req.user._id;

    if (typeof Hashtags === "string") Hashtags = [Hashtags];
    else if (!Array.isArray(Hashtags)) Hashtags = [];

    if (typeof mentions === "string") {
      try { mentions = JSON.parse(mentions); }
      catch { mentions = [mentions]; }
    } else if (!Array.isArray(mentions)) mentions = [];

    if (typeof links === "string") {
      try { links = JSON.parse(links); }
      catch { links = [links]; }
    } else if (!Array.isArray(links)) links = [];

    const { error } = ValidatePost({ text, Hashtags, community, mentions });
    if (error) return res.status(400).json({ message: error.details[0].message });

    let postStatus = "published";
    let scheduleDate = null;
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      postStatus = "scheduled";
      scheduleDate = new Date(scheduledAt);
    }

    const moderationResult = await moderatePost({ text });
    const isContainWorst = moderationResult.isContainWorst || false;
    const badWord = moderationResult.badWord || null;

    let communityDoc = null;
    if (community) {
      communityDoc = await Community.findById(community);
      if (!communityDoc) return res.status(404).json({ message: "Community not found." });
      if (!communityDoc.members.includes(userId))
        return res.status(403).json({ message: "Not a member of this community." });
    }

    // Media Upload
    let uploadedMedia = [];
    // Compatible with new 'media' field and legacy 'image' field for robustness
    const files = req.files?.media || req.files?.image;
    let mediaFiles = [];
    if (files) {
      mediaFiles = Array.isArray(files) ? files : [files];
    }

    if (mediaFiles.length > 0) {
      uploadedMedia = await Promise.all(
        mediaFiles.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          const type = result.resource_type === 'video' ? 'video' : 'image';
          return {
            type,
            url: result.secure_url,
            publicId: result.public_id,
            thumbnail: type === 'video' ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : null,
            duration: result.duration || 0
          };
        })
      );
    }

    const legacyPhotos = uploadedMedia.filter(m => m.type !== 'video').map(m => ({ url: m.url, publicId: m.publicId }));

    const post = new Post({
      text,
      media: uploadedMedia,
      Photos: legacyPhotos,
      Hashtags,
      mentions,
      owner: userId,
      community: communityDoc ? communityDoc._id : null,
      scheduledAt: scheduleDate,
      status: postStatus,
      links,
      privacy,
      music: req.body.music || null,
      isContainWorst,
      badWord,
    });

    if (postStatus === "published" && mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        if (mentionedUserId.toString() !== userId.toString()) {
          await sendNotificationHelper({
            sender: userId,
            receiver: mentionedUserId,
            content: "mentioned you in a post",
            type: "mention",
            actionRef: post._id,
            actionModel: "Post",
          });
        }
      }
    }

    const user = await User.findById(userId);
    user.userLevelPoints += 7;
    user.updateLevelRank();
    await user.save();

    await post.save();
    await post.populate(postPopulate);

    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// const addPost = async (req, res) => {
//   try {
//     let { text, Hashtags, community, mentions, scheduledAt, links,privacy} = req.body;
//     const userId = req.user._id;

//     if (typeof Hashtags === "string") Hashtags = [Hashtags];
//     else if (!Array.isArray(Hashtags)) Hashtags = [];

//     if (typeof mentions === "string") {
//       try { mentions = JSON.parse(mentions); }
//       catch { mentions = [mentions]; }
//     } else if (!Array.isArray(mentions)) mentions = [];

//     if (typeof links === "string") {
//       try {
//         links = JSON.parse(links);
//       } catch {
//         links = [links];
//       }
//     } else if (!Array.isArray(links)) {
//       links = [];
//     }

//     const { error } = ValidatePost({ text, Hashtags, community, mentions });
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     // ✅ فحص إذا كان التاريخ مستقبلي
//     let postStatus = "published";
//     let scheduleDate = null;

//     if (scheduledAt && new Date(scheduledAt) > new Date()) {
//       postStatus = "scheduled";
//       scheduleDate = new Date(scheduledAt);
//     }

//     const moderationResult = await moderatePost({ text });
//     if (moderationResult.status === "blocked") {
//       return res.status(400).json({ message: moderationResult.reason });
//     }

//     let communityDoc = null;
//     if (community) {
//       communityDoc = await Community.findById(community);
//       if (!communityDoc) return res.status(404).json({ message: "Community not found." });
//       if (!communityDoc.members.includes(userId))
//         return res.status(403).json({ message: "Not a member of this community." });
//     }

//     let uploadedImages = [];
//     let imagesArr = [];

//     if (Array.isArray(req.files?.image)) imagesArr = req.files.image;
//     else if (req.files?.image) imagesArr = [req.files.image];

//     if (imagesArr.length > 0) {
//       uploadedImages = await Promise.all(
//         imagesArr.map(async (img) => {
//           const result = await uploadToCloudinary(img.buffer);
//           return { url: result.secure_url, publicId: result.public_id };
//         })
//       );
//     }

//     const post = new Post({
//       text,
//       Photos: uploadedImages,
//       Hashtags,
//       mentions,
//       owner: userId,
//       community: communityDoc ? communityDoc._id : null,
//       scheduledAt: scheduleDate,
//       status: postStatus,
//       links, // ✅ تم الإضافة هنا
//       privacy // ✅ تم الإضافة هنا
//     });

//     // إشعارات mentions فقط إذا تم النشر فورًا
//     if (postStatus === "published" && mentions.length > 0) {
//       for (const mentionedUserId of mentions) {
//         if (mentionedUserId.toString() !== userId.toString()) {
//           await sendNotificationHelper({
//             sender: userId,
//             receiver: mentionedUserId,
//             content: "mentioned you in a post",
//             type: "mention",
//             actionRef: post._id,
//             actionModel: "Post",
//           });
//         }
//       }
//     }

//     const user = await User.findById(userId);
//     user.userLevelPoints += 7;
//     user.updateLevelRank();
//     await user.save();

//     await post.save();
//     await post.populate(postPopulate);

//     return res.status(201).json(post);
//   } catch (err) {
//     return res.status(500).json({ message: err.message || "Internal Server Error" });
//   }
// };



// ================== Delete Post ==================
// ================== Delete Post ==================
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Check if user is owner or admin
  if (post.owner.toString() !== req.user._id && !req.user.isAdmin) {
    return res.status(403).json({ message: "You are not authorized to delete this post" });
  }

  // Gather publicIds from media and Photos to ensure full cleanup
  const idsToDelete = new Set();
  if (post.media) post.media.forEach(m => { if (m.publicId) idsToDelete.add(m.publicId); });
  if (post.Photos) post.Photos.forEach(p => { if (p.publicId) idsToDelete.add(p.publicId); });

  for (const publicId of idsToDelete) {
    await cloudinary.uploader.destroy(publicId);
  }

  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Post deleted" });
});


// ================== Get All Posts ==================
const hahaPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.likes.includes(req.user._id)) {
    return res.status(400).json({ message: "You can't hahed a post that has been liked" });
  }
  if (post.hahas.includes(req.user._id)) {
    await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { hahas: req.user._id } }
    );
  } else {
    // إضافة لايك
    await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { hahas: req.user._id } }
    );

    const postOwner = await User.findById(post.owner).select("BlockedNotificationFromUsers");

    // 👇 لا ترسل إشعار لنفسك ولا لمن حظرك من الإشعارات
    if (
      !post.owner.equals(req.user._id) &&
      !postOwner.BlockedNotificationFromUsers
        .map(id => id.toString())
        .includes(req.user._id.toString())
    ) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: post.owner,
        content: "haha your post",
        type: "haha",
        actionRef: post._id,
        actionModel: "Post",
      });
    }
  }
  const updatedPost = await Post.findById(req.params.id)
    .populate(postPopulate);

  res.status(200).json(updatedPost);
})

// ================== Like Post ==================
const likePost = asyncHandler(async (req, res) => {
  // جلب البوست الأساسي
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.hahas.includes(req.user._id)) {
    return res.status(400).json({ message: "You can't like a post that has been hahed" });
  }
  // إذا كان المستخدم قد أعجب بالبوست مسبقًا → إلغاء اللايك
  if (post.likes.includes(req.user._id)) {
    await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } }
    );
  } else {
    // إضافة لايك
    await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { likes: req.user._id } }
    );

    const postOwner = await User.findById(post.owner).select("BlockedNotificationFromUsers");
    if (
      !post.owner.equals(req.user._id) &&
      !postOwner.BlockedNotificationFromUsers
        .map(id => id.toString())
        .includes(req.user._id.toString())
    ) {
      await sendNotificationHelper({
        sender: req.user._id,
        receiver: post.owner,
        content: "liked your post",
        type: "like",
        actionRef: post._id,
        actionModel: "Post",
      });
    }
  }

  // جلب البوست كامل بعد التعديل مع كل populate
  const updatedPost = await Post.findById(req.params.id)
    .populate(postPopulate);

  res.status(200).json(updatedPost);
});



// ================== Save Post ==================
const savePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.saved.includes(req.user._id)) {
    await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { saved: req.user._id } }
    );
  } else {
    await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { saved: req.user._id } }
    );
  }

  // ✅ هات البوست كامل بعد التعديل
  const updatedPost = await Post.findById(req.params.id)
    .populate(postPopulate);

  res.status(200).json(updatedPost);
});


// ================== Share Post ==================
const sharePost = asyncHandler(async (req, res) => {
  const originalPost = await Post.findById(req.params.id).populate(
    "owner",
    "username profileName profilePhoto"
  );

  if (!originalPost) {
    return res.status(404).json({ message: "Post not found" });
  }

  const { customText } = req.body;

  const sharedPost = new Post({
    text: customText || "",
    owner: req.user._id,
    Photos: originalPost.Photos,
    media: originalPost.media,
    links: originalPost.links,
    originalPost: originalPost._id,
    isShared: true,
  });
  const postOwner = await User.findById(originalPost.owner).select("BlockedNotificationFromUsers");
  if (
    !originalPost.owner.equals(req.user._id) &&
    !postOwner.BlockedNotificationFromUsers
      .map(id => id.toString())
      .includes(req.user._id.toString())
  ) {
    await sendNotificationHelper({
      sender: req.user._id,
      receiver: originalPost.owner,
      content: "shared your post",
      type: "share",
      actionRef: sharedPost._id,
      actionModel: "Post",
    });
  }
  await sharedPost.save();
  await sharedPost.populate(postPopulate);

  // ✅ رجع بوست كامل فقط
  res.status(201).json(sharedPost);
});


// ================== Edit Post ==================
const editPost = asyncHandler(async (req, res) => {
  let { text, community, Hashtags, existingMedia, existingPhotos, mentions, links } = req.body;

  try {
    existingMedia = existingMedia ? JSON.parse(existingMedia) : [];
    // Fallback: if frontend sends existingPhotos but not existingMedia
    if (existingMedia.length === 0 && existingPhotos) {
      const photos = JSON.parse(existingPhotos);
      existingMedia = photos.map(p => ({ ...p, type: 'image' }));
    }

    Hashtags = Hashtags ? JSON.parse(Hashtags) : [];

    if (typeof mentions === "string") {
      try { mentions = JSON.parse(mentions); } catch { mentions = [mentions]; }
    } else if (!Array.isArray(mentions)) mentions = [];

    if (typeof links === "string") {
      try { links = JSON.parse(links); } catch { links = [links]; }
    } else if (!Array.isArray(links)) links = [];

  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON in body fields" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // New media files (field: newMedia, fallback to newPhotos)
  let newFiles = [];
  if (req.files?.newMedia) {
    newFiles = Array.isArray(req.files.newMedia) ? req.files.newMedia : [req.files.newMedia];
  } else if (req.files?.newPhotos) {
    newFiles = Array.isArray(req.files.newPhotos) ? req.files.newPhotos : [req.files.newPhotos];
  }

  if (!text && existingMedia.length === 0 && newFiles.length === 0) {
    return res.status(400).json({ message: "Post cannot be empty" });
  }

  // Identify removed items
  // Current post.media (or build from Photos if media missing)
  const currentMedia = (post.media && post.media.length > 0) ? post.media : (post.Photos || []).map(p => ({ ...p.toObject(), type: 'image' }));

  const keptPublicIds = new Set(existingMedia.map(m => m.publicId));
  const removedMedia = currentMedia.filter(m => !keptPublicIds.has(m.publicId));

  for (const item of removedMedia) {
    if (item.publicId) await cloudinary.uploader.destroy(item.publicId);
  }

  // Upload new
  const newUploadedMedia = [];
  for (const file of newFiles) {
    const result = await uploadToCloudinary(file.buffer);
    const type = result.resource_type === 'video' ? 'video' : 'image';
    newUploadedMedia.push({
      type,
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: type === 'video' ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : null,
      duration: result.duration || 0
    });
  }

  const finalMedia = [...existingMedia, ...newUploadedMedia];
  const finalPhotos = finalMedia.filter(m => m.type !== 'video').map(m => ({ url: m.url, publicId: m.publicId }));

  post.text = text ?? post.text;
  post.community = community || post.community;
  post.Hashtags = Hashtags;
  post.media = finalMedia;
  post.Photos = finalPhotos; // Update legacy
  post.mentions = mentions || post.mentions;
  post.links = links || post.links;
  post.music = req.body.music || post.music;

  await post.save();
  await post.populate(postPopulate);

  res.status(200).json(post);
});




// ================== Toggle Comments ==================
const makeCommentsOff = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  post.isCommentOff = !post.isCommentOff;
  await post.save();

  const message = post.isCommentOff
    ? "Comments are now off for this post."
    : "Comments are now on for this post";

  const updatedPost = await Post.findById(req.params.id).populate(postPopulate);

  res.status(200).json({ message, post: updatedPost });
});

const viewPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  // البحث عن البوست
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // إضافة المستخدم الحالي لقائمة المشاهدات إذا لم يكن موجوداً مسبقاً
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { views: req.user._id } }, // $addToSet يمنع التكرار
    { new: true }
  ).populate(postPopulate);

  res.status(200).json({
    post: updatedPost
  });
});


// ================== Get Posts By User ==================
const getPostsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId; // 👈 ID اليوزر اللي عايز تجيب بوستاته
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 📝 جلب البوستات الخاصة بيوزر معين
  const posts = await Post.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(postPopulate)
    .lean();

  // 📝 احسب العدد الكلي للبوستات الخاصة باليوزر
  const total = await Post.countDocuments({ owner: userId });
  const pages = Math.ceil(total / limit);

  res.status(200).json({
    posts,
    total,
    page,
    pages,
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(postPopulate);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
});



module.exports = {
  getAllPosts,
  makeCommentsOff,
  addPost,
  deletePost,
  getPostById,
  likePost,
  savePost,
  sharePost,
  editPost,
  viewPost,
  hahaPost,
  getPostsByUser
};
