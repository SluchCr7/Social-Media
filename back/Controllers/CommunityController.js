const { Community, ValidateCommunity, ValidateCommunityUpdate } = require('../Modules/Community')
const asyncHandler = require('express-async-handler')
const path = require('path')
const { cloudUpload, cloudRemove } = require('../Config/cloudUpload')
const fs = require('fs')
const { v2 } = require('cloudinary')

const getAllCommunities = asyncHandler(async (req, res) => {
    const communities = await Community.find({}).populate('owner', 'username profileName profilePhoto')
        .populate('members', 'username profileName profilePhoto')
        .populate('Admins', 'username profileName profilePhoto')
    res.status(200).json(communities)
})

const getCommunityByCategory = asyncHandler(async (req, res) => {
    const communities = await Community.find({ Category: req.params.Category })
    res.status(200).json(communities)
})

const addNewCommunity = asyncHandler(async (req, res) => {
    const { error } = ValidateCommunity(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const community = new Community({
        Name: req.body.Name,
        Category: req.body.Category,
        description: req.body.description,
        owner: req.user._id,
    })
    await community.save()
    res.status(201).json(community)
})

const deleteCommunity = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.id)
    if (!community) {
        res.status(404)
        throw new Error('Community not found')
    }
    await community.remove()
    res.status(200).json({ message: 'Community removed' })
})

const joinTheCommunity = asyncHandler(async (req, res) => {
    let community = await Community.findById(req.params.id);
    if (!community) {
      res.status(404);
      throw new Error('Community not found');
    }
  
    // ✅ تحقق إذا كان المستخدم هو المالك
    if (community.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Owner can't join or leave their own community" });
    }
  
    if (community.members.includes(req.user._id)) {
      community = await Community.findByIdAndUpdate(
        req.params.id,
        { $pull: { members: req.user._id } },
        { new: true }
      );
      res.status(200).json({ message: "Community Left" });
    } else {
      community = await Community.findByIdAndUpdate(
        req.params.id,
        { $push: { members: req.user._id } },
        { new: true }
      );
      res.status(200).json({ message: "Community Joined" });
    }
  });
  
const editCommunity = asyncHandler(async(req,res)=>{
    const { error } = ValidateCommunityUpdate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const community = await Community.findByIdAndUpdate(req.params.id, {
        $set: {
            Name: req.body.Name,
            Category: req.body.Category,
            description: req.body.description,
        }
    }, { new: true })
    res.status(200).json(community)
})

/**
 * @desc update Community Photo
 * @route PUT /api/community/photo
 * @access private
 */

const updateCommunityPicture = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudUpload(imagePath);

    if (community.Picture.publicId) {
      await cloudRemove(community.Picture.publicId);
    }

    community.Picture = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await community.save();
    fs.unlinkSync(imagePath);

    res.status(200).json({
      message: "Community picture updated successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal server error during image update." });
  }
});


/**
 * @desc update Community Cover
 * @route PUT /api/community/Cover
 * @access private
 */

const updateCommunityCover = asyncHandler(async (req, res) => {
    const { id } = req.params; // community ID
    const community = await Community.findById(id);
    if (!community) {
        return res.status(404).json({ message: "Community not found" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudUpload(imagePath);

    // Remove old cover image if exists
    if (community.Cover.publicId) {
        await cloudRemove(community.Cover.publicId);
    }

    community.Cover = {
        url: result.secure_url,
        publicId: result.public_id,
    };

    await community.save();
    fs.unlinkSync(imagePath); // remove local file

    res.status(200).json({
        message: "Community cover updated successfully",
        url: result.secure_url,
        publicId: result.public_id,
    });
});



/**
 * @desc Remove a member from community by owner
 * @route PUT /api/community/remove/:communityId/:userId
 * @access Private (Owner only)
 */

const removeMember = asyncHandler(async (req, res) => {
    const { communityId, userId } = req.params;
    const user = req.user; 

    const community = await Community.findById(communityId);
    if (!community) {
        return res.status(404).json({ message: "Community not found" });
    }

    
    if (community.owner.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Only the community owner can remove members" });
    }

    if (!community.members.includes(userId)) {
        return res.status(400).json({ message: "User is not a member of the community" });
    }

    
    await Community.findByIdAndUpdate(communityId, {
        $pull: { members: userId },
    });

    res.status(200).json({ message: "Member removed successfully" });
});

/**
 * @desc Make User Admin
 * @route PUT /api/community/admin/:id
 * @access private
 */

// Toggle Admin status
const makeAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params; // community ID
    const { userIdToMakeAdmin } = req.body;
  
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
  
    // فقط المالك أو الأدمنز يمكنهم التحكم
    const isRequesterOwner = community.owner.equals(req.user._id);
    const isRequesterAdmin = community.Admins.includes(req.user._id);
  
    if (!isRequesterOwner && !isRequesterAdmin) {
      return res.status(403).json({ message: "Only community owner or admins can manage admins" });
    }
  
    if (!community.members.includes(userIdToMakeAdmin)) {
      return res.status(400).json({ message: "User is not a member of the community" });
    }
  
    const isAlreadyAdmin = community.Admins.includes(userIdToMakeAdmin);
  
    if (isAlreadyAdmin) {
      // إزالة الأدمن
      community.Admins.pull(userIdToMakeAdmin);
      await community.save();
      return res.status(200).json({ message: "Admin removed successfully" });
    } else {
      // تعيينه كأدمن
      community.Admins.push(userIdToMakeAdmin);
      await community.save();
      return res.status(200).json({ message: "Admin added successfully" });
    }
  });
  


// const makeAdmin = asyncHandler(async (req, res) => {
//     const { id } = req.params; // community ID
//     const { userIdToMakeAdmin } = req.body; // ID of user to promote
//     const community = await Community.findById(id);

//     if (!community) {
//         return res.status(404).json({ message: "Community not found" });
//     }

//     // Only owner can add admins
//     if (!community.owner.equals(req.user._id)) {
//         return res.status(403).json({ message: "Only the community owner can assign admins" });
//     }

//     // Check if user is already an admin
//     if (community.Admins.includes(userIdToMakeAdmin)) {
//         return res.status(400).json({ message: "User is already an admin" });
//     }

//     community.Admins.push(userIdToMakeAdmin);
//     await community.save();

//     res.status(200).json({ message: "Admin added successfully" });
// });


module.exports = {
    getAllCommunities,
    getCommunityByCategory,
    addNewCommunity,
    deleteCommunity,
    joinTheCommunity,
    editCommunity, updateCommunityPicture, updateCommunityCover,
    removeMember, makeAdmin
}
