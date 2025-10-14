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
route.get('/', verifyToken, getReports);

// 🗑 Delete report (Admin only)
route.delete('/delete/:id', verifyToken,  deleteReport);

// 🔄 Update report status (Admin only)
route.patch('/status/:id', verifyToken, updateReportStatus);

// 🗑 Clear all reports (Admin only)
route.delete('/clear', verifyToken, verifyAdmin, clearAllReports);
module.exports = route;
