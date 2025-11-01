const route = require('express').Router();
const { 
  getReports, 
  addNewReport, 
  deleteReport, 
  updateReportStatus,
  clearAllReports
} = require('../Controllers/ReportController');

const { verifyToken, verifyAdmin } = require('../Middelwares/verifyToken');

// 📝 Add new report (any logged-in user can report)
route.post('/add', verifyToken, addNewReport);

// 📋 Get all reports (Admin only)
route.get('/', verifyAdmin, getReports);

// 🗑 Delete report (Admin only)
route.delete('/delete/:id', verifyAdmin,  deleteReport);

// 🔄 Update report status (Admin only)
route.patch('/status/:id', verifyAdmin, updateReportStatus);

// 🗑 Clear all reports (Admin only)
route.delete('/clear', verifyAdmin, verifyAdmin, clearAllReports);
module.exports = route;
