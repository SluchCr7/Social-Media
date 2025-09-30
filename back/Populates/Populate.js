const reelPopulate = [
  { path: "owner", select: "username profileName profilePhoto" },
  { path: "originalPost", populate: { path: "owner", select: "username profileName profilePhoto" } },
];

const storyPopulate = [
  { path: "owner", select: "username profileName profilePhoto" },
  { path: "loves", select: "username profilePhoto" },
  { path: "views", select: "username profilePhoto" },
];

const commentPopulate = [
  {
    path: "owner",
    select: "username profilePhoto profileName",
  },
  {
    path: "replies",
    populate: {
      path: "owner",
      select: "username profilePhoto profileName",
    },
  },
];

const communityPopulate = [
  { path: "owner", select: "username profileName profilePhoto" },
  { path: "members", select: "username profileName profilePhoto" },
  { path: "Admins", select: "username profileName profilePhoto" },
  { path: "joinRequests", select: "username profileName profilePhoto" },
];

const messagePopulate = [
  { path: "sender", select: "username profilePhoto _id" },
  { path: "receiver", select: "username profilePhoto _id" },
];

module.exports = { reelPopulate,messagePopulate, storyPopulate , commentPopulate,communityPopulate};