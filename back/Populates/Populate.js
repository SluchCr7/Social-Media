
// 👤 Common select for user data
const userSelect = "username profileName profilePhoto coverPhoto isAccountWithPremiumVerify";

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
  { path: "originalStory", populate: { path: "owner", select: userSelect } },
  { path: "collaborators", select: userSelect }
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
  { path: "replyTo", select: "text Photos sender", populate: { path: "sender", select: "name profilePhoto" } }
];
const EventPopulate = [
  { path: "invitedUsers", select: userSelect },
  { path: "createdBy", select: userSelect },
];

// 📝 postPopulate
const postPopulate = [
  {
    path: "owner",
    select: `username profileName profilePhoto coverPhoto isAccountWithPremiumVerify description followers following`,
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
    select: "text owner createdAt Photos media links mentions Hashtags",
    populate: [
      {
        path: "owner",
        select: userSelect,
      },
      {
        path: "mentions",
        select: userSelect,
      },
    ],
  },
  {
    path: "comments",
    select: "text owner likes",
    populate: {
      path: "owner",
      select: userSelect,
    },
  },
  {
    path: "music",
    select: "title cover url artist duration",
    populate: {
      path: "owner",
      select: userSelect,
    },
  },
];


const userOnePopulate = [
  {
    path: "audios",
    populate: {
      path: "owner",
      model: "User",
      select: userSelect,
    },
  },
  {
    path: "stories",
    populate: {
      path: "owner",
      model: "User",
      select: userSelect,
    },
  },
  {
    path: "following",
    select: userSelect,
  },
  {
    path: "followers",
    select: userSelect,
  },
  {
    path: "communities",
    select: communitySelect,
  },
  {
    path: "savedPosts",
    populate: [
      {
        path: "owner",
        model: "User",
        select: userSelect,
      },
      {
        path: "originalPost",
        model: "Post",
        populate: {
          path: "owner",
          model: "User",
          select: userSelect,
        },
      },
    ],
  },
  {
    path: "partner",
    select: "username profileName",
  },
  {
    path: "posts",
    populate: [
      {
        path: "owner",
        model: "User",
        select: userSelect,
      },
      {
        path: "comments",
        model: "Comment",
      },
      {
        path: "originalPost",
        model: "Post",
        populate: {
          path: "owner",
          model: "User",
          select: userSelect,
        },
      },
    ],
  },
  {
    path: "comments",
    populate: [
      {
        path: "owner",
        model: "User",
        select: userSelect,
      },
      {
        path: "targetId",
        populate: {
          path: "owner",
          model: "User",
          select: userSelect,
        },
      },
    ],
  },
  {
    path: "pinsPosts",
    populate: [
      {
        path: "owner",
        model: "User",
        select: userSelect,
      },
      {
        path: "originalPost",
        model: "Post",
        populate: {
          path: "owner",
          model: "User",
          select: userSelect,
        },
      },
    ],
  },
  {
    path: "reels",
    populate: {
      path: "owner",
      model: "User",
      select: userSelect,
    },
  },
  {
    path: "highlights",
    populate: [
      {
        path: "user",
        model: "User",
        select: userSelect,
      },
      {
        path: "stories",
        model: "Story",
        select: "Photo text createdAt originalStory"
      },
    ],
  },
  {
    path: "BlockedNotificationFromUsers",
    select: userSelect,
  },
  {
    path: "myMusicPlaylist",
    model: "Music",
    populate: {
      path: "owner",
      model: "User",
      select: userSelect,
    },
  },
  {
    path: "savedReels",
    model: "Reel",
    populate: {
      path: "owner",
      model: "User",
      select: userSelect,
    },
  },
  {
    path: "joinedCommunities",
    select: communitySelect,
  },
  {
    path: "adminCommunities",
    select: communitySelect,
  },
];

module.exports = { reelPopulate, EventPopulate, messagePopulate, storyPopulate, postPopulate, commentPopulate, communityPopulate, userOnePopulate };