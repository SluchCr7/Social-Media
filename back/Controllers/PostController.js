const asyncHandler= require('express-async-handler')
const {Post, ValidatePost} = require('../Modules/Post')
const fs = require('fs');
const { v2 } = require('cloudinary');
const {User} = require('../Modules/User')
const {Community} = require('../Modules/Community'); // Import Community model


const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('owner', 'username profileName profilePhoto')
      .populate('community', 'Name Picture members')
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
      .populate({
          path: 'comments',
          populate: {
            path: 'replies',
            populate: {
              path: 'owner',
              select: 'username profileName profilePhoto'
            }
          }
      })
      .populate({
          path: 'comments',
          populate: {
            path: 'replies',
            populate: {
              path: 'repliesForward',
              populate: {
                path: 'owner',
                select: 'username profileName profilePhoto'
              }
            }
          }
      })
    res.status(200).json(posts);
  });
  
const addPost = async (req, res) => {
    try {
      const { text, Hashtags, community } = req.body;
      const userId = req.user._id;
  
      // ✅ Validate the post body
      const { error } = ValidatePost(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      // ✅ Validate community if provided
      let communityDoc = null;
      if (community) {
        communityDoc = await Community.findById(community);
        if (!communityDoc) {
          return res.status(404).json({ message: "Community not found." });
        }
  
        // Optional: check if user is a member
        if (!communityDoc.members.includes(userId)) {
          return res.status(403).json({ message: "You are not a member of this community." });
        }
      }
  
      // ✅ Handle optional image upload
      let uploadedImages = [];
      if (req.files && req.files.image) {
        let images = req.files.image;
        if (!Array.isArray(images)) {
          images = [images];
        }
  
        uploadedImages = await Promise.all(
          images.map(async (image) => {
            const result = await v2.uploader.upload(image.path, { resource_type: "image" });
            fs.unlinkSync(image.path);
            return { url: result.secure_url, publicId: result.public_id };
          })
        );
      }
  
      // ✅ Create and save post
      const post = new Post({
        text,
        owner: userId,
        Photos: uploadedImages,
        Hashtags,
        community: communityDoc ? communityDoc._id : null
      });
  
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error("Error in addPost:", error);
      res.status(500).json({ message: error.message });
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
    const post = await Post.findById(req.params.id)
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
    const post = await Post.findById(req.params.id)
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
    const { error } = ValidatePost(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            text : req.body.text
        }
    },{new : true})
    res.status(200).json({message : "Post Updated Successfully"})
})


module.exports = {getAllPosts , addPost , deletePost , getPostById , likePost , savePost , sharePost , editPost}