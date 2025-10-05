
// 👤 Common select for user data
const userSelect = "username profileName profilePhoto";

// 🏘 Common select for community
const communitySelect = "Name Picture members";

const reelPopulate = [
  { path: "owner", select: userSelect },
  { path: "originalPost", populate: { path: "owner", select: userSelect } }
];

const storyPopulate = [
  { path: "owner", select: userSelect },
  { path: "loves", select: userSelect },
  { path: "views", select: userSelect },
];

const commentPopulate = [
  {
    path: "owner",
    select: userSelect,
  },
  {
    path: "replies",
    populate: {
      path: "owner",
      select: userSelect,
    },
  },
];

const communityPopulate = [
  { path: "owner", select: userSelect },
  { path: "members", select: userSelect },
  { path: "Admins", select: userSelect },
  { path: "joinRequests", select: userSelect },
];

const messagePopulate = [
  { path: "sender", select: "username profilePhoto _id" },
  { path: "receiver", select: "username profilePhoto _id" },
];
const EventPopulate = [
  { path: "invitedUsers", select: userSelect },
  { path: "createdBy", select: userSelect },
];

// 📝 postPopulate
const postPopulate = [
  {
    path: "owner",
    select: `username profileName profilePhoto description followers following`, 
  },
  {
    path: "community",
    select: communitySelect,
  },
  {
    path: "mentions",
    select: userSelect,
  },
  {
    path: "views",
    select: userSelect,
  },
  {
    path: "originalPost",
    select: "text owner createdAt Photos",
    populate: {
      path: "owner",
      select: userSelect,
    },
  },
  {
    path: "comments",
    select: "text owner likes",
    populate: {
      path: "owner",
      select: userSelect,
    },
  },
];

module.exports = { reelPopulate,EventPopulate,messagePopulate, storyPopulate ,postPopulate, commentPopulate,communityPopulate};