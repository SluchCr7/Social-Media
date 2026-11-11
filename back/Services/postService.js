const { Post, ValidatePost } = require("../Modules/Post");
const mongoose = require("mongoose");
const { User } = require("../Modules/User");
const { Community } = require("../Modules/Community");
const cloudinary = require("cloudinary").v2;
const { moderatePost } = require("../utils/CheckTextPost");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { io } = require("../Config/socket");
const { postPopulate } = require("../Populates/Populate");
const streamifier = require("streamifier");
const { checkImageSensitivity } = require("../utils/ImgShield");
const { updateUserPoints } = require("../utils/PointsEngine");

const result = (status, body) => ({ status, body });
const errorResult = (status, error) => ({ status, error });

const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: "posts", resource_type: "auto" },
    (error, uploaded) => {
      if (uploaded) resolve(uploaded);
      else reject(error);
    }
  );
  streamifier.createReadStream(buffer).pipe(stream);
});

const getAllPosts = async ({ query }) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(postPopulate)
    .lean();
  const total = await Post.countDocuments();
  return result(200, { posts, total, page, pages: Math.ceil(total / limit) });
};

const getVideoPosts = async ({ query }) => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, 30)
    : 10;
  const filter = {
    $or: [
      { "media.type": "video" },
      { "Videos.0": { $exists: true } }
    ]
  };
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(postPopulate)
      .lean(),
    Post.countDocuments(filter)
  ]);
  return result(200, { posts, total, page, pages: Math.ceil(total / limit) });
};

const addPost = async ({ body, userId, files }) => {
  try {
    let { text, Hashtags, community, mentions, scheduledAt, links, privacy } = body;
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
    if (error) return result(400, { message: error.details[0].message });

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
      if (!communityDoc) return result(404, { message: "Community not found." });
      if (!communityDoc.members.includes(userId)) {
        return result(403, { message: "Not a member of this community." });
      }
    }

    let uploadedMedia = [];
    const mediaFiles = files?.media || files?.image;
    const normalizedFiles = mediaFiles
      ? (Array.isArray(mediaFiles) ? mediaFiles : [mediaFiles])
      : [];

    if (normalizedFiles.length > 0) {
      uploadedMedia = await Promise.all(normalizedFiles.map(async (file) => {
        const uploaded = await uploadToCloudinary(file.buffer);
        const type = uploaded.resource_type === "video" ? "video" : "image";
        const isSensitive = type === "image"
          ? await checkImageSensitivity(uploaded.secure_url)
          : false;
        return {
          type,
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          thumbnail: type === "video" ? uploaded.secure_url.replace(/\.[^/.]+$/, ".jpg") : null,
          duration: uploaded.duration || 0,
          isSensitive
        };
      }));
    }

    const legacyPhotos = uploadedMedia.filter(media => media.type !== "video").map(media => ({
      url: media.url,
      publicId: media.publicId,
      isSensitive: media.isSensitive
    }));

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
      music: body.music || null,
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

    await updateUserPoints(userId, "CREATE_POST", post._id);
    await post.save();
    await post.populate(postPopulate);
    io.emit("post:create", post);
    return result(201, post);
  } catch (err) {
    return result(500, { message: err.message || "Internal Server Error" });
  }
};

const deletePost = async ({ id, user }) => {
  const post = await Post.findById(id);
  if (!post) return errorResult(404, "Post not found");
  if (post.owner.toString() !== user._id && !user.isAdmin) {
    return result(403, { message: "You are not authorized to delete this post" });
  }

  const idsToDelete = new Set();
  if (post.media) post.media.forEach(media => { if (media.publicId) idsToDelete.add(media.publicId); });
  if (post.Photos) post.Photos.forEach(photo => { if (photo.publicId) idsToDelete.add(photo.publicId); });
  for (const publicId of idsToDelete) {
    await cloudinary.uploader.destroy(publicId);
  }

  await Post.findByIdAndDelete(id);
  io.emit("post:delete", id);
  await updateUserPoints(post.owner, "DELETE_POST", post._id);
  return result(200, { message: "Post deleted" });
};

const hahaPost = async ({ id, userId }) => {
  const post = await Post.findById(id);
  if (!post) return errorResult(404, "Post not found");
  if (post.likes.includes(userId)) {
    return result(400, { message: "You can't hahed a post that has been liked" });
  }
  if (post.hahas.includes(userId)) {
    await Post.findByIdAndUpdate(id, { $pull: { hahas: userId } });
  } else {
    await Post.findByIdAndUpdate(id, { $push: { hahas: userId } });
    const postOwner = await User.findById(post.owner).select("BlockedNotificationFromUsers");
    if (
      !post.owner.equals(userId) &&
      !postOwner.BlockedNotificationFromUsers
        .map(blockedId => blockedId.toString())
        .includes(userId.toString())
    ) {
      await sendNotificationHelper({
        sender: userId,
        receiver: post.owner,
        content: "haha your post",
        type: "haha",
        actionRef: post._id,
        actionModel: "Post",
      });
    }
  }
  const updatedPost = await Post.findById(id).populate(postPopulate);
  io.emit("post:update", updatedPost);
  return result(200, updatedPost);
};

const likePost = async ({ id, userId }) => {
  const post = await Post.findById(id);
  if (!post) return errorResult(404, "Post not found");
  if (post.hahas.includes(userId)) {
    return result(400, { message: "You can't like a post that has been hahed" });
  }

  if (post.likes.includes(userId)) {
    await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
    await updateUserPoints(userId, "REMOVE_LIKE", post._id);
  } else {
    await Post.findByIdAndUpdate(id, { $push: { likes: userId } });
    const postOwner = await User.findById(post.owner).select("BlockedNotificationFromUsers");
    if (
      !post.owner.equals(userId) &&
      !postOwner.BlockedNotificationFromUsers
        .map(blockedId => blockedId.toString())
        .includes(userId.toString())
    ) {
      await sendNotificationHelper({
        sender: userId,
        receiver: post.owner,
        content: "liked your post",
        type: "like",
        actionRef: post._id,
        actionModel: "Post",
      });
    }
    await updateUserPoints(userId, "LIKE_POST", post._id);
  }

  const updatedPost = await Post.findById(id).populate(postPopulate);
  io.emit("post:update", updatedPost);
  return result(200, updatedPost);
};

const savePost = async ({ id, userId }) => {
  const post = await Post.findById(id);
  if (!post) return errorResult(404, "Post not found");
  if (post.saved.includes(userId)) {
    await Post.findByIdAndUpdate(id, { $pull: { saved: userId } });
  } else {
    await Post.findByIdAndUpdate(id, { $push: { saved: userId } });
  }
  const updatedPost = await Post.findById(id).populate(postPopulate);
  io.emit("post:update", updatedPost);
  return result(200, updatedPost);
};

const sharePost = async ({ id, userId, body }) => {
  const originalPost = await Post.findById(id).populate(
    "owner",
    "username profileName profilePhoto"
  );
  if (!originalPost) return result(404, { message: "Post not found" });
  const sharedPost = new Post({
    text: body.customText || "",
    owner: userId,
    Photos: originalPost.Photos,
    media: originalPost.media,
    links: originalPost.links,
    originalPost: originalPost._id,
    isShared: true,
  });
  const postOwner = await User.findById(originalPost.owner).select("BlockedNotificationFromUsers");
  if (
    !originalPost.owner.equals(userId) &&
    !postOwner.BlockedNotificationFromUsers
      .map(blockedId => blockedId.toString())
      .includes(userId.toString())
  ) {
    await sendNotificationHelper({
      sender: userId,
      receiver: originalPost.owner,
      content: "shared your post",
      type: "share",
      actionRef: sharedPost._id,
      actionModel: "Post",
    });
  }
  await sharedPost.save();
  await sharedPost.populate(postPopulate);
  await updateUserPoints(userId, "SHARE_POST", sharedPost._id);
  return result(201, sharedPost);
};

const editPost = async ({ id, body, files }) => {
  let { text, community, Hashtags, existingMedia, existingPhotos, mentions, links } = body;
  try {
    existingMedia = existingMedia ? JSON.parse(existingMedia) : [];
    if (existingMedia.length === 0 && existingPhotos) {
      const photos = JSON.parse(existingPhotos);
      existingMedia = photos.map(photo => ({ ...photo, type: "image" }));
    }
    Hashtags = Hashtags ? JSON.parse(Hashtags) : [];
    if (typeof mentions === "string") {
      try { mentions = JSON.parse(mentions); } catch { mentions = [mentions]; }
    } else if (!Array.isArray(mentions)) mentions = [];
    if (typeof links === "string") {
      try { links = JSON.parse(links); } catch { links = [links]; }
    } else if (!Array.isArray(links)) links = [];
  } catch (err) {
    return result(400, { message: "Invalid JSON in body fields" });
  }

  const post = await Post.findById(id);
  if (!post) return result(404, { message: "Post not found" });

  let newFiles = [];
  if (files?.newMedia) {
    newFiles = Array.isArray(files.newMedia) ? files.newMedia : [files.newMedia];
  } else if (files?.newPhotos) {
    newFiles = Array.isArray(files.newPhotos) ? files.newPhotos : [files.newPhotos];
  }
  if (!text && existingMedia.length === 0 && newFiles.length === 0) {
    return result(400, { message: "Post cannot be empty" });
  }

  const currentMedia = (post.media && post.media.length > 0)
    ? post.media
    : (post.Photos || []).map(photo => ({ ...photo.toObject(), type: "image" }));
  const keptPublicIds = new Set(existingMedia.map(media => media.publicId));
  const removedMedia = currentMedia.filter(media => !keptPublicIds.has(media.publicId));
  for (const item of removedMedia) {
    if (item.publicId) await cloudinary.uploader.destroy(item.publicId);
  }

  const newUploadedMedia = [];
  for (const file of newFiles) {
    const uploaded = await uploadToCloudinary(file.buffer);
    const type = uploaded.resource_type === "video" ? "video" : "image";
    const isSensitive = type === "image"
      ? await checkImageSensitivity(uploaded.secure_url)
      : false;
    newUploadedMedia.push({
      type,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      thumbnail: type === "video" ? uploaded.secure_url.replace(/\.[^/.]+$/, ".jpg") : null,
      duration: uploaded.duration || 0,
      isSensitive
    });
  }

  const finalMedia = [...existingMedia, ...newUploadedMedia];
  const finalPhotos = finalMedia.filter(media => media.type !== "video").map(media => ({
    url: media.url,
    publicId: media.publicId,
    isSensitive: media.isSensitive
  }));
  post.text = text ?? post.text;
  post.community = community || post.community;
  post.Hashtags = Hashtags;
  post.media = finalMedia;
  post.Photos = finalPhotos;
  post.mentions = mentions || post.mentions;
  post.links = links || post.links;
  post.music = body.music || post.music;
  await post.save();
  await post.populate(postPopulate);
  io.emit("post:update", post);
  return result(200, post);
};

const makeCommentsOff = async ({ id }) => {
  const post = await Post.findById(id);
  if (!post) return errorResult(404, "Post not found");
  post.isCommentOff = !post.isCommentOff;
  await post.save();
  const message = post.isCommentOff
    ? "Comments are now off for this post."
    : "Comments are now on for this post";
  const updatedPost = await Post.findById(id).populate(postPopulate);
  io.emit("post:update", updatedPost);
  return result(200, { message, post: updatedPost });
};

const viewPost = async ({ id, userId }) => {
  if (!mongoose.isValidObjectId(id)) return result(400, { message: "Invalid post ID" });

  const post = await Post.findById(id).select("owner").lean();
  if (!post) return result(404, { message: "Post not found" });

  let counted = false;
  if (post.owner.toString() !== userId.toString()) {
    const update = await Post.updateOne(
      { _id: post._id, views: { $ne: userId } },
      { $addToSet: { views: userId } }
    );
    counted = update.modifiedCount === 1;
  }

  const [view] = await Post.aggregate([
    { $match: { _id: post._id } },
    { $project: { _id: 1, viewsCount: { $size: { $ifNull: ["$views", []] } } } }
  ]);
  if (!view) return result(404, { message: "Post not found" });

  return result(200, { _id: view._id, viewsCount: view.viewsCount, counted });
};

const getPostsByUser = async ({ userId, query }) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const posts = await Post.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(postPopulate)
    .lean();
  const total = await Post.countDocuments({ owner: userId });
  return result(200, { posts, total, page, pages: Math.ceil(total / limit) });
};

const getMemories = async ({ userId }) => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const memories = await Post.find({
    owner: userId,
    status: "published",
    $expr: {
      $and: [
        { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
        { $eq: [{ $month: "$createdAt" }, month] },
        { $lt: [{ $year: "$createdAt" }, year] }
      ]
    }
  })
    .sort({ createdAt: -1 })
    .populate(postPopulate)
    .lean();
  return result(200, memories);
};

const getPostById = async ({ id }) => {
  const post = await Post.findById(id).populate(postPopulate);
  if (!post) return result(404, { message: "Post not found" });
  return result(200, post);
};

module.exports = {
  getAllPosts,
  getVideoPosts,
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
  getPostsByUser,
  getMemories
};
