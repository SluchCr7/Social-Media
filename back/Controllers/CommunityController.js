const { Community, ValidateCommunity, ValidateCommunityUpdate } = require('../Modules/Community')
const asyncHandler = require('express-async-handler')
const path = require('path')
const { cloudUpload, cloudRemove } = require('../Config/cloudUpload')
const fs = require('fs')
const { v2 } = require('cloudinary')
const { User} = require('../Modules/User')

const getAllCommunities = asyncHandler(async (req, res) => {
    const communities = await Community.find({}).populate('owner', 'username profileName profilePhoto')
        .populate('members', 'username profileName profilePhoto')
        .populate('Admins', 'username profileName profilePhoto')
        .populate('joinRequests' , 'username profileName profilePhoto')
    res.status(200).json(communities)
})
  const getCommunityById = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.id)
      .populate('owner', 'username profileName profilePhoto')
      .populate('members', 'username profileName profilePhoto')
      .populate('Admins', 'username profileName profilePhoto')
      .populate('joinRequests' , 'username profileName profilePhoto')
    if (!community) {
      return res.status(404).json({ message: "Community Not Found" });
    }

    res.status(200).json(community);
  });
const getCommunityByCategory = asyncHandler(async (req, res) => {
  const communities = await Community.find({ Category: req.params.Category })
      .populate('owner', 'username profileName profilePhoto')
      .populate('members', 'username profileName profilePhoto')
      .populate('Admins', 'username profileName profilePhoto')
      .populate('joinRequests' , 'username profileName profilePhoto')
    res.status(200).json(communities)
})

const addNewCommunity = asyncHandler(async (req, res) => {
  const { error } = ValidateCommunity(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { Name, Category, description, tags = [], rules = [], isPrivate = false, isForAdults = false } = req.body;

  const community = new Community({
    Name,
    Category,
    description,
    owner: req.user._id,
    members: [req.user._id],
    tags,
    rules,
    isPrivate,
    isForAdults,
  });

  // تحديث نقاط المستخدم قبل حفظ الـ community
  const user = await User.findById(req.user._id);
  user.userLevelPoints += 15;
  user.updateLevelRank();
  await user.save();

  // حفظ الـ community
  await community.save();

  // ✅ populate البيانات المهمة قبل الإرسال
  await community.populate([
    { path: 'owner', select: 'username profileName profilePhoto' },
    { path: 'members', select: 'username profileName profilePhoto' }
  ]);

  res.status(201).json({
    message: 'Community created successfully',
    community
  });
});

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
    ).populate("owner members Admins joinRequests", "username profileName profilePhoto");

    res.status(200).json({ message: "Community Left", community });
    } else {
      community = await Community.findByIdAndUpdate(
        req.params.id,
        { $push: { members: req.user._id } },
        { new: true }
      ).populate("owner members Admins joinRequests", "username profileName profilePhoto");

      res.status(200).json({ message: "Community Joined", community });
    }

});
  
const editCommunity = asyncHandler(async (req, res) => {
    const { error } = ValidateCommunityUpdate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateData = {
        ...(req.body.Name && { Name: req.body.Name }),
        ...(req.body.Category && { Category: req.body.Category }),
        ...(req.body.description && { description: req.body.description }),
        ...(typeof req.body.isPrivate === "boolean" && { isPrivate: req.body.isPrivate }),
        ...(typeof req.body.isForAdults === "boolean" && { isForAdults: req.body.isForAdults }),
        ...(req.body.tags && { tags: req.body.tags }),
        ...(req.body.rules && { rules: req.body.rules })
    };

    const community = await Community.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
    ).populate("owner members Admins joinRequests", "username profileName profilePhoto");

    if (!community) {
        return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({ message: "Community updated successfully", community });
});

// const editCommunity = asyncHandler(async(req,res)=>{
//     const { error } = ValidateCommunityUpdate(req.body)
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }
//     const community = await Community.findByIdAndUpdate(req.params.id, {
//         $set: {
//             Name: req.body.Name,
//             Category: req.body.Category,
//         description: req.body.description,
//             isPrivate: req.body.isPrivate
//         }
//     }, { new: true })
//     res.status(200).json(community)
// })

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

    // ✅ مرر req.file مباشرة وليس مسار
    const result = await cloudUpload(req.file);

    // ✅ احذف الصورة القديمة إن وجدت
    if (community.Picture?.publicId) {
      await cloudRemove(community.Picture.publicId);
    }

    community.Picture = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await community.save();

    return res.status(200).json({
      message: "Community picture updated successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error during image update.", error: error.message });
  }
});



/**
 * @desc update Community Cover
 * @route PUT /api/community/Cover
 * @access private
 */

const updateCommunityCover = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ ارفع الصورة من الميموري مباشرة
    const result = await cloudUpload(req.file);

    // ✅ احذف الغلاف القديم إن وجد
    if (community.Cover?.publicId) {
      await cloudRemove(community.Cover.publicId);
    }

    // ✅ حدث الغلاف الجديد
    community.Cover = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await community.save();

    return res.status(200).json({
      message: "Community cover updated successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error during cover update.", error: error.message });
  }
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
  

/**
 * @desc Send join request to a community
 * @route POST /api/community/join-request/:id
 * @access Private
 */
const sendJoinRequest = asyncHandler(async (req, res) => {
  const { id } = req.params; // communityId
  const userId = req.user._id;

  const community = await Community.findById(id);
  if (!community) {
    return res.status(404).json({ message: "Community not found" });
  }

  if (!community.isPrivate) {
    return res.status(400).json({ message: "Community is public, join directly" });
  }

  if (community.members.includes(userId)) {
    return res.status(400).json({ message: "You are already a member of this community" });
  }

  if (community.joinRequests.includes(userId)) {
    return res.status(400).json({ message: "You have already requested to join" });
  }

  community.joinRequests.push(userId);
  await community.save();

  res.status(200).json({ message: "Join request sent successfully" });
});

/**
 * @desc Approve join request
 * @route PUT /api/community/join-request/approve/:communityId/:userId
 * @access Private (Owner or Admins)
 */
const approveJoinRequest = asyncHandler(async (req, res) => {
  const { communityId, userId } = req.params;

  const community = await Community.findById(communityId);
  if (!community) {
    return res.status(404).json({ message: "Community not found" });
  }

  // Check permissions
  if (
    !community.owner.equals(req.user._id) &&
    !community.Admins.includes(req.user._id)
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (!community.joinRequests.includes(userId)) {
    return res.status(400).json({ message: "This user has not requested to join" });
  }

  community.joinRequests.pull(userId);
  community.members.push(userId);
  await community.save();

  await community.populate("owner members Admins joinRequests", "username profileName profilePhoto");

  res.status(200).json({ message: "User added to community", community });

});

/**
 * @desc Reject join request
 * @route PUT /api/community/join-request/reject/:communityId/:userId
 * @access Private (Owner or Admins)
 */
const rejectJoinRequest = asyncHandler(async (req, res) => {
  const { communityId, userId } = req.params;

  const community = await Community.findById(communityId);
  if (!community) {
    return res.status(404).json({ message: "Community not found" });
  }

  // Check permissions
  if (
    !community.owner.equals(req.user._id) &&
    !community.Admins.includes(req.user._id)
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (!community.joinRequests.includes(userId)) {
    return res.status(400).json({ message: "This user has not requested to join" });
  }
  community.joinRequests.pull(userId);
  await community.save();

  await community.populate("owner members Admins joinRequests", "username profileName profilePhoto");

  res.status(200).json({ message: "Join request rejected", community });
});

/**
 * @desc Add or update community rules
 * @route PUT /api/community/rules/:id
 * @access Private (Owner/Admins)
 */
const updateCommunityRules = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rules } = req.body;

  const community = await Community.findById(id);
  if (!community) {
    return res.status(404).json({ message: "Community not found" });
  }

  if (
    !community.owner.equals(req.user._id) &&
    !community.Admins.includes(req.user._id)
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  community.rules = rules || [];
  await community.save();

  res.status(200).json({ message: "Community rules updated", rules: community.rules });
});


module.exports = {
  getAllCommunities,
  getCommunityByCategory,
  addNewCommunity,
  deleteCommunity,
  joinTheCommunity,
  editCommunity,
  updateCommunityPicture,
  updateCommunityCover,
  removeMember,
  makeAdmin,
  getCommunityById,
  sendJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  updateCommunityRules,
};
