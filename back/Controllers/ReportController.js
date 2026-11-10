const asyncHandler = require('express-async-handler');
const reportService = require('../Services/reportService');

const sendServiceResult = (res, result) => res.status(result.status).json(result.body);

const addNewReport = asyncHandler(async (req, res) => {
  const result = await reportService.addNewReport(req.body, req.user._id);
  return sendServiceResult(res, result);
});

const getReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getReports(req.query);
  res.status(200).json(reports);
});

const updateReportStatus = asyncHandler(async (req, res) => {
  const result = await reportService.updateReportStatus(req.params.id, req.body, req.user._id);
  return sendServiceResult(res, result);
});

const deleteReport = asyncHandler(async (req, res) => {
  const result = await reportService.deleteReport(req.params.id);
  return sendServiceResult(res, result);
});

const clearAllReports = asyncHandler(async (req, res) => {
  const result = await reportService.clearAllReports();
  return sendServiceResult(res, result);
});

module.exports = {
  addNewReport,
  getReports,
  updateReportStatus,
  deleteReport,
  clearAllReports
};
