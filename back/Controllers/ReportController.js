const asyncHandler = require('express-async-handler');
const { Report, ValidateReport } = require('../Modules/Report');

// ==============================
// Helper لتحديد الحقل الصحيح حسب النوع
// ==============================
const getTargetField = (reportedOnType) => {
  switch (reportedOnType) {
    case "post": return "postId";
    case "comment": return "commentId";
    case "user": return "reportedUserId";
    default: return null;
  }
};

// ==============================
// إضافة تقرير جديد
// ==============================
const addNewReport = asyncHandler(async (req, res) => {
  const { error } = ValidateReport(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { text, reason, reportedOnType, postId, commentId, reportedUserId } = req.body;

  // تحديد الحقل الصحيح
  const targetField = getTargetField(reportedOnType);
  if (!targetField) return res.status(400).json({ message: "Invalid reportedOnType" });

  const targetId = { postId, commentId, reportedUserId }[targetField];

  // منع التكرار من نفس الشخص على نفس الهدف
  const existing = await Report.findOne({ owner: req.user._id, reportedOnType, [targetField]: targetId });
  if (existing) return res.status(400).json({ message: "You already reported this item." });

  // تعيين درجة الخطورة تلقائيًا (يمكنك تعديل القيم حسب النظام)
  let severity = "low";
  if (["violence", "nudity", "hate"].includes(reason)) severity = "high";
  if (reason === "harassment") severity = "medium";

  const report = new Report({
    text,
    reason,
    owner: req.user._id,
    reportedOnType,
    severity,
    [targetField]: targetId,
    status: "pending"
  });

  await report.save();

  res.status(201).json({ message: "Report sent successfully", report });
});

// ==============================
// عرض جميع التقارير (Admin Panel)
// ==============================
const getReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;
  const skip = (page - 1) * limit;
  const sortOrder = order === 'desc' ? -1 : 1;

  const reports = await Report.find({})
    .populate('owner', 'username profileName profilePhoto')
    .populate({
      path: 'postId',
      select: 'text Photos owner',
      populate: { path: 'owner', select: 'username profileName profilePhoto' }
    })
    .populate({
      path: 'commentId',
      select: 'text owner',
      populate: { path: 'owner', select: 'username profileName profilePhoto' }
    })
    .populate('reportedUserId', 'username profileName profilePhoto')
    .sort({ [sortBy]: sortOrder })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  const totalReports = await Report.countDocuments();

  res.status(200).json({
    total: totalReports,
    page: Number(page),
    limit: Number(limit),
    reports
  });
});

// ==============================
// تحديث حالة التقرير
// ==============================
const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reviewNotes } = req.body;

  if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const report = await Report.findById(id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  report.status = status;
  report.reviewNotes = reviewNotes || report.reviewNotes;
  report.reviewer = req.user._id;
  if (status === "resolved") report.resolvedAt = new Date();

  await report.save();

  res.status(200).json({ message: "Report updated successfully", report });
});

// ==============================
// حذف تقرير
// ==============================
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  await Report.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Report removed' });
});

module.exports = {
  addNewReport,
  getReports,
  updateReportStatus,
  deleteReport
};
