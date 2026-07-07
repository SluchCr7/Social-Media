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
    const { q, type = 'all', sortBy = 'relevance', dateRange = 'all', hasMedia = 'false', verifiedOnly = 'false' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === "") {
        return res.status(200).json({ 
            users: [], 
            posts: [], 
            communities: [], 
            hashtags: [],
            pagination: {
                users: { page, totalPages: 0, totalCount: 0, hasMore: false },
                posts: { page, totalPages: 0, totalCount: 0, hasMore: false },
                communities: { page, totalPages: 0, totalCount: 0, hasMore: false },
                hashtags: { page, totalPages: 0, totalCount: 0, hasMore: false }
            }
        });
    }

    const searchRegex = new RegExp(q.trim(), "i");
    const results = {
        users: [],
        posts: [],
        communities: [],
        hashtags: [],
        pagination: {}
    };

    const searchPromises = [];

    // 1. Users search
    if (type === 'all' || type === 'users') {
        const userQuery = {
            $or: [{ username: searchRegex }, { profileName: searchRegex }],
            isPrivate: false
        };
        if (verifiedOnly === 'true') {
            userQuery.isVerify = true;
        }

        let userSort = { followersCount: -1 };
        if (sortBy === 'recent') {
            userSort = { createdAt: -1 };
        }

        searchPromises.push(
            (async () => {
                const totalCount = await User.countDocuments(userQuery);
                const data = await User.find(userQuery)
                    .select("username profileName profilePhoto isVerify followersCount description")
                    .sort(userSort)
                    .skip(skip)
                    .limit(limit);
                
                results.users = data;
                results.pagination.users = {
                    page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasMore: skip + data.length < totalCount
                };
            })()
        );
    }

    // 2. Posts search
    if (type === 'all' || type === 'posts') {
        const postQuery = {
            $or: [
                { text: searchRegex },
                { Hashtags: { $in: [searchRegex] } }
            ],
            status: "published",
            privacy: "public"
        };

        // Date range filter
        if (dateRange !== 'all') {
            const dateLimit = new Date();
            if (dateRange === 'day') dateLimit.setDate(dateLimit.getDate() - 1);
            else if (dateRange === 'week') dateLimit.setDate(dateLimit.getDate() - 7);
            else if (dateRange === 'month') dateLimit.setDate(dateLimit.getDate() - 30);
            else if (dateRange === 'year') dateLimit.setDate(dateLimit.getDate() - 365);
            postQuery.createdAt = { $gte: dateLimit };
        }

        // Media filter
        if (hasMedia === 'true') {
            postQuery.$or = [
                { "media.0": { $exists: true } },
                { "Photos.0": { $exists: true } },
                { "Videos.0": { $exists: true } }
            ];
        }

        // Verified owners filter
        if (verifiedOnly === 'true') {
            searchPromises.push(
                (async () => {
                    const verifiedUsers = await User.find({ isVerify: true }).select('_id');
                    const verifiedIds = verifiedUsers.map(u => u._id);
                    postQuery.owner = { $in: verifiedIds };
                    
                    const totalCount = await Post.countDocuments(postQuery);
                    let queryBuilder = Post.find(postQuery).populate(postPopulate);

                    if (sortBy === 'recent') {
                        queryBuilder = queryBuilder.sort({ createdAt: -1 });
                    } else if (sortBy === 'popular') {
                        queryBuilder = queryBuilder.sort({ "likes.length": -1, "views.length": -1 });
                    } else {
                        queryBuilder = queryBuilder.sort({ createdAt: -1 });
                    }

                    const data = await queryBuilder.skip(skip).limit(limit);
                    results.posts = data;
                    results.pagination.posts = {
                        page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasMore: skip + data.length < totalCount
                    };
                })()
            );
        } else {
            searchPromises.push(
                (async () => {
                    const totalCount = await Post.countDocuments(postQuery);
                    let queryBuilder = Post.find(postQuery).populate(postPopulate);

                    if (sortBy === 'recent') {
                        queryBuilder = queryBuilder.sort({ createdAt: -1 });
                    } else if (sortBy === 'popular') {
                        if (sortBy === 'popular') {
                            const postsAgg = await Post.aggregate([
                                { $match: postQuery },
                                {
                                    $addFields: {
                                        likesCount: { $size: { $ifNull: ["$likes", []] } },
                                        commentsCount: { $size: { $ifNull: ["$comments", []] } },
                                        viewsCount: { $size: { $ifNull: ["$views", []] } },
                                        sharesCount: { $size: { $ifNull: ["$shares", []] } }
                                    }
                                },
                                {
                                    $addFields: {
                                        score: {
                                            $add: [
                                                "$likesCount",
                                                { $multiply: ["$commentsCount", 2] },
                                                { $multiply: ["$sharesCount", 3] },
                                                { $multiply: ["$viewsCount", 0.1] }
                                            ]
                                        }
                                    }
                                },
                                { $sort: { score: -1, createdAt: -1 } },
                                { $skip: skip },
                                { $limit: limit }
                            ]);
                            const populatedPosts = await Post.populate(postsAgg, postPopulate);
                            results.posts = populatedPosts;
                            results.pagination.posts = {
                                page,
                                totalPages: Math.ceil(totalCount / limit),
                                totalCount,
                                hasMore: skip + populatedPosts.length < totalCount
                            };
                            return;
                        }
                    } else {
                        queryBuilder = queryBuilder.sort({ createdAt: -1 });
                    }

                    const data = await queryBuilder.skip(skip).limit(limit);
                    results.posts = data;
                    results.pagination.posts = {
                        page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasMore: skip + data.length < totalCount
                    };
                })()
            );
        }
    }

    // 3. Communities search
    if (type === 'all' || type === 'communities') {
        const communityQuery = { Name: searchRegex };
        let commSort = { membersCount: -1 };
        if (sortBy === 'recent') commSort = { createdAt: -1 };

        searchPromises.push(
            (async () => {
                const totalCount = await Community.countDocuments(communityQuery);
                const data = await Community.find(communityQuery)
                    .select("Name CoverPhoto description membersCount Picture")
                    .sort(commSort)
                    .skip(skip)
                    .limit(limit);

                results.communities = data;
                results.pagination.communities = {
                    page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasMore: skip + data.length < totalCount
                };
            })()
        );
    }

    // 4. Hashtags search
    if (type === 'all' || type === 'hashtags') {
        searchPromises.push(
            (async () => {
                const matchQuery = { Hashtags: searchRegex, status: "published", privacy: "public" };
                const countAgg = await Post.aggregate([
                    { $match: matchQuery },
                    { $unwind: "$Hashtags" },
                    { $match: { Hashtags: searchRegex } },
                    { $group: { _id: "$Hashtags" } },
                    { $count: "total" }
                ]);
                const totalCount = countAgg[0]?.total || 0;

                const data = await Post.aggregate([
                    { $match: matchQuery },
                    { $unwind: "$Hashtags" },
                    { $match: { Hashtags: searchRegex } },
                    { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ]);

                const formattedHashtags = data.map(h => ({ name: h._id, count: h.count }));
                results.hashtags = formattedHashtags;
                results.pagination.hashtags = {
                    page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasMore: skip + formattedHashtags.length < totalCount
                };
            })()
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
            { $match: { createdAt: { $gte: lastWeek }, status: "published", privacy: "public" } },
            { $unwind: "$Hashtags" },
            { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]),
        // Popular posts based on engagement
        Post.find({ createdAt: { $gte: lastWeek }, status: "published", privacy: "public" })
            .populate(postPopulate)
            .lean()
    ]);

    const rankedPosts = posts.map(post => {
        const likes = post.likes ? post.likes.length : 0;
        const hahas = post.hahas ? post.hahas.length : 0;
        const shares = post.shares ? post.shares.length : 0;
        const views = post.views ? post.views.length : 0;
        const comments = post.comments ? post.comments.length : 0;
        const score = likes * 2 + hahas * 2 + comments * 3 + shares * 5 + views * 0.2;
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
    const followingIds = currentUser ? currentUser.following.map(id => id.toString()) : [];

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

    user.searchHistory = user.searchHistory.filter(h => h.query !== query && (!refId || h.refId?.toString() !== refId));

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
    res.status(200).json(user ? (user.searchHistory || []) : []);
});

/**
 * @desc Clear individual or all search history
 * @route DELETE /api/search/history
 * @access Private
 */
const clearSearchHistory = asyncHandler(async (req, res) => {
    const { id } = req.query; // If ID provided, delete specific item
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (id) {
        user.searchHistory = user.searchHistory.filter(h => h._id.toString() !== id);
    } else {
        user.searchHistory = [];
    }

    await user.save();
    res.status(200).json({ message: "History updated", searchHistory: user.searchHistory });
});

/**
 * @desc Get explore content with smart HackerNews engagement decay scoring & tab pagination
 * @route GET /api/search/explore
 * @access Private
 */
const getExploreContent = asyncHandler(async (req, res) => {
    const tab = req.query.tab || 'trending';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [suggestedUsers, trendingHashtags] = await Promise.all([
        User.find({ _id: { $ne: req.user._id }, isPrivate: false })
            .sort({ followersCount: -1 })
            .limit(10)
            .select("username profileName profilePhoto isVerify followersCount description"),
        Post.aggregate([
            { $match: { status: "published", privacy: "public" } },
            { $unwind: "$Hashtags" },
            { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ])
    ]);

    const hashtagsFormatted = trendingHashtags.map(h => ({ name: h._id, count: h.count }));

    const baseQuery = { status: "published", privacy: "public" };

    if (tab === 'trending' || tab === 'photos' || tab === 'videos') {
        let postQuery = { ...baseQuery };

        if (tab === 'photos') {
            postQuery.$or = [
                { "media.type": "image" },
                { "Photos.0": { $exists: true } }
            ];
        } else if (tab === 'videos') {
            postQuery.$or = [
                { "media.type": "video" },
                { "Videos.0": { $exists: true } }
            ];
        }

        const rawPosts = await Post.find(postQuery)
            .sort({ createdAt: -1 })
            .limit(150)
            .populate(postPopulate)
            .lean();

        const scoredPosts = rawPosts.map(post => {
            const likesCount = post.likes ? post.likes.length : 0;
            const commentsCount = post.comments ? post.comments.length : 0;
            const sharesCount = post.shares ? post.shares.length : 0;
            const viewsCount = post.views ? post.views.length : 0;

            const engagement = likesCount * 2 + commentsCount * 3 + sharesCount * 5 + viewsCount * 0.2;
            const ageInHours = (Date.now() - new Date(post.createdAt).getTime()) / 3600000;
            
            const score = (engagement) / Math.pow(ageInHours + 2, 1.8);
            return { ...post, score };
        });

        scoredPosts.sort((a, b) => b.score - a.score);

        const paginatedPosts = scoredPosts.slice(skip, skip + limit);
        const hasMore = skip + paginatedPosts.length < scoredPosts.length;

        return res.status(200).json({
            posts: paginatedPosts,
            suggestedUsers,
            trendingHashtags: hashtagsFormatted,
            pagination: {
                page,
                limit,
                hasMore
            }
        });
    }

    if (tab === 'tags') {
        const totalCount = hashtagsFormatted.length;
        const paginatedTags = hashtagsFormatted.slice(skip, skip + limit);
        return res.status(200).json({
            posts: [],
            suggestedUsers,
            trendingHashtags: hashtagsFormatted,
            pagination: {
                page,
                limit,
                hasMore: skip + paginatedTags.length < totalCount
            }
        });
    }

    if (tab === 'users') {
        const totalCount = await User.countDocuments({ _id: { $ne: req.user._id }, isPrivate: false });
        const users = await User.find({ _id: { $ne: req.user._id }, isPrivate: false })
            .sort({ followersCount: -1 })
            .skip(skip)
            .limit(limit)
            .select("username profileName profilePhoto isVerify followersCount description");

        return res.status(200).json({
            posts: [],
            suggestedUsers: users,
            trendingHashtags: hashtagsFormatted,
            pagination: {
                page,
                limit,
                hasMore: skip + users.length < totalCount
            }
        });
    }

    res.status(200).json({
        posts: [],
        suggestedUsers,
        trendingHashtags: hashtagsFormatted,
        pagination: { page, limit, hasMore: false }
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
