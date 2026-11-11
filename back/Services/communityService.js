const { Community, ValidateCommunity, ValidateCommunityUpdate } = require("../Modules/Community");
const { User } = require("../Modules/User");
const mongoose = require("mongoose");
const { cloudUpload, cloudRemove } = require("../Config/cloudUpload");
const { sendNotificationHelper } = require("../utils/SendNotification");
const { communityPopulate } = require("../Populates/Populate");
const { io } = require("../Config/socket");

const result = (status, body) => ({ status, body });

const idOf = (value) => String(value?._id ?? value ?? "");
const includesId = (list, id) => Array.isArray(list) && list.some((item) => idOf(item) === idOf(id));
const isManager = (community, userId) =>
  idOf(community.owner) === idOf(userId) || includesId(community.Admins, userId);
const communitySummary = (community) => {
  const data = typeof community?.toObject === "function" ? community.toObject() : community;
  const members = data?.members || [];
  const {
    members: _members,
    Admins: _admins,
    joinRequests: _joinRequests,
    ...summary
  } = data || {};
  return { ...summary, membersCount: members.length };
};

async function getAllCommunities(userId, category) {
  const communities = await Community.find(category ? { Category: category } : {})
    .select("Name Picture Cover description members owner Category tags isPrivate isForAdults createdAt updatedAt")
    .sort({ createdAt: -1 })
    .populate({ path: "owner", select: "username profileName profilePhoto" })
    .lean();
  return communities.map(({ members = [], ...community }) => ({
    ...community,
    membersCount: members.length,
    isMember: idOf(community.owner) === idOf(userId) || includesId(members, userId),
  }));
}

async function getCommunityById(id, userId) {
  if (!mongoose.isValidObjectId(id)) return result(400, { message: "Invalid community ID" });
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  const isMember = idOf(community.owner) === idOf(userId) || includesId(community.members, userId);
  const canManage = userId && isManager(community, userId);
  const hasPendingRequest = includesId(community.joinRequests, userId);
  if (community.isPrivate && !isMember) {
    await community.populate({ path: "owner", select: "username profileName profilePhoto" });
    return result(200, {
      _id: community._id,
      Name: community.Name,
      Picture: community.Picture,
      Cover: community.Cover,
      description: community.description,
      owner: community.owner,
      Category: community.Category,
      tags: community.tags,
      rules: community.rules,
      isPrivate: true,
      isForAdults: community.isForAdults,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt,
      membersCount: community.members.length,
      isMember: false,
      hasPendingRequest,
    });
  }

  const populate = communityPopulate.filter(({ path }) => path !== "joinRequests");
  if (canManage) populate.push({ path: "joinRequests", select: "username profileName profilePhoto" });
  await community.populate(populate);
  const communityData = community.toObject();
  if (!canManage) delete communityData.joinRequests;
  return result(200, {
    ...communityData,
    membersCount: community.members.length,
    isMember,
    hasPendingRequest,
  });
}

async function getCommunityByCategory(category, userId) {
  return getAllCommunities(userId, category);
}

async function addNewCommunity(body, userId) {
  const { error, value } = ValidateCommunity(body);
  if (error) return result(400, { message: error.details[0].message });

  const {
    Name,
    Category,
    description,
    tags = [],
    rules = [],
    isPrivate = false,
    isForAdults = false,
  } = value;

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
  io.emit("community:create", communitySummary(community));

  return result(201, {
    message: "Community created successfully",
    community,
  });
}

async function deleteCommunity(id, requesterId, isPlatformAdmin = false) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!isPlatformAdmin && idOf(community.owner) !== idOf(requesterId)) {
    return result(403, { message: "Only the community owner can delete this community" });
  }

  await community.deleteOne();
  io.emit("community:delete", id);
  return result(200, { message: "Community removed" });
}

async function joinTheCommunity(id, userId) {
  let community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });

  if (idOf(community.owner) === idOf(userId)) {
    return result(400, { message: "Owner can't join or leave their own community" });
  }

  const leaving = includesId(community.members, userId);
  if (!leaving && community.isPrivate) {
    return result(403, { message: "Request to join this private community instead" });
  }
  if (leaving) {
    community.members.pull(userId);
    community.Admins.pull(userId);
  } else {
    community.members.addToSet(userId);
  }
  await community.save();
  const canManage = isManager(community, userId);
  const populate = communityPopulate.filter(({ path }) => path !== "joinRequests");
  if (canManage) populate.push({ path: "joinRequests", select: "username profileName profilePhoto" });
  await community.populate(populate);
  const communityData = community.toObject();
  if (!canManage) delete communityData.joinRequests;
  const updatedCommunity = {
    ...communityData,
    membersCount: community.members.length,
    isMember: !leaving,
  };
  io.emit("community:update", communitySummary(community));
  return result(200, {
    message: leaving ? "Community Left" : "Community Joined",
    community: community.isPrivate && !canManage
      ? communitySummary(community)
      : updatedCommunity,
  });
}

async function editCommunity(id, body, requesterId) {
  const { error, value } = ValidateCommunityUpdate(body);
  if (error) return result(400, { message: error.details[0].message });

  const existing = await Community.findById(id);
  if (!existing) return result(404, { message: "Community not found" });
  if (!isManager(existing, requesterId)) {
    return result(403, { message: "Only community owners and admins can edit this community" });
  }

  const updateData = {
    ...(typeof value.Name === "string" && { Name: value.Name }),
    ...(typeof value.Category === "string" && { Category: value.Category }),
    ...(typeof value.description === "string" && { description: value.description }),
    ...(typeof value.isPrivate === "boolean" && { isPrivate: value.isPrivate }),
    ...(typeof value.isForAdults === "boolean" && { isForAdults: value.isForAdults }),
    ...(value.tags && { tags: value.tags }),
    ...(value.rules && { rules: value.rules }),
  };
  const community = await Community.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).populate(communityPopulate);
  if (!community) return result(404, { message: "Community not found" });

  io.emit("community:update", communitySummary(community));
  return result(200, { message: "Community updated successfully", community });
}

async function updateCommunityPicture(id, file, requesterId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!isManager(community, requesterId)) {
    return result(403, { message: "Only community owners and admins can update its picture" });
  }
  if (!file) return result(400, { message: "No file uploaded" });

  const uploaded = await cloudUpload(file);
  if (community.Picture?.publicId) await cloudRemove(community.Picture.publicId);
  community.Picture = { url: uploaded.secure_url, publicId: uploaded.public_id };
  await community.save();
  const updatedCommunity = await Community.findById(id).populate(communityPopulate);
  io.emit("community:update", communitySummary(updatedCommunity));

  return result(200, {
    message: "Community picture updated successfully",
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });
}

async function updateCommunityCover(id, file, requesterId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!isManager(community, requesterId)) {
    return result(403, { message: "Only community owners and admins can update its cover" });
  }
  if (!file) return result(400, { message: "No file uploaded" });

  const uploaded = await cloudUpload(file);
  if (community.Cover?.publicId) await cloudRemove(community.Cover.publicId);
  community.Cover = { url: uploaded.secure_url, publicId: uploaded.public_id };
  await community.save();
  const updatedCommunity = await Community.findById(id).populate(communityPopulate);
  io.emit("community:update", communitySummary(updatedCommunity));

  return result(200, {
    message: "Community cover updated successfully",
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });
}

async function removeMember(communityId, userId, requester) {
  const community = await Community.findById(communityId);
  if (!community) return result(404, { message: "Community not found" });
  if (!isManager(community, requester._id)) {
    return result(403, { message: "Only community owners and admins can remove members" });
  }
  if (idOf(community.owner) === idOf(userId)) {
    return result(400, { message: "The community owner cannot be removed" });
  }
  if (!includesId(community.members, userId)) {
    return result(400, { message: "User is not a member of the community" });
  }

  community.members.pull(userId);
  community.Admins.pull(userId);
  await community.save();
  await community.populate(communityPopulate);
  await sendNotificationHelper({
    sender: requester._id,
    receiver: userId,
    content: `You have been removed from the community "${community.Name}"`,
    type: "remove",
    actionRef: communityId,
    actionModel: "Community",
  });
  io.emit("community:update", communitySummary(community));
  return result(200, { message: "Member removed successfully", community });
}

async function makeAdmin(id, userIdToMakeAdmin, requesterId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (idOf(community.owner) !== idOf(requesterId)) {
    return result(403, { message: "Only the community owner can manage admin roles" });
  }
  if (idOf(community.owner) === idOf(userIdToMakeAdmin)) {
    return result(400, { message: "The community owner is already an administrator" });
  }
  if (!includesId(community.members, userIdToMakeAdmin)) {
    return result(400, { message: "User is not a member of the community" });
  }

  const isAlreadyAdmin = includesId(community.Admins, userIdToMakeAdmin);
  if (isAlreadyAdmin) {
    community.Admins.pull(userIdToMakeAdmin);
    await community.save();
  } else {
    community.Admins.addToSet(userIdToMakeAdmin);
    await community.save();
  }
  await community.populate(communityPopulate);
  io.emit("community:update", communitySummary(community));
  return result(200, {
    message: isAlreadyAdmin ? "Admin removed successfully" : "Admin added successfully",
    community,
  });
}

async function sendJoinRequest(id, userId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!community.isPrivate) return result(400, { message: "Community is public, join directly" });
  if (includesId(community.members, userId)) {
    return result(400, { message: "You are already a member of this community" });
  }
  if (includesId(community.joinRequests, userId)) {
    return result(400, { message: "You have already requested to join" });
  }
  community.joinRequests.addToSet(userId);
  await community.save();
  io.emit("community:update", communitySummary(community));
  return result(200, { message: "Join request sent successfully", hasPendingRequest: true });
}

async function approveJoinRequest(communityId, userId, requesterId) {
  const community = await Community.findById(communityId);
  if (!community) return result(404, { message: "Community not found" });
  if (!isManager(community, requesterId)) {
    return result(403, { message: "Not authorized" });
  }
  if (!includesId(community.joinRequests, userId)) {
    return result(400, { message: "This user has not requested to join" });
  }

  community.joinRequests.pull(userId);
  community.members.addToSet(userId);
  await community.save();
  await community.populate(communityPopulate);
  await sendNotificationHelper({
    sender: requesterId,
    receiver: userId,
    content: `Your request to join the community "${community.Name}" has been approved.`,
    type: "approve",
    actionRef: communityId,
    actionModel: "Community",
  });
  io.emit("community:update", communitySummary(community));
  return result(200, { message: "User added to community", community });
}

async function rejectJoinRequest(communityId, userId, requesterId) {
  const community = await Community.findById(communityId);
  if (!community) return result(404, { message: "Community not found" });
  if (!isManager(community, requesterId)) {
    return result(403, { message: "Not authorized" });
  }
  if (!includesId(community.joinRequests, userId)) {
    return result(400, { message: "This user has not requested to join" });
  }

  community.joinRequests.pull(userId);
  await community.save();
  await community.populate(communityPopulate);
  await sendNotificationHelper({
    sender: requesterId,
    receiver: userId,
    content: `Your request to join the community "${community.Name}" has been rejected.`,
    type: "reject",
    actionRef: communityId,
    actionModel: "Community",
  });
  io.emit("community:update", communitySummary(community));
  return result(200, { message: "Join request rejected", community });
}

async function updateCommunityRules(id, rules, requesterId) {
  const community = await Community.findById(id);
  if (!community) return result(404, { message: "Community not found" });
  if (!isManager(community, requesterId)) {
    return result(403, { message: "Not authorized" });
  }
  if (
    !Array.isArray(rules) ||
    rules.length > 20 ||
    rules.some((rule) => typeof rule !== "string" || !rule.trim() || rule.trim().length > 200)
  ) {
    return result(400, { message: "Rules must be an array of non-empty text" });
  }
  community.rules = rules.map((rule) => rule.trim());
  await community.save();
  await community.populate(communityPopulate);
  io.emit("community:update", communitySummary(community));
  return result(200, { message: "Community rules updated", rules: community.rules, community });
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
