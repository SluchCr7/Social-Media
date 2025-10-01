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
const EventPopulate = [
  { path: "invitedUsers", select: "username profileName profilePhoto" },
  { path: "createdBy", select: "username profileName profilePhoto" },
];
// utils/populatePost.js
const postPopulate = () => [
  { path: "owner", select: "username profileName profilePhoto following followers description" },
  { path: "community", select: "Name Picture members" },
  { path: "mentions", select: "username profileName profilePhoto" },
  { path: "likes", select: "username profileName profilePhoto" },
  { path: "views", select: "username profileName profilePhoto" },
  { path: "originalPost", select: "text owner", populate: { path: "owner", select: "username profileName profilePhoto" } },
  { path: "comments", select: "text owner likes", populate: { path: "owner", select: "username profileName profilePhoto" } },
];

module.exports = { reelPopulate,EventPopulate,messagePopulate, storyPopulate ,postPopulate, commentPopulate,communityPopulate};