const { User } = require('../Modules/User');
const { Post } = require('../Modules/Post');
const { Comment } = require('../Modules/Comment');
const { Community } = require('../Modules/Community');
const { Music } = require('../Modules/Music');
const Reel = require('../Modules/Reel');
const { Report } = require('../Modules/Report');
const { Notification } = require('../Modules/Notification');
const { Story } = require('../Modules/Story');
const { AdminLog } = require('../Modules/AdminLog');
const { io } = require('../Config/socket');
const os = require('os');

/**
 * 1. Comprehensive Platform Overview & System Telemetry
 */
const getAdminStats = async () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    totalUsers,
    activeUsers,
    bannedUsers,
    suspendedUsers,
    verifiedUsers,
    adminUsers,
    totalPosts,
    todayPosts,
    totalComments,
    totalCommunities,
    totalMusic,
    totalReels,
    pendingReports,
    criticalReports,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ accountStatus: 'active' }),
    User.countDocuments({ accountStatus: 'banned' }),
    User.countDocuments({ accountStatus: 'suspended' }),
    User.countDocuments({ isAccountWithPremiumVerify: true }),
    User.countDocuments({ isAdmin: true }),
    Post.countDocuments(),
    Post.countDocuments({ createdAt: { $gte: todayStart } }),
    Comment.countDocuments(),
    Community.countDocuments(),
    Music.countDocuments(),
    Reel.countDocuments(),
    Report.countDocuments({ status: 'pending' }),
    Report.countDocuments({ severity: 'critical', status: 'pending' }),
  ]);

  // 7-day activity metrics
  const [posts7Days, users7Days, reels7Days, comments7Days] = await Promise.all([
    Post.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean(),
    User.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean(),
    Reel.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean(),
    Comment.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean(),
  ]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    const dayName = daysOfWeek[d.getDay()];
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    chartData.push({
      name: dayName,
      date: dateStr,
      posts: 0,
      users: 0,
      reels: 0,
      comments: 0,
    });
  }

  const getDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  posts7Days.forEach((p) => {
    const item = chartData.find((c) => c.date === getDateKey(p.createdAt));
    if (item) item.posts++;
  });
  users7Days.forEach((u) => {
    const item = chartData.find((c) => c.date === getDateKey(u.createdAt));
    if (item) item.users++;
  });
  reels7Days.forEach((r) => {
    const item = chartData.find((c) => c.date === getDateKey(r.createdAt));
    if (item) item.reels++;
  });
  comments7Days.forEach((c) => {
    const item = chartData.find((c) => c.date === getDateKey(c.createdAt));
    if (item) item.comments++;
  });

  // Recent Users & Recent Reports
  const [recentUsers, recentReports, recentLogs] = await Promise.all([
    User.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select('username profileName profilePhoto email createdAt accountStatus isAdmin isAccountWithPremiumVerify')
      .lean(),
    Report.find({ status: 'pending' })
      .populate('owner', 'username profileName profilePhoto')
      .populate('reportedUserId', 'username profileName profilePhoto')
      .populate('postId', 'text media')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    AdminLog.find({})
      .populate('admin', 'username profileName profilePhoto')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  // System Resource Telemetry
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const memoryUsagePercent = Number(((usedMem / totalMem) * 100).toFixed(1));

  return {
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      bannedUsers,
      suspendedUsers,
      verifiedUsers,
      adminUsers,
      totalPosts,
      todayPosts,
      totalComments,
      totalCommunities,
      totalMusic,
      totalReels,
      pendingReports,
      criticalReports,
      chartData,
      recentUsers,
      recentReports,
      recentLogs,
      system: {
        memoryUsagePercent,
        usedMemMB: Math.round(usedMem / (1024 * 1024)),
        totalMemMB: Math.round(totalMem / (1024 * 1024)),
        cpuCores: os.cpus().length,
        platform: os.platform(),
        osUptime: Math.floor(os.uptime()),
        processUptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
      },
    },
  };
};

/**
 * 2. Advanced Paginated User Management with Filtering & Sorting
 */
const getAdminUsers = async ({ page = 1, limit = 10, search = '', role = 'all', status = 'all', sort = 'newest' }) => {
  const filter = {};

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ username: regex }, { email: regex }, { profileName: regex }];
  }

  if (role === 'admin') filter.isAdmin = true;
  if (role === 'user') filter.isAdmin = false;

  if (status === 'banned') filter.accountStatus = 'banned';
  if (status === 'suspended') filter.accountStatus = 'suspended';
  if (status === 'verified') filter.isAccountWithPremiumVerify = true;
  if (status === 'active') filter.accountStatus = 'active';

  let sortOption = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'points') sortOption = { userLevelPoints: -1 };
  if (sort === 'followers') sortOption = { followersCount: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .select('-password -refreshTokens')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  return {
    success: true,
    users,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * 3. Update User Status (Active, Suspended, Banned)
 */
const updateUserStatus = async (adminId, targetUserId, { status, days = 7, reason = '', ip = '' }) => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error('Target user not found');

  const oldStatus = user.accountStatus;
  user.accountStatus = status;

  if (status === 'suspended') {
    const suspendDays = parseInt(days, 10) || 7;
    user.suspendedUntil = new Date(Date.now() + suspendDays * 24 * 60 * 60 * 1000);
    // Invalidate refresh tokens to force immediate logout
    user.refreshTokens = [];
  } else if (status === 'banned') {
    user.suspendedUntil = null;
    user.refreshTokens = [];
  } else if (status === 'active') {
    user.suspendedUntil = null;
  }

  await user.save();

  // Log action
  await AdminLog.create({
    admin: adminId,
    action: `SET_STATUS_${status.toUpperCase()}`,
    targetType: 'User',
    targetId: String(targetUserId),
    details: { oldStatus, newStatus: status, days, reason },
    ip,
  });

  return {
    success: true,
    message: `User status changed to ${status}`,
    user: {
      _id: user._id,
      username: user.username,
      accountStatus: user.accountStatus,
      suspendedUntil: user.suspendedUntil,
    },
  };
};

/**
 * 4. Toggle Admin Privileges
 */
const toggleUserAdminRole = async (adminId, targetUserId, ip = '') => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error('Target user not found');

  user.isAdmin = !user.isAdmin;
  await user.save();

  await AdminLog.create({
    admin: adminId,
    action: user.isAdmin ? 'GRANT_ADMIN' : 'REVOKE_ADMIN',
    targetType: 'User',
    targetId: String(targetUserId),
    details: { newRole: user.isAdmin ? 'Admin' : 'User' },
    ip,
  });

  return {
    success: true,
    message: user.isAdmin ? 'User promoted to Admin' : 'Admin rights revoked',
    isAdmin: user.isAdmin,
  };
};

/**
 * 5. Toggle Premium Verification Badge
 */
const toggleUserVerification = async (adminId, targetUserId, ip = '') => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error('Target user not found');

  user.isAccountWithPremiumVerify = !user.isAccountWithPremiumVerify;
  if (user.isAccountWithPremiumVerify) {
    user.verifyAt = new Date();
  }
  await user.save();

  await AdminLog.create({
    admin: adminId,
    action: user.isAccountWithPremiumVerify ? 'GRANT_VERIFICATION' : 'REVOKE_VERIFICATION',
    targetType: 'User',
    targetId: String(targetUserId),
    details: { verified: user.isAccountWithPremiumVerify },
    ip,
  });

  return {
    success: true,
    message: user.isAccountWithPremiumVerify ? 'Verification badge granted' : 'Verification badge removed',
    isAccountWithPremiumVerify: user.isAccountWithPremiumVerify,
  };
};

/**
 * 6. Force Logout / Session Invalidation
 */
const forceLogoutUser = async (adminId, targetUserId, ip = '') => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error('Target user not found');

  user.refreshTokens = [];
  await user.save();

  await AdminLog.create({
    admin: adminId,
    action: 'FORCE_LOGOUT_USER',
    targetType: 'User',
    targetId: String(targetUserId),
    details: { message: 'All refresh tokens revoked' },
    ip,
  });

  return {
    success: true,
    message: 'User sessions successfully terminated',
  };
};

/**
 * 7. Delete User with Cascade Cleanup
 */
const deleteUserByAdmin = async (adminId, targetUserId, reason = '', ip = '') => {
  const user = await User.findById(targetUserId);
  if (!user) throw new Error('Target user not found');

  // Cascade delete
  await Promise.all([
    Post.deleteMany({ owner: targetUserId }),
    Comment.deleteMany({ owner: targetUserId }),
    Story.deleteMany({ owner: targetUserId }),
    Reel.deleteMany({ owner: targetUserId }),
    Community.deleteMany({ owner: targetUserId }),
    Notification.deleteMany({ $or: [{ sender: targetUserId }, { receiver: targetUserId }] }),
    Report.deleteMany({ $or: [{ owner: targetUserId }, { reportedUserId: targetUserId }] }),
    User.findByIdAndDelete(targetUserId),
  ]);

  await AdminLog.create({
    admin: adminId,
    action: 'DELETE_USER',
    targetType: 'User',
    targetId: String(targetUserId),
    details: { username: user.username, email: user.email, reason },
    ip,
  });

  return {
    success: true,
    message: 'User and associated data permanently deleted',
  };
};

/**
 * 8. Paginated Content Moderation (Posts, Comments, Communities, Reels)
 */
const getAdminContent = async ({ type = 'posts', page = 1, limit = 12, search = '' }) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  let total = 0;
  let items = [];

  if (type === 'posts') {
    const filter = search ? { text: { $regex: search, $options: 'i' } } : {};
    [total, items] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .populate('owner', 'username profileName profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);
  } else if (type === 'comments') {
    const filter = search ? { text: { $regex: search, $options: 'i' } } : {};
    [total, items] = await Promise.all([
      Comment.countDocuments(filter),
      Comment.find(filter)
        .populate('owner', 'username profileName profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);
  } else if (type === 'communities') {
    const filter = search ? { Name: { $regex: search, $options: 'i' } } : {};
    [total, items] = await Promise.all([
      Community.countDocuments(filter),
      Community.find(filter)
        .populate('owner', 'username profileName profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);
  } else if (type === 'reels') {
    const filter = search ? { caption: { $regex: search, $options: 'i' } } : {};
    [total, items] = await Promise.all([
      Reel.countDocuments(filter),
      Reel.find(filter)
        .populate('owner', 'username profileName profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);
  }

  return {
    success: true,
    type,
    items,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * 9. Content Deletion (Posts, Comments, Communities, Reels)
 */
const deleteContentItem = async (adminId, { type, id, reason = '', ip = '' }) => {
  if (type === 'post') {
    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });
  } else if (type === 'comment') {
    await Comment.findByIdAndDelete(id);
  } else if (type === 'community') {
    await Community.findByIdAndDelete(id);
  } else if (type === 'reel') {
    await Reel.findByIdAndDelete(id);
  } else {
    throw new Error('Invalid content type');
  }

  await AdminLog.create({
    admin: adminId,
    action: `DELETE_${type.toUpperCase()}`,
    targetType: type.charAt(0).toUpperCase() + type.slice(1),
    targetId: String(id),
    details: { reason },
    ip,
  });

  return {
    success: true,
    message: `${type} deleted successfully`,
  };
};

/**
 * 10. Platform-Wide Announcement Broadcast Job
 */
const broadcastAnnouncement = async (adminId, { title, content, ip = '' }) => {
  if (!content) throw new Error('Announcement message content is required');

  // Broadcast real-time message to all active sockets
  if (io) {
    io.emit('broadcast', {
      title: title || 'System Announcement',
      content,
      createdAt: new Date(),
    });
  }

  await AdminLog.create({
    admin: adminId,
    action: 'BROADCAST_ANNOUNCEMENT',
    targetType: 'System',
    targetId: null,
    details: { title, content },
    ip,
  });

  return {
    success: true,
    message: 'Announcement broadcasted successfully to all connected users',
  };
};

/**
 * 11. Paginated Audit Trail Logs
 */
const getAdminLogs = async ({ page = 1, limit = 20 }) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [total, logs] = await Promise.all([
    AdminLog.countDocuments(),
    AdminLog.find({})
      .populate('admin', 'username profileName profilePhoto email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  return {
    success: true,
    logs,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * 12. Automated Maintenance Jobs (Cleanup Expired Stories, Prune Stale Tokens)
 */
const runSystemCleanup = async (adminId, jobType = 'all', ip = '') => {
  let cleanedStories = 0;
  let prunedTokens = 0;

  if (jobType === 'stories' || jobType === 'all') {
    const expiredRes = await Story.updateMany(
      { expiresAt: { $lt: new Date() }, isArchived: false },
      { $set: { isArchived: true } }
    );
    cleanedStories = expiredRes.modifiedCount || 0;
  }

  if (jobType === 'tokens' || jobType === 'all') {
    const pruneRes = await User.updateMany(
      {},
      { $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } } }
    );
    prunedTokens = pruneRes.modifiedCount || 0;
  }

  await AdminLog.create({
    admin: adminId,
    action: 'RUN_SYSTEM_CLEANUP',
    targetType: 'System',
    targetId: null,
    details: { jobType, cleanedStories, prunedTokens },
    ip,
  });

  return {
    success: true,
    message: `Maintenance job completed: ${cleanedStories} stories archived, stale tokens purged across ${prunedTokens} accounts`,
    cleanedStories,
    prunedTokens,
  };
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  toggleUserAdminRole,
  toggleUserVerification,
  forceLogoutUser,
  deleteUserByAdmin,
  getAdminContent,
  deleteContentItem,
  broadcastAnnouncement,
  getAdminLogs,
  runSystemCleanup,
};
