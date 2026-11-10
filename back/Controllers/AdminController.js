const asyncHandler = require("express-async-handler");
const adminService = require("../Services/adminService");

/**
 * @desc Get Platform Stats & System Telemetry
 * @route GET /api/admin/stats
 * @access Private (Admin only)
 */
const getAdminStats = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminStats();
  res.status(200).json(result);
});

/**
 * @desc Get Paginated Users List with Filters
 * @route GET /api/admin/users
 * @access Private (Admin only)
 */
const getAdminUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminUsers(req.query);
  res.status(200).json(result);
});

/**
 * @desc Update User Status (active, suspended, banned)
 * @route PUT /api/admin/users/:id/status
 * @access Private (Admin only)
 */
const updateUserStatus = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.updateUserStatus(adminId, req.params.id, {
    status: req.body.status,
    days: req.body.days,
    reason: req.body.reason,
    ip,
  });
  res.status(200).json(result);
});

/**
 * @desc Toggle Admin Role
 * @route PUT /api/admin/users/:id/role
 * @access Private (Admin only)
 */
const toggleUserAdminRole = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.toggleUserAdminRole(adminId, req.params.id, ip);
  res.status(200).json(result);
});

/**
 * @desc Toggle Verification Badge
 * @route PUT /api/admin/users/:id/verify
 * @access Private (Admin only)
 */
const toggleUserVerification = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.toggleUserVerification(adminId, req.params.id, ip);
  res.status(200).json(result);
});

/**
 * @desc Force Logout User
 * @route POST /api/admin/users/:id/force-logout
 * @access Private (Admin only)
 */
const forceLogoutUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.forceLogoutUser(adminId, req.params.id, ip);
  res.status(200).json(result);
});

/**
 * @desc Delete User by Admin
 * @route DELETE /api/admin/users/:id
 * @access Private (Admin only)
 */
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.deleteUserByAdmin(adminId, req.params.id, req.body.reason, ip);
  res.status(200).json(result);
});

/**
 * @desc Get Admin Content (Posts, Comments, Communities, Reels)
 * @route GET /api/admin/content
 * @access Private (Admin only)
 */
const getAdminContent = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminContent(req.query);
  res.status(200).json(result);
});

/**
 * @desc Delete Content Item
 * @route DELETE /api/admin/content/:type/:id
 * @access Private (Admin only)
 */
const deleteContentItem = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.deleteContentItem(adminId, {
    type: req.params.type,
    id: req.params.id,
    reason: req.body.reason,
    ip,
  });
  res.status(200).json(result);
});

/**
 * @desc Broadcast System Announcement
 * @route POST /api/admin/broadcast
 * @access Private (Admin only)
 */
const broadcastAnnouncement = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.broadcastAnnouncement(adminId, {
    title: req.body.title,
    content: req.body.content,
    ip,
  });
  res.status(200).json(result);
});

/**
 * @desc Get Admin Audit Trail Logs
 * @route GET /api/admin/logs
 * @access Private (Admin only)
 */
const getAdminLogs = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminLogs(req.query);
  res.status(200).json(result);
});

/**
 * @desc Run System Cleanup / Maintenance Job
 * @route POST /api/admin/system/cleanup
 * @access Private (Admin only)
 */
const runSystemCleanup = asyncHandler(async (req, res) => {
  const adminId = req.user._id || req.user.id;
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  const result = await adminService.runSystemCleanup(adminId, req.body.jobType, ip);
  res.status(200).json(result);
});

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
