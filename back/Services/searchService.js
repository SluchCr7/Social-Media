const { User } = require("../Modules/User");
const { Post } = require("../Modules/Post");
const { Comment } = require("../Modules/Comment");
const { Community } = require("../Modules/Community");
const { postPopulate } = require("../Populates/Populate");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const parseBoundedInteger = (value, fallback, min, max) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
};

const searchGlobal = async (query) => {
    const { q, type = 'all', sortBy = 'relevance', dateRange = 'all', hasMedia = 'false', verifiedOnly = 'false' } = query;
    const page = parseBoundedInteger(query.page, 1, 1, 10000);
    const limit = parseBoundedInteger(query.limit, 10, 1, 30);
    const skip = (page - 1) * limit;

    if (typeof q !== "string" || q.trim() === "") {
        return {
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
        };
    }

    const searchRegex = new RegExp(escapeRegex(q.trim()), "i");
    const results = {
        users: [],
        posts: [],
        communities: [],
        hashtags: [],
        pagination: {}
    };

    const searchPromises = [];

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

    if (type === 'all' || type === 'posts') {
        const postQuery = {
            $or: [
                { text: searchRegex },
                { Hashtags: { $in: [searchRegex] } }
            ],
            status: "published",
            privacy: "public"
        };

        if (dateRange !== 'all') {
            const dateLimit = new Date();
            if (dateRange === 'day') dateLimit.setDate(dateLimit.getDate() - 1);
            else if (dateRange === 'week') dateLimit.setDate(dateLimit.getDate() - 7);
            else if (dateRange === 'month') dateLimit.setDate(dateLimit.getDate() - 30);
            else if (dateRange === 'year') dateLimit.setDate(dateLimit.getDate() - 365);
            postQuery.createdAt = { $gte: dateLimit };
        }

        if (hasMedia === 'true') {
            postQuery.$and = [
                { $or: postQuery.$or },
                {
                    $or: [
                        { "media.0": { $exists: true } },
                        { "Photos.0": { $exists: true } },
                        { "Videos.0": { $exists: true } }
                    ]
                }
            ];
            delete postQuery.$or;
        }

        if (verifiedOnly === 'true') {
            searchPromises.push(
                (async () => {
                    const verifiedOwnerStages = [
                        {
                            $lookup: {
                                from: User.collection.name,
                                localField: "owner",
                                foreignField: "_id",
                                pipeline: [{ $match: { isVerify: true } }, { $project: { _id: 1 } }],
                                as: "verifiedOwner"
                            }
                        },
                        { $match: { "verifiedOwner.0": { $exists: true } } }
                    ];
                    const matchStages = [{ $match: postQuery }, ...verifiedOwnerStages];
                    const totalResult = await Post.aggregate([...matchStages, { $count: "total" }]);
                    const totalCount = totalResult[0]?.total || 0;
                    const sortStages = sortBy === 'popular'
                        ? [
                            {
                                $lookup: {
                                    from: Comment.collection.name,
                                    localField: "_id",
                                    foreignField: "targetId",
                                    pipeline: [
                                        { $match: { targetType: "Post" } },
                                        { $project: { _id: 1 } }
                                    ],
                                    as: "commentRows"
                                }
                            },
                            {
                                $addFields: {
                                    score: {
                                        $add: [
                                            { $size: { $ifNull: ["$likes", []] } },
                                            { $multiply: [{ $size: "$commentRows" }, 2] },
                                            { $multiply: [{ $size: { $ifNull: ["$shares", []] } }, 3] },
                                            { $multiply: [{ $size: { $ifNull: ["$views", []] } }, 0.1] }
                                        ]
                                    }
                                }
                            },
                            { $sort: { score: -1, createdAt: -1 } }
                        ]
                        : [{ $sort: { createdAt: -1 } }];
                    const data = await Post.aggregate([
                        ...matchStages,
                        ...sortStages,
                        { $skip: skip },
                        { $limit: limit },
                        { $unset: ["verifiedOwner", "commentRows"] }
                    ]);
                    results.posts = await Post.populate(data, postPopulate);
                    results.pagination.posts = {
                        page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalCount,
                        hasMore: skip + results.posts.length < totalCount
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
                        const postsAgg = await Post.aggregate([
                            { $match: postQuery },
                            {
                                $lookup: {
                                    from: Comment.collection.name,
                                    localField: "_id",
                                    foreignField: "targetId",
                                    pipeline: [
                                        { $match: { targetType: "Post" } },
                                        { $project: { _id: 1 } }
                                    ],
                                    as: "commentRows"
                                }
                            },
                            {
                                $addFields: {
                                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                                    commentsCount: { $size: "$commentRows" },
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
                            { $limit: limit },
                            { $unset: ["likesCount", "commentsCount", "viewsCount", "sharesCount", "commentRows"] }
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

    if (type === 'all' || type === 'communities') {
        const communityQuery = { Name: searchRegex, isPrivate: false };

        searchPromises.push(
            (async () => {
                const totalCount = await Community.countDocuments(communityQuery);
                const data = await Community.aggregate([
                    { $match: communityQuery },
                    { $addFields: { membersCount: { $size: { $ifNull: ["$members", []] } } } },
                    { $sort: sortBy === 'recent' ? { createdAt: -1 } : { membersCount: -1, createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { Name: 1, CoverPhoto: 1, description: 1, membersCount: 1, Picture: 1 } }
                ]);

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
    return results;
};

const getTrending = async () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [hashtags, posts] = await Promise.all([
        Post.aggregate([
            { $match: { createdAt: { $gte: lastWeek }, status: "published", privacy: "public" } },
            { $unwind: "$Hashtags" },
            { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]),
        Post.aggregate([
            { $match: { createdAt: { $gte: lastWeek }, status: "published", privacy: "public" } },
            {
                $lookup: {
                    from: Comment.collection.name,
                    localField: "_id",
                    foreignField: "targetId",
                    pipeline: [
                        { $match: { targetType: "Post" } },
                        { $project: { _id: 1 } }
                    ],
                    as: "commentRows"
                }
            },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    hahaCount: { $size: { $ifNull: ["$hahas", []] } },
                    shareCount: { $size: { $ifNull: ["$shares", []] } },
                    viewsCount: { $size: { $ifNull: ["$views", []] } },
                    commentsCount: { $size: "$commentRows" }
                }
            },
            {
                $addFields: {
                    score: {
                        $add: [
                            { $multiply: ["$likesCount", 2] },
                            { $multiply: ["$hahaCount", 2] },
                            { $multiply: ["$commentsCount", 3] },
                            { $multiply: ["$shareCount", 5] },
                            { $multiply: ["$viewsCount", 0.2] }
                        ]
                    }
                }
            },
            { $sort: { score: -1, createdAt: -1 } },
            { $limit: 20 },
            { $unset: ["likesCount", "hahaCount", "shareCount", "viewsCount", "commentsCount", "commentRows"] }
        ])
    ]);

    const rankedPosts = await Post.populate(posts, postPopulate);

    return {
        hashtags: hashtags.map(h => ({ name: h._id, count: h.count })),
        posts: rankedPosts
    };
};

const getSuggestedUsers = async (userId) => {
    const currentUser = await User.findById(userId).select("following");
    const followingIds = currentUser ? currentUser.following.map(id => id.toString()) : [];

    return User.find({
        _id: { $nin: [...followingIds, userId.toString()] },
        isPrivate: false
    })
        .select("username profileName profilePhoto isVerify followersCount description")
        .sort({ followersCount: -1 })
        .limit(10);
};

const addToSearchHistory = async (data, userId) => {
    const { query, searchType, refId } = data;
    if (!query) return { status: 400, body: { message: "Query is required" } };

    const user = await User.findById(userId);
    if (!user) return { status: 404, body: { message: "User not found" } };

    user.searchHistory = user.searchHistory.filter(h => h.query !== query && (!refId || h.refId?.toString() !== refId));
    user.searchHistory.unshift({ query, searchType: searchType || 'text', refId });

    if (user.searchHistory.length > 15) {
        user.searchHistory.pop();
    }

    await user.save();
    return { status: 200, body: user.searchHistory };
};

const getSearchHistory = async (userId) => {
    const user = await User.findById(userId).select("searchHistory");
    return user ? (user.searchHistory || []) : [];
};

const clearSearchHistory = async (id, userId) => {
    const user = await User.findById(userId);
    if (!user) return { status: 404, body: { message: "User not found" } };

    if (id) {
        user.searchHistory = user.searchHistory.filter(h => h._id.toString() !== id);
    } else {
        user.searchHistory = [];
    }

    await user.save();
    return { status: 200, body: { message: "History updated", searchHistory: user.searchHistory } };
};

const getExploreContent = async (query, userId) => {
    const tab = query.tab || 'trending';
    const page = parseBoundedInteger(query.page, 1, 1, 10000);
    const limit = parseBoundedInteger(query.limit, 12, 1, 30);
    const skip = (page - 1) * limit;
    const recentCutoff = new Date();
    recentCutoff.setDate(recentCutoff.getDate() - 7);

    const [suggestedUsers, trendingHashtags] = await Promise.all([
        tab === 'users'
            ? User.find({ _id: { $ne: userId }, isPrivate: false })
                .sort({ followersCount: -1, _id: 1 })
                .skip(skip)
                .limit(limit)
                .select("username profileName profilePhoto isVerify followersCount description")
                .lean()
            : Promise.resolve([]),
        tab === 'tags'
            ? Post.aggregate([
                { $match: { status: "published", privacy: "public", createdAt: { $gte: recentCutoff } } },
                { $unwind: "$Hashtags" },
                { $group: { _id: "$Hashtags", count: { $sum: 1 } } },
                { $sort: { count: -1, _id: 1 } },
                { $limit: 15 }
            ])
            : Promise.resolve([])
    ]);

    const hashtagsFormatted = trendingHashtags.map(h => ({ name: h._id, count: h.count }));
    const baseQuery = { status: "published", privacy: "public" };

    if (tab === 'trending' || tab === 'photos' || tab === 'videos') {
        let postQuery = { ...baseQuery };
        if (tab === 'trending') {
            postQuery.createdAt = { $gte: recentCutoff };
        }

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

        const totalCount = await Post.countDocuments(postQuery);
        const rankingStages = tab === 'trending'
            ? [
                {
                    $lookup: {
                        from: Comment.collection.name,
                        localField: "_id",
                        foreignField: "targetId",
                        pipeline: [
                            { $match: { targetType: "Post" } },
                            { $project: { _id: 1 } }
                        ],
                        as: "commentRows"
                    }
                },
                {
                    $addFields: {
                        engagement: {
                            $add: [
                                { $multiply: [{ $size: { $ifNull: ["$likes", []] } }, 2] },
                                { $multiply: [{ $size: { $ifNull: ["$hahas", []] } }, 2] },
                                { $multiply: [{ $size: "$commentRows" }, 3] },
                                { $multiply: [{ $size: { $ifNull: ["$shares", []] } }, 5] },
                                { $multiply: [{ $size: { $ifNull: ["$views", []] } }, 0.2] }
                            ]
                        },
                        ageInHours: {
                            $divide: [{ $subtract: [new Date(), "$createdAt"] }, 3600000]
                        }
                    }
                },
                {
                    $addFields: {
                        score: {
                            $divide: ["$engagement", { $pow: [{ $add: ["$ageInHours", 2] }, 1.8] }]
                        }
                    }
                },
                { $sort: { score: -1, createdAt: -1 } },
                { $unset: "commentRows" }
            ]
            : [{ $sort: { createdAt: -1 } }];

        const postRows = await Post.aggregate([
            { $match: postQuery },
            ...rankingStages,
            { $skip: skip },
            { $limit: limit }
        ]);
        const paginatedPosts = await Post.populate(postRows, postPopulate);

        return {
            posts: paginatedPosts,
            suggestedUsers,
            pagination: { page, limit, hasMore: skip + paginatedPosts.length < totalCount }
        };
    }

    if (tab === 'tags') {
        return {
            posts: [],
            suggestedUsers,
            trendingHashtags: hashtagsFormatted,
            pagination: { page, limit, hasMore: false }
        };
    }

    if (tab === 'users') {
        const totalCount = await User.countDocuments({ _id: { $ne: userId }, isPrivate: false });

        return {
            posts: [],
            suggestedUsers,
            pagination: {
                page,
                limit,
                hasMore: skip + suggestedUsers.length < totalCount
            }
        };
    }

    return {
        posts: [],
        suggestedUsers,
        trendingHashtags: hashtagsFormatted,
        pagination: { page, limit, hasMore: false }
    };
};

module.exports = {
    searchGlobal,
    getTrending,
    getSuggestedUsers,
    addToSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    getExploreContent
};
