const route = require('express').Router();
const {
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
} = require('../Controllers/AdminController');

const { verifyAdmin } = require('../Middelwares/verifyToken');

// All Admin routes require valid authentication and administrator privileges
route.use(verifyAdmin);

// Platform Overview & Telemetry
route.get('/stats', getAdminStats);

// User Management Jobs
route.get('/users', getAdminUsers);
route.put('/users/:id/status', updateUserStatus);
route.put('/users/:id/role', toggleUserAdminRole);
route.put('/users/:id/verify', toggleUserVerification);
route.post('/users/:id/force-logout', forceLogoutUser);
route.delete('/users/:id', deleteUserByAdmin);

// Content Moderation Jobs
route.get('/content', getAdminContent);
route.delete('/content/:type/:id', deleteContentItem);

// System Communications & Announcements
route.post('/broadcast', broadcastAnnouncement);

// Audit Trail & Activity Logs
route.get('/logs', getAdminLogs);

// System Maintenance & Cleanup Jobs
route.post('/system/cleanup', runSystemCleanup);

module.exports = route;
