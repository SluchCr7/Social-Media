const { Community, ValidateCommunity, ValidateCommunityUpdate } = require("../Modules/Community");
const { User } = require("../Modules/User");
const { cloudUpload, cloudRemove } = require("../Config/cloudUpload");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { communityPopulate } = require("../Populates/Populate");
const { io } = require("../Config/socket");

const result = (status, body) => ({ status, body });

async function getAllCommunities() {
  return Community.find({}).populate(communityPopulate);
}

async function getCommunityById(id) {
  const community = await Community.findById(id).populate(communityPopulate);
  return community ? result(200, community) : result(404, { message: "Community Not Found" });
}

async function getCommunityByCategory(category) {
  return Community.find({ Category: category }).populate(communityPopulate);
}

async function addNewCommunity(body, userId) {
  const { error } = ValidateCommunity(body);
  if (error) return result(400, { message: error.details[0].message });

  const {
    Name,
    Category,
    description,
    tags = [],
    rules = [],
    isPrivate = false,
    isForAdults = false,
  } = body;

  const community = new Community({
    Name,
    Category,
    description,
    owner: userId,
    members: [userId],
    tags,
    rules,
    isPrivate,
    isForAdults,
  });

  const user = await User.findById(userId);
  user.userLevelPoints += 15;
  user.updateLevelRank();
  await user.save();

  await community.save();
  await community.populate([
    { path: "owner", select: "username profileName profilePhoto" },
    { path: "members", select: "username profileName profilePhoto" },
  ]);
  io.emit("community:create", community);

  return result(201, {
    message: "Community created successfully",
    community,
  });
}

async function deleteCommunity(id) {
  const community = await Community.findById(id);
  if (!community) return { error: "Community not found" };

  await community.remove();
  io.emit("community:delete", id);
  return result(200, { message: "Community removed" });
}

async function joinTheCommunity(id, userId) {
  let community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });

  if (community.owner.toString() === userId.toString()) {
    return result(400, { message: "Owner can't join or leave their own community" });
  }

  const leaving = community.members.includes(userId);
  community = await Community.findByIdAndUpdate(
    id,
    leaving ? { $pull: { members: userId } } : { $push: { members: userId } },
    { new: true }
  ).populate(communityPopulate);
  io.emit("community:update", community);
  return result(200, {
    message: leaving ? "Community Left" : "Community Joined",
    community,
  });
}

async function editCommunity(id, body) {
  const { error } = ValidateCommunityUpdate(body);
  if (error) return result(400, { message: error.details[0].message });

  const updateData = {
    ...(body.Name && { Name: body.Name }),
    ...(body.Category && { Category: body.Category }),
    ...(body.description && { description: body.description }),
    ...(typeof body.isPrivate === "boolean" && { isPrivate: body.isPrivate }),
    ...(typeof body.isForAdults === "boolean" && { isForAdults: body.isForAdults }),
    ...(body.tags && { tags: body.tags }),
    ...(body.rules && { rules: body.rules }),
  };
  const community = await Community.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).populate(communityPopulate);
  if (!community) return result(404, { message: "Community not found" });

  io.emit("community:update", community);
  return result(200, { message: "Community updated successfully", community });
}

async function updateCommunityPicture(id, file) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!file) return result(400, { message: "No file uploaded" });

  const uploaded = await cloudUpload(file);
  if (community.Picture?.publicId) await cloudRemove(community.Picture.publicId);
  community.Picture = { url: uploaded.secure_url, publicId: uploaded.public_id };
  await community.save();
  const updatedCommunity = await Community.findById(id).populate(communityPopulate);
  io.emit("community:update", updatedCommunity);

  return result(200, {
    message: "Community picture updated successfully",
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });
}

async function updateCommunityCover(id, file) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!file) return result(400, { message: "No file uploaded" });

  const uploaded = await cloudUpload(file);
  if (community.Cover?.publicId) await cloudRemove(community.Cover.publicId);
  community.Cover = { url: uploaded.secure_url, publicId: uploaded.public_id };
  await community.save();
  const updatedCommunity = await Community.findById(id).populate(communityPopulate);
  io.emit("community:update", updatedCommunity);

  return result(200, {
    message: "Community cover updated successfully",
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });
}

async function removeMember(communityId, userId, requester) {
  const community = await Community.findById(communityId);
  if (!community) return result(404, { message: "Community not found" });
  if (community.owner.toString() !== requester._id.toString()) {
    return result(403, { message: "Only the community owner can remove members" });
  }
  if (!community.members.includes(userId)) {
    return result(400, { message: "User is not a member of the community" });
  }

  await Community.findByIdAndUpdate(communityId, { $pull: { members: userId } });
  await sendNotificationHelper({
    sender: userId,
    receiver: requester._id,
    content: `You have been removed from the community "${community.name}"`,
    type: "remove",
    actionRef: communityId,
    actionModel: "Community",
  });
  return result(200, { message: "Member removed successfully" });
}

async function makeAdmin(id, userIdToMakeAdmin, requesterId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  const isRequesterOwner = community.owner.equals(requesterId);
  const isRequesterAdmin = community.Admins.includes(requesterId);
  if (!isRequesterOwner && !isRequesterAdmin) {
    return result(403, { message: "Only community owner or admins can manage admins" });
  }
  if (!community.members.includes(userIdToMakeAdmin)) {
    return result(400, { message: "User is not a member of the community" });
  }

  const isAlreadyAdmin = community.Admins.includes(userIdToMakeAdmin);
  if (isAlreadyAdmin) {
    community.Admins.pull(userIdToMakeAdmin);
    await community.save();
    return result(200, { message: "Admin removed successfully" });
  }
  community.Admins.push(userIdToMakeAdmin);
  await community.save();
  return result(200, { message: "Admin added successfully" });
}

async function sendJoinRequest(id, userId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!community.isPrivate) return result(400, { message: "Community is public, join directly" });
  if (community.members.includes(userId)) {
    return result(400, { message: "You are already a member of this community" });
  }
  if (community.joinRequests.includes(userId)) {
    return result(400, { message: "You have already requested to join" });
  }
  community.joinRequests.push(userId);
  await community.save();
  return result(200, { message: "Join request sent successfully" });
}

async function approveJoinRequest(communityId, userId, requesterId) {
  const community = await Community.findById(communityId);
  if (!community) return result(404, { message: "Community not found" });
  if (!community.owner.equals(requesterId) && !community.Admins.includes(requesterId)) {
    return result(403, { message: "Not authorized" });
  }
  if (!community.joinRequests.includes(userId)) {
    return result(400, { message: "This user has not requested to join" });
  }

  community.joinRequests.pull(userId);
  community.members.push(userId);
  await community.save();
  await community.populate(communityPopulate);
  await sendNotificationHelper({
    sender: requesterId,
    receiver: userId,
    content: `Your request to join the community "${community.name}" has been approved.`,
    type: "approve",
    actionRef: communityId,
    actionModel: "Community",
  });
  io.emit("community:update", community);
  return result(200, { message: "User added to community", community });
}

async function rejectJoinRequest(communityId, userId, requesterId) {
  const community = await Community.findById(communityId);
  if (!community) return result(404, { message: "Community not found" });
  if (!community.owner.equals(requesterId) && !community.Admins.includes(requesterId)) {
    return result(403, { message: "Not authorized" });
  }
  if (!community.joinRequests.includes(userId)) {
    return result(400, { message: "This user has not requested to join" });
  }

  community.joinRequests.pull(userId);
  await community.save();
  await community.populate(communityPopulate);
  await sendNotificationHelper({
    sender: requesterId,
    receiver: userId,
    content: `Your request to join the community "${community.name}" has been rejected.`,
    type: "reject",
    actionRef: communityId,
    actionModel: "Community",
  });
  return result(200, { message: "Join request rejected", community });
}

async function updateCommunityRules(id, rules, requesterId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!community.owner.equals(requesterId) && !community.Admins.includes(requesterId)) {
    return result(403, { message: "Not authorized" });
  }
  community.rules = rules || [];
  await community.save();
  return result(200, { message: "Community rules updated", rules: community.rules });
}

module.exports = {
  getAllCommunities,
  getCommunityById,
  getCommunityByCategory,
  addNewCommunity,
  deleteCommunity,
  joinTheCommunity,
  editCommunity,
  updateCommunityPicture,
  updateCommunityCover,
  removeMember,
  makeAdmin,
  sendJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  updateCommunityRules,
};
