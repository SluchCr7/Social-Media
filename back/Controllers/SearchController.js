const asyncHandler = require("express-async-handler");
const { User } = require("../Modules/User");
const { Post } = require("../Modules/Post");
const { Community } = require("../Modules/Community");

/**
 * @desc Search for users, posts, and communities
 * @route GET /api/search
 * @access Private (verifyToken)
 */
const searchGlobal = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(200).json({ users: [], posts: [], communities: [] });
    }

    const searchRegex = new RegExp(q, "i");

    const [users, posts, communities] = await Promise.all([
        User.find({
            $or: [{ username: searchRegex }, { profileName: searchRegex }],
            isPrivate: false // Only show public users or handle relationships
        }).select("username profileName profilePhoto isVerify").limit(20),

        Post.find({
            text: searchRegex
        })
            .populate("owner", "username profileName profilePhoto")
            .limit(20),

        Community.find({
            Name: searchRegex
        }).select("Name CoverPhoto description membersCount").limit(10)
    ]);

    res.status(200).json({
        users,
        posts,
        communities
    });
});

module.exports = { searchGlobal };
