const asyncHandler = require("express-async-handler");
const { User } = require("../Modules/User");
const { Post } = require("../Modules/Post");
const { Community } = require("../Modules/Community");
const { postPopulate } = require("../Populates/Populate");

/**
 * @desc Search for users, posts, and communities
 * @route GET /api/search
 * @access Private (verifyToken)
 */
const searchGlobal = asyncHandler(async (req, res) => {
    const { q, type } = req.query;

    if (!q || q.trim() === "") {
        return res.status(200).json({ users: [], posts: [], communities: [], hashtags: [] });
    }

    const searchRegex = new RegExp(q, "i");
    const results = {};

    const searchPromises = [];

    if (!type || type === 'all' || type === 'users') {
        searchPromises.push(
            User.find({
                $or: [{ username: searchRegex }, { profileName: searchRegex }],
                isPrivate: false
            })
                .select("username profileName profilePhoto isVerify followersCount description")
                .limit(20)
                .then(data => results.users = data)
        );
    }

    if (!type || type === 'all' || type === 'posts') {
        searchPromises.push(
            Post.find({
                $or: [
                    { text: searchRegex },
                    { Hashtags: { $in: [searchRegex] } }
                ]
            })
                .populate(postPopulate)
                .sort({ createdAt: -1 })
                .limit(20)
                .then(data => results.posts = data)
        );
    }

    if (!type || type === 'all' || type === 'communities') {
        searchPromises.push(
            Community.find({
                Name: searchRegex
            })
                .select("Name CoverPhoto description membersCount")
                .limit(10)
                .then(data => results.communities = data)
        );
    }

    if (!type || type === 'all' || type === 'hashtags') {
        searchPromises.push(
            Post.aggregate([
                { $unwind: "$Hashtags" },
                { $match: { Hashtags: searchRegex } },
                { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ])
                .then(data => results.hashtags = data.map(h => ({ name: h._id, count: h.count })))
        );
    }

    await Promise.all(searchPromises);

    res.status(200).json(results);
});

/**
 * @desc Get trending hashtags and popular posts
 * @route GET /api/search/trending
 * @access Private
 */
const getTrending = asyncHandler(async (req, res) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [hashtags, posts] = await Promise.all([
        // Trending hashtags
        Post.aggregate([
            { $match: { createdAt: { $gte: lastWeek } } },
            { $unwind: "$Hashtags" },
            { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]),
        // Popular posts based on engagement
        Post.find({ createdAt: { $gte: lastWeek } })
            .populate(postPopulate)
            .lean()
    ]);

    const rankedPosts = posts.map(post => {
        const likes = post.likes ? post.likes.length : 0;
        const hahas = post.hahas ? post.hahas.length : 0;
        const shares = post.shares ? post.shares.length : 0;
        const views = post.views ? post.views.length : 0;
        const score = likes + hahas + (shares * 5) + (views * 0.5);
        return { ...post, score };
    })
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

    res.status(200).json({
        hashtags: hashtags.map(h => ({ name: h._id, count: h.count })),
        posts: rankedPosts
    });
});

/**
 * @desc Get suggested users to follow
 * @route GET /api/search/suggested-users
 * @access Private
 */
const getSuggestedUsers = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const currentUser = await User.findById(userId).select("following");

    const followingIds = currentUser.following.map(id => id.toString());

    const suggested = await User.find({
        _id: { $nin: [...followingIds, userId.toString()] },
        isPrivate: false
    })
        .select("username profileName profilePhoto isVerify followersCount description")
        .sort({ followersCount: -1 })
        .limit(10);

    res.status(200).json(suggested);
});

/**
 * @desc Add to search history
 * @route POST /api/search/history
 * @access Private
 */
const addToSearchHistory = asyncHandler(async (req, res) => {
    const { query, searchType, refId } = req.body;
    const userId = req.user._id;

    if (!query) return res.status(400).json({ message: "Query is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove duplicates
    user.searchHistory = user.searchHistory.filter(h => h.query !== query);

    user.searchHistory.unshift({ query, searchType: searchType || 'text', refId });

    if (user.searchHistory.length > 15) {
        user.searchHistory.pop();
    }

    await user.save();
    res.status(200).json(user.searchHistory);
});

/**
 * @desc Get search history
 * @route GET /api/search/history
 * @access Private
 */
const getSearchHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("searchHistory");
    res.status(200).json(user.searchHistory || []);
});

/**
 * @desc Clear individual or all search history
 * @route DELETE /api/search/history
 * @access Private
 */
const clearSearchHistory = asyncHandler(async (req, res) => {
    const { id } = req.query; // If ID provided, delete specific item
    const user = await User.findById(req.user._id);

    if (id) {
        user.searchHistory = user.searchHistory.filter(h => h._id.toString() !== id);
    } else {
        user.searchHistory = [];
    }

    await user.save();
    res.status(200).json({ message: "History updated", searchHistory: user.searchHistory });
});

/**
 * @desc Get explore content
 * @route GET /api/search/explore
 * @access Private
 */
const getExploreContent = asyncHandler(async (req, res) => {
    // Return mixture of popular content
    const [posts, suggestedUsers, trendingHashtags] = await Promise.all([
        Post.find({ status: "published" })
            .sort({ createdAt: -1 })
            .limit(40)
            .populate(postPopulate)
            .lean(),
        User.find({ _id: { $ne: req.user._id }, isPrivate: false })
            .sort({ followersCount: -1 })
            .limit(8)
            .select("username profileName profilePhoto isVerify followersCount description"),
        Post.aggregate([
            { $unwind: "$Hashtags" },
            { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])
    ]);

    // Shuffle posts for variety
    const shuffledPosts = posts.sort(() => 0.5 - Math.random());

    res.status(200).json({
        posts: shuffledPosts,
        suggestedUsers,
        trendingHashtags: trendingHashtags.map(h => ({ name: h._id, count: h.count }))
    });
});

module.exports = {
    searchGlobal,
    getTrending,
    getSuggestedUsers,
    addToSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    getExploreContent
};
