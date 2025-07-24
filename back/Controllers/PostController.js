const asyncHandler= require('express-async-handler')
const {Post, ValidatePost} = require('../Modules/Post')
const fs = require('fs');
const { v2 } = require('cloudinary');
const {User} = require('../Modules/User')
const {Community} = require('../Modules/Community'); // Import Community model
const cloudinary = require('cloudinary').v2;


const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('owner', 'username profileName profilePhoto')
      .populate('community', 'Name Picture members')
      .populate({
        path: "reports",
        populate: {
          path: "owner",
          model: "User",
          select: "username profileName profilePhoto", // Optional: limit fields
        },
      })
      .populate({
        path: 'originalPost',
        populate: {
          path: 'owner',
          select: 'username profileName profilePhoto'
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'owner',
          select: 'username profileName profilePhoto'
        }
      })
    res.status(200).json(posts);
  });
  
const addPost = async (req, res) => {
  try {
    let { text, Hashtags, community } = req.body;
    const userId = req.user._id;

    console.log("📥 Form Data:", { text, Hashtags, community });

    // ✅ معالجة Hashtags: قد تكون string أو مصفوفة
    if (typeof Hashtags === 'string') Hashtags = [Hashtags];
    else if (!Array.isArray(Hashtags)) Hashtags = [];

    // ✅ التحقق من صحة البيانات
    const { error } = ValidatePost({ text, Hashtags, community });
    if (error) return res.status(400).json({ message: error.details[0].message });

    // ✅ التحقق من المجتمع
    let communityDoc = null;
    if (community) {
      communityDoc = await Community.findById(community);
      if (!communityDoc) return res.status(404).json({ message: 'Community not found.' });
      if (!communityDoc.members.includes(userId)) return res.status(403).json({ message: 'Not a member of this community.' });
    }

    // ✅ معالجة الصور
    let uploadedImages = [];
    let imagesArr = [];

    if (Array.isArray(req.files?.image)) {
      imagesArr = req.files.image;
    } else if (req.files?.image) {
      imagesArr = [req.files.image];
    }

    console.log("🖼 Received Images:", imagesArr.length);

    if (imagesArr.length > 0) {
      uploadedImages = await Promise.all(
        imagesArr.map(async (img, i) => {
          try {
            console.log(`🔄 Uploading Image #${i + 1}:`, img.originalname);
            const result = await cloudUpload(img);
            console.log(`✅ Uploaded Image #${i + 1}:`, result.secure_url);
            return {
              url: result.secure_url,
              publicId: result.public_id,
            };
          } catch (err) {
            console.error(`❌ Failed to upload image #${i + 1}:`, err.message);
            return null;
          }
        })
      );

      // حذف الصور التي فشل رفعها
      uploadedImages = uploadedImages.filter(Boolean);
    }

    // ✅ إنشاء البوست
    const post = new Post({
      text,
      Photos: uploadedImages,
      Hashtags,
      owner: userId,
      community: communityDoc ? communityDoc._id : null,
    });

    // ✅ تحديث نقاط المستخدم
    const user = await User.findById(userId);
    user.userLevelPoints += 5;
    user.updateLevelRank(); // تأكد أنها موجودة في الـ schema
    await user.save();

    await post.save();

    console.log("✅ Post created:", post._id);
    console.log("📸 Photos saved:", post.Photos);

    return res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error in addPost:", err.message, err.stack);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};


const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    await post.remove()
    res.status(200).json({ message: 'Post deleted' })
})

const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    res.status(200).json(post)
})

const likePost = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    if(post.likes.includes(req.user._id)){
        post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Post Unliked"})
    }else{
        post = await Post.findByIdAndUpdate(req.params.id, {
            $push: { likes: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Post Liked"})
    }

    // res.status(200).json(post)
})

// const lovePost = asyncHandler(async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     if (!post) {
//         res.status(404)
//         throw new Error('Post not found')
//     }
//     if(post.loves.includes(req.user._id)){
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $pull: { loves: req.user._id },
//         } , {new : true}) 
//     }else{
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $push: { loves: req.user._id },
//         } , {new : true}) 
//     }
//     res.status(200).json(post)
// })

const savePost = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    if(post.saved.includes(req.user._id)){
        post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { saved: req.user._id },
        } , {new : true}) 
    }else{
        post = await Post.findByIdAndUpdate(req.params.id, {
            $push: { saved: req.user._id },
        } , {new : true}) 
    }
    res.status(200).json(post)
})  

// const hahaPost = asyncHandler(async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     if (!post) {
//         res.status(404)
//         throw new Error('Post not found')
//     }
//     if(post.hahas.includes(req.user._id)){
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $pull: { hahas: req.user._id },
//         } , {new : true}) 
//     }else{
//         post = await Post.findByIdAndUpdate(req.params.id, {
//             $push: { hahas: req.user._id },
//         } , {new : true}) 
//     }
//     res.status(200).json(post)
// })

const sharePost = asyncHandler(async (req, res) => {
    const originalPost = await Post.findById(req.params.id).populate('owner', 'username profileName profilePhoto');
  
    if (!originalPost) {
      res.status(404);
      throw new Error('Post not found');
    }
  
    const { customText } = req.body;
  
    // Create a new shared post
    const sharedPost = new Post({
      text: customText || "",
      owner: req.user._id,
      Photos: originalPost.Photos,
      originalPost: originalPost._id,
      isShared: true,
    });
  
    await sharedPost.save();
    await sharedPost.populate('owner', 'username email profileName profilePhoto');
  
    res.status(201).json({
      _id: sharedPost._id,
      text: sharedPost.text,
      owner: sharedPost.owner,
      Photos: sharedPost.Photos,
      originalPost: {
        _id: originalPost._id,
        text: originalPost.text,
        Photos: originalPost.Photos,
        owner: originalPost.owner,
      },
    });
  });
  
const editPost = asyncHandler(async (req, res) => {
  // ✅ لا تفكك مباشرة – استخرج يدويًا
  let text = req.body.text;
  let community = req.body.community;
  let Hashtags = req.body.Hashtags;
  let existingPhotos = req.body.existingPhotos;

  // ✅ تأكد من وجود البيانات
  if (!text) return res.status(400).json({ message: 'Text is required' });

  // ✅ Parse JSON fields
  try {
    existingPhotos = existingPhotos ? JSON.parse(existingPhotos) : [];
    Hashtags = Hashtags ? JSON.parse(Hashtags) : [];
  } catch (err) {
    return res.status(400).json({ message: 'Invalid JSON in existingPhotos or Hashtags' });
  }

  // Validate
  const { error } = ValidatePost({ text, community, Hashtags });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // حذف الصور التي تم إزالتها
  const removedPhotos = post.Photos.filter(
    img => !existingPhotos.some(existing => existing.public_id === img.public_id)
  );
  for (const photo of removedPhotos) {
    if (photo.public_id) {
      await cloudinary.uploader.destroy(photo.public_id);
    }
  }

  // رفع الصور الجديدة
  const newUploadedPhotos = [];
  const newFiles = req.files || [];
  for (const file of newFiles) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'posts',
    });
    newUploadedPhotos.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
    fs.unlinkSync(file.path);
  }

  // التحديث
  post.text = text;
  post.community = community || null;
  post.Hashtags = Hashtags;
  post.Photos = [...existingPhotos, ...newUploadedPhotos];

  await post.save();

  res.status(200).json({ message: 'Post updated successfully', post });
});


const makeCommentsOff = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.isCommentOff = !post.isCommentOff;
  await post.save();

  const message = post.isCommentOff
    ? 'Comments are now off for this post.'
    : 'Comments are now on for this post';

  res.status(200).json({message : message});
});


module.exports = {getAllPosts ,makeCommentsOff, addPost , deletePost , getPostById , likePost , savePost , sharePost , editPost}