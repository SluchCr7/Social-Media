// const asyncHandler= require('express-async-handler')
// const {Post, ValidatePost} = require('../Modules/Post')
// const fs = require('fs');
// const { v2 } = require('cloudinary');
// const {User} = require('../Modules/User')
// const {Community} = require('../Modules/Community'); // Import Community model
// const cloudinary = require('cloudinary').v2;


// const getAllPosts = asyncHandler(async (req, res) => {
//     const posts = await Post.find({})
//       .sort({ createdAt: -1 })
//       .populate('owner', 'username profileName profilePhoto')
//       .populate('community', 'Name Picture members')
//       .populate({
//         path: "reports",
//         populate: {
//           path: "owner",
//           model: "User",
//           select: "username profileName profilePhoto", // Optional: limit fields
//         },
//       })
//       .populate({
//         path: 'originalPost',
//         populate: {
//           path: 'owner',
//           select: 'username profileName profilePhoto'
//         }
//       })
//       .populate({
//         path: 'comments',
//         populate: {
//           path: 'owner',
//           select: 'username profileName profilePhoto'
//         }
//       })
//     res.status(200).json(posts);
//   });
  
// const addPost = async (req, res) => {
//   try {
//     let { text, Hashtags, community } = req.body;
//     const userId = req.user._id;

//     console.log("📥 Form Data:", { text, Hashtags, community });

//     // ✅ معالجة Hashtags: قد تكون string أو مصفوفة
//     if (typeof Hashtags === 'string') Hashtags = [Hashtags];
//     else if (!Array.isArray(Hashtags)) Hashtags = [];

//     // ✅ التحقق من صحة البيانات
//     const { error } = ValidatePost({ text, Hashtags, community });
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     // ✅ التحقق من المجتمع
//     let communityDoc = null;
//     if (community) {
//       communityDoc = await Community.findById(community);
//       if (!communityDoc) return res.status(404).json({ message: 'Community not found.' });
//       if (!communityDoc.members.includes(userId)) return res.status(403).json({ message: 'Not a member of this community.' });
//     }

//     // ✅ معالجة الصور
//     let uploadedImages = [];
//     let imagesArr = [];

//     if (Array.isArray(req.files?.image)) {
//       imagesArr = req.files.image;
//     } else if (req.files?.image) {
//       imagesArr = [req.files.image];
//     }

//     console.log("🖼 Received Images:", imagesArr.length);

//     if (imagesArr.length > 0) {
//       uploadedImages = await Promise.all(
//         imagesArr.map(async (img, i) => {
//           try {
//             console.log(`🔄 Uploading Image #${i + 1}:`, img.originalname);
//             const result = await cloudUpload(img);
//             console.log(`✅ Uploaded Image #${i + 1}:`, result.secure_url);
//             return {
//               url: result.secure_url,
//               publicId: result.public_id,
//             };
//           } catch (err) {
//             console.error(`❌ Failed to upload image #${i + 1}:`, err.message);
//             return null;
//           }
//         })
//       );

//       // حذف الصور التي فشل رفعها
//       uploadedImages = uploadedImages.filter(Boolean);
//     }

//     // ✅ إنشاء البوست
//     const post = new Post({
//       text,
//       Photos: uploadedImages,
//       Hashtags,
//       owner: userId,
//       community: communityDoc ? communityDoc._id : null,
//     });

//     // ✅ تحديث نقاط المستخدم
//     const user = await User.findById(userId);
//     user.userLevelPoints += 5;
//     user.updateLevelRank(); // تأكد أنها موجودة في الـ schema
//     await user.save();

//     await post.save();

//     console.log("✅ Post created:", post._id);
//     console.log("📸 Photos saved:", post.Photos);

//     return res.status(201).json(post);
//   } catch (err) {
//     console.error("❌ Error in addPost:", err.message, err.stack);
//     return res.status(500).json({ message: err.message || 'Internal Server Error' });
//   }
// };


// const deletePost = asyncHandler(async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     if (!post) {
//         res.status(404)
//         throw new Error('Post not found')
//     }
//     await post.remove()
//     res.status(200).json({ message: 'Post deleted' })
// })

// const getPostById = asyncHandler(async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     if (!post) {
//         res.status(404)
//         throw new Error('Post not found')
//     }
//     res.status(200).json(post)
// })

// const likePost = asyncHandler(async (req, res) => {
//     let post = await Post.findById(req.params.id)
//     if (!post) {
//         res.status(404)
//         throw new Error('Post not found')
//     }
//     if(post.likes.includes(req.user._id)){
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $pull: { likes: req.user._id },
//         }, { new: true })
//         res.status(200).json({message : "Post Unliked"})
//     }else{
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $push: { likes: req.user._id },
//         }, { new: true })
//         res.status(200).json({message : "Post Liked"})
//     }

//     // res.status(200).json(post)
// })

// // const lovePost = asyncHandler(async (req, res) => {
// //     const post = await Post.findById(req.params.id)
// //     if (!post) {
// //         res.status(404)
// //         throw new Error('Post not found')
// //     }
// //     if(post.loves.includes(req.user._id)){
// //         post = await Post.findByIdAndUpdate(req.params.id, {
// //             $pull: { loves: req.user._id },
// //         } , {new : true})
// //     }else{
// //         post = await Post.findByIdAndUpdate(req.params.id, {
// //             $push: { loves: req.user._id },
// //         } , {new : true})
// //     }
// //     res.status(200).json(post)
// // })

// const savePost = asyncHandler(async (req, res) => {
//     let post = await Post.findById(req.params.id)
//     if (!post) {
//         res.status(404)
//         throw new Error('Post not found')
//     }
//     if(post.saved.includes(req.user._id)){
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $pull: { saved: req.user._id },
//         } , {new : true})
//     }else{
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $push: { saved: req.user._id },
//         } , {new : true})
//     }
//     res.status(200).json(post)
// })

// // const hahaPost = asyncHandler(async (req, res) => {
// //     const post = await Post.findById(req.params.id)
// //     if (!post) {
// //         res.status(404)
// //         throw new Error('Post not found')
// //     }
// //     if(post.hahas.includes(req.user._id)){
// //         post = await Post.findByIdAndUpdate(req.params.id, {
// //             $pull: { hahas: req.user._id },
// //         } , {new : true})
// //     }else{
// //         post = await Post.findByIdAndUpdate(req.params.id, {
// //             $push: { hahas: req.user._id },
// //         } , {new : true})
// //     }
// //     res.status(200).json(post)
// // })

// const sharePost = asyncHandler(async (req, res) => {
//     const originalPost = await Post.findById(req.params.id).populate('owner', 'username profileName profilePhoto');
  
//     if (!originalPost) {
//       res.status(404);
//       throw new Error('Post not found');
//     }
  
//     const { customText } = req.body;
  
//     // Create a new shared post
//     const sharedPost = new Post({
//       text: customText || "",
//       owner: req.user._id,
//       Photos: originalPost.Photos,
//       originalPost: originalPost._id,
//       isShared: true,
//     });
  
//     await sharedPost.save();
//     await sharedPost.populate('owner', 'username email profileName profilePhoto');
  
//     res.status(201).json({
//       _id: sharedPost._id,
//       text: sharedPost.text,
//       owner: sharedPost.owner,
//       Photos: sharedPost.Photos,
//       originalPost: {
//         _id: originalPost._id,
//         text: originalPost.text,
//         Photos: originalPost.Photos,
//         owner: originalPost.owner,
//       },
//     });
//   });
  
// const editPost = asyncHandler(async (req, res) => {
//   // ✅ لا تفكك مباشرة – استخرج يدويًا
//   let text = req.body.text;
//   let community = req.body.community;
//   let Hashtags = req.body.Hashtags;
//   let existingPhotos = req.body.existingPhotos;

//   // ✅ تأكد من وجود البيانات
//   if (!text) return res.status(400).json({ message: 'Text is required' });

//   // ✅ Parse JSON fields
//   try {
//     existingPhotos = existingPhotos ? JSON.parse(existingPhotos) : [];
//     Hashtags = Hashtags ? JSON.parse(Hashtags) : [];
//   } catch (err) {
//     return res.status(400).json({ message: 'Invalid JSON in existingPhotos or Hashtags' });
//   }

//   // Validate
//   const { error } = ValidatePost({ text, community, Hashtags });
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   const post = await Post.findById(req.params.id);
//   if (!post) {
//     return res.status(404).json({ message: 'Post not found' });
//   }

//   // حذف الصور التي تم إزالتها
//   const removedPhotos = post.Photos.filter(
//     img => !existingPhotos.some(existing => existing.public_id === img.public_id)
//   );
//   for (const photo of removedPhotos) {
//     if (photo.public_id) {
//       await cloudinary.uploader.destroy(photo.public_id);
//     }
//   }

//   // رفع الصور الجديدة
//   const newUploadedPhotos = [];
//   const newFiles = req.files || [];
//   for (const file of newFiles) {
//     const result = await cloudinary.uploader.upload(file.path, {
//       folder: 'posts',
//     });
//     newUploadedPhotos.push({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//     fs.unlinkSync(file.path);
//   }

//   // التحديث
//   post.text = text;
//   post.community = community || null;
//   post.Hashtags = Hashtags;
//   post.Photos = [...existingPhotos, ...newUploadedPhotos];

//   await post.save();

//   res.status(200).json({ message: 'Post updated successfully', post });
// });


// const makeCommentsOff = asyncHandler(async (req, res) => {
//   const post = await Post.findById(req.params.id);
  
//   if (!post) {
//     res.status(404);
//     throw new Error('Post not found');
//   }

//   post.isCommentOff = !post.isCommentOff;
//   await post.save();

//   const message = post.isCommentOff
//     ? 'Comments are now off for this post.'
//     : 'Comments are now on for this post';

//   res.status(200).json({message : message});
// });


// module.exports = {getAllPosts ,makeCommentsOff, addPost , deletePost , getPostById , likePost , savePost , sharePost , editPost}

const asyncHandler = require("express-async-handler");
const { Post, ValidatePost } = require("../Modules/Post");
const fs = require("fs");
const { User } = require("../Modules/User");
const { Community } = require("../Modules/Community");
const cloudinary = require("cloudinary").v2;

// 🔔 Socket.io & Notifications
const { getReceiverSocketId, io } = require("../Config/socket");
const { Notification } = require("../Modules/Notification");

// ================== Get All Posts ==================
const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username profileName profilePhoto")
    .populate("community", "Name Picture members")
    .populate({
      path: "reports",
      populate: { path: "owner", model: "User", select: "username profileName profilePhoto" },
    })
    .populate("mentions", "username profileName profilePhoto")
    .populate({
      path: "originalPost",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    })
    .populate({
      path: "comments",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    })
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
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "posts" },
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
    let { text, Hashtags, community, mentions } = req.body;
    const userId = req.user._id;

    if (typeof Hashtags === "string") Hashtags = [Hashtags];
    else if (!Array.isArray(Hashtags)) Hashtags = [];

    // ✅ mentions: خليها Array من userIds
    if (typeof mentions === "string") {
      try {
        mentions = JSON.parse(mentions); // لو جايه كـ JSON string
      } catch {
        mentions = [mentions]; // أو مجرد string واحد
      }
    } else if (!Array.isArray(mentions)) {
      mentions = [];
    }

    const { error } = ValidatePost({ text, Hashtags, community, mentions });
    if (error) return res.status(400).json({ message: error.details[0].message });

    let communityDoc = null;
    if (community) {
      communityDoc = await Community.findById(community);
      if (!communityDoc) return res.status(404).json({ message: "Community not found." });
      if (!communityDoc.members.includes(userId))
        return res.status(403).json({ message: "Not a member of this community." });
    }

    let uploadedImages = [];
    let imagesArr = [];

    if (Array.isArray(req.files?.image)) imagesArr = req.files.image;
    else if (req.files?.image) imagesArr = [req.files.image];

    if (imagesArr.length > 0) {
      uploadedImages = await Promise.all(
        imagesArr.map(async (img) => {
          const result = await uploadToCloudinary(img.buffer);
          return { url: result.secure_url, publicId: result.public_id };
        })
      );
    }

    const post = new Post({
      text,
      Photos: uploadedImages,
      Hashtags,
      mentions, // ✅ هنا هتتحفظ الـ mentions
      owner: userId,
      community: communityDoc ? communityDoc._id : null,
    });

    // ✨ ممكن كمان تبعت إشعارات لكل mentioned users
    if (mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        if (mentionedUserId.toString() !== userId.toString()) {
          const newNotify = new Notification({
            content: "mentioned you in a post",
            type: "mention",
            sender: userId,
            receiver: mentionedUserId,
            actionRef: post._id,
            actionModel: "Post",
          });
          await newNotify.save();

          const receiverSocketId = getReceiverSocketId(mentionedUserId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("notification", newNotify);
          }
        }
      }
    }

    const user = await User.findById(userId);
    user.userLevelPoints += 5;
    user.updateLevelRank();
    await user.save();

    await post.save();
    await post.populate([
      { path: "owner", select: "username profileName profilePhoto" },
      { path: "community", select: "Name Picture members" },
      { path: "mentions", select: "username profileName profilePhoto" }, // ✅ populate للمنشن
    ]);
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};


// ================== Delete Post ==================
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // حذف صور Cloudinary
  for (const photo of post.Photos) {
    if (photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }
  }

  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Post deleted" });
});

// ================== Get Post By ID ==================
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("owner", "username profilePhoto");
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.status(200).json(post);
});

// ================== Like Post ==================
const likePost = asyncHandler(async (req, res) => {
  // جلب البوست الأساسي
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
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

    // إنشاء إشعار لصاحب البوست
// ✅ إرسال إشعار فقط إذا اللايك ليس على بوستك
    if (!post.owner.equals(req.user._id)) {
      const newNotify = new Notification({
        content: "liked your post",
        type: "like",
        sender: req.user._id,
        receiver: post.owner,
        actionRef: post._id,
        actionModel: "Post",
      });
      await newNotify.save();

      // إرسال الإشعار عبر السوكيت إذا كان متصل
      const receiverSocketId = getReceiverSocketId(post.owner);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", newNotify);
      }
    }
  }

  // جلب البوست كامل بعد التعديل مع كل populate
  const updatedPost = await Post.findById(req.params.id)
    .populate("owner", "username profileName profilePhoto")
    .populate("community", "Name Picture members")
    .populate({
      path: "originalPost",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    })
    .populate({
      path: "comments",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    });

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
    .populate("owner", "username profileName profilePhoto")
    .populate("community", "Name Picture members")
    .populate({
      path: "originalPost",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    })
    .populate({
      path: "comments",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    });

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
    originalPost: originalPost._id,
    isShared: true,
  });

  await sharedPost.save();
  await sharedPost.populate([
    { path: "owner", select: "username profileName profilePhoto" },
    {
      path: "originalPost",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    },
  ]);

  // ✅ رجع بوست كامل فقط
  res.status(201).json(sharedPost);
});


// ================== Edit Post ==================
const editPost = asyncHandler(async (req, res) => {
  let { text, community, Hashtags, existingPhotos, mentions } = req.body;

  try {
    existingPhotos = existingPhotos ? JSON.parse(existingPhotos) : [];
    Hashtags = Hashtags ? JSON.parse(Hashtags) : [];

    // ✅ Parse mentions لو جايه كـ string
    if (typeof mentions === "string") {
      try {
        mentions = JSON.parse(mentions);
      } catch {
        mentions = [mentions];
      }
    } else if (!Array.isArray(mentions)) {
      mentions = [];
    }

  } catch (err) {
    return res.status(400).json({ message: "Invalid JSON in body fields" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const newFiles = req.files?.newPhotos
    ? Array.isArray(req.files.newPhotos) ? req.files.newPhotos : [req.files.newPhotos]
    : [];

  if (!text && existingPhotos.length === 0 && newFiles.length === 0) {
    return res.status(400).json({ message: "Post cannot be empty" });
  }

  // ✅ احذف الصور اللي اتشالت
  const removedPhotos = post.Photos.filter(
    (img) => !existingPhotos.some((existing) => existing.publicId === img.publicId)
  );
  for (const photo of removedPhotos) {
    if (photo.publicId) await cloudinary.uploader.destroy(photo.publicId);
  }

  // ✅ ارفع الصور الجديدة
  const newUploadedPhotos = [];
  for (const file of newFiles) {
    const result = await uploadToCloudinary(file.buffer);
    newUploadedPhotos.push({ url: result.secure_url, publicId: result.public_id });
  }

  // ✅ حدّث الداتا
  post.text = text ?? post.text;
  post.community = community || post.community;
  post.Hashtags = Hashtags;
  post.Photos = [...existingPhotos, ...newUploadedPhotos];
  post.mentions = mentions || post.mentions; // 🎯 تحديث mentions

  await post.save();

  // ✅ populate كامل زي getAllPosts
  await post.populate([
    { path: "owner", select: "username profileName profilePhoto" },
    { path: "community", select: "Name Picture members" },
    { path: "originalPost", populate: { path: "owner", select: "username profileName profilePhoto" }},
    { path: "comments", populate: { path: "owner", select: "username profileName profilePhoto" }},
    { path: "mentions", select: "username profileName profilePhoto" }, // 🎯 populate للمنشن
  ]);

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

  res.status(200).json({ message });
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
  )
    .populate('owner', 'username profilePhoto')
    .populate('community', 'Name Picture')
    .populate('views', 'username profilePhoto') // المستخدمين الذين شاهدوا البوست
    .populate({
      path: "originalPost",
      populate: { path: "owner", select: "username profileName profilePhoto" },
    })
  res.status(200).json({
    post: updatedPost
  });
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
  viewPost
};
