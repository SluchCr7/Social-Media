const reelPopulate = [
  { path: "owner", select: "username profileName profilePhoto" },
  { path: "originalPost", populate: { path: "owner", select: "username profileName profilePhoto" } },
];

const storyPopulate = [
  { path: "owner", select: "username profileName profilePhoto" },
  { path: "loves", select: "username profilePhoto" },
  { path: "views", select: "username profilePhoto" },
];

module.exports = { reelPopulate, storyPopulate };