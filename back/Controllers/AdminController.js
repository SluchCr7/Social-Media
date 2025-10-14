const asyncHandler = require("express-async-handler");
const { User } = require("../Modules/User");
const { Post } = require("../Modules/Post")
const { Community } = require("../Modules/Community")
const { Music } = require("../Modules/Music")
const {Reel} = require("../Modules/Reel")
const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalPosts, totalCommunities, todayPosts , totalMusic , totalReels] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Community.countDocuments(),
    Post.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
    Music.countDocuments(),
    Reel.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    stats: {
        totalUsers,
        totalPosts,
        totalCommunities,
        todayPosts,
        totalMusic,
        totalReels
    }
  });
});


module.exports = { getAdminStats };