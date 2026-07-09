const asyncHandler = require("express-async-handler");
const { User } = require("../Modules/User");
const { Post } = require("../Modules/Post");
const { Community } = require("../Modules/Community");
const { Music } = require("../Modules/Music");
const Reel = require("../Modules/Reel");
const { Report } = require("../Modules/Report");
const os = require("os");

const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalPosts, totalCommunities, todayPosts, totalMusic, totalReels, pendingReports] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Community.countDocuments(),
    Post.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
    Music.countDocuments(),
    Reel.countDocuments(),
    Report.countDocuments({ status: 'pending' })
  ]);

  // Fetch last 7 days of creations for dynamic charts
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [postsLast7Days, usersLast7Days, reelsLast7Days] = await Promise.all([
    Post.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean(),
    User.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean(),
    Reel.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt').lean()
  ]);

  // Construct chartData
  const chartData = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = daysOfWeek[d.getDay()];
    // Get date string formatted as YYYY-MM-DD in local time
    const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    chartData.push({
      name: dayName,
      date: localDateStr,
      posts: 0,
      users: 0,
      reels: 0,
    });
  }

  // Populate counts helper
  const getLocalDateString = (dateVal) => {
    const d = new Date(dateVal);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  postsLast7Days.forEach(post => {
    const dateStr = getLocalDateString(post.createdAt);
    const day = chartData.find(item => item.date === dateStr);
    if (day) day.posts++;
  });

  usersLast7Days.forEach(u => {
    const dateStr = getLocalDateString(u.createdAt);
    const day = chartData.find(item => item.date === dateStr);
    if (day) day.users++;
  });

  reelsLast7Days.forEach(r => {
    const dateStr = getLocalDateString(r.createdAt);
    const day = chartData.find(item => item.date === dateStr);
    if (day) day.reels++;
  });

  // Recent 5 Users
  const recentUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select('username profileName profilePhoto email createdAt')
    .lean();

  // Recent 5 Reports
  const recentReports = await Report.find({})
    .populate('owner', 'username profileName profilePhoto')
    .populate('reportedUserId', 'username profileName profilePhoto')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // System status metrics
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const memoryUsage = ((totalMem - freeMem) / totalMem * 100).toFixed(1);
  const cpuCores = os.cpus().length;
  const platform = os.platform();
  const osUptime = os.uptime();
  const processUptime = process.uptime();

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalPosts,
      totalCommunities,
      todayPosts,
      totalMusic,
      totalReels,
      pendingReports,
      chartData,
      recentUsers,
      recentReports,
      system: {
        memoryUsage,
        cpuCores,
        platform,
        osUptime,
        processUptime
      }
    }
  });
});

module.exports = { getAdminStats };