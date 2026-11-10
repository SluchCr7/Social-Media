const { Report, ValidateReport } = require('../Modules/Report');

const getTargetField = (reportedOnType) => {
  switch (reportedOnType) {
    case "post": return "postId";
    case "comment": return "commentId";
    case "user": return "reportedUserId";
    default: return null;
  }
};

const addNewReport = async (data, userId) => {
  const { error } = ValidateReport(data);
  if (error) return { status: 400, body: { message: error.details[0].message } };

  const { text, reason, reportedOnType, postId, commentId, reportedUserId } = data;
  const targetField = getTargetField(reportedOnType);
  if (!targetField) return { status: 400, body: { message: "Invalid reportedOnType" } };

  const targetId = { postId, commentId, reportedUserId }[targetField];
  const existing = await Report.findOne({ owner: userId, reportedOnType, [targetField]: targetId });
  if (existing) return { status: 400, body: { message: "You already reported this item." } };

  let severity = "low";
  if (["violence", "nudity", "hate"].includes(reason)) severity = "high";
  if (reason === "harassment") severity = "medium";

  const report = new Report({
    text,
    reason,
    owner: userId,
    reportedOnType,
    severity,
    [targetField]: targetId,
    status: "pending"
  });

  await report.save();
  return { status: 201, body: { message: "Report sent successfully", report } };
};

const getReports = async (query) => {
  const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = query;
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.max(1, Number(limit) || 20);
  const skip = (pageNumber - 1) * limitNumber;
  const sortOrder = order === 'desc' ? -1 : 1;
  const filters = {};
  if (["pending", "reviewed", "rejected", "resolved"].includes(query.status)) {
    filters.status = query.status;
  }
  if (["post", "comment", "user"].includes(query.reportedOnType)) {
    filters.reportedOnType = query.reportedOnType;
  }
  if (["low", "medium", "high", "critical"].includes(query.severity)) {
    filters.severity = query.severity;
  }

  const reports = await Report.find(filters)
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
    .limit(limitNumber)
    .lean();

  const totalReports = await Report.countDocuments(filters);

  return {
    total: totalReports,
   page: pageNumber,
   limit: limitNumber,
    reports
  };
};

const updateReportStatus = async (id, data, userId) => {
  const { status, reviewNotes } = data;

  if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
    return { status: 400, body: { message: "Invalid status value" } };
  }

  const report = await Report.findById(id);
  if (!report) return { status: 404, body: { message: "Report not found" } };

  report.status = status;
  report.reviewNotes = reviewNotes || report.reviewNotes;
  report.reviewer = userId;
  if (status === "resolved") report.resolvedAt = new Date();

  await report.save();
  return { status: 200, body: { message: "Report updated successfully", report } };
};

const deleteReport = async (id) => {
  const report = await Report.findById(id);
  if (!report) return { status: 404, body: { message: 'Report not found' } };

  await Report.findByIdAndDelete(id);
  return { status: 200, body: { message: 'Report removed' } };
};

const clearAllReports = async () => {
  await Report.deleteMany();
  return { status: 200, body: { success: true, message: "All reports cleared" } };
};

module.exports = {
  addNewReport,
  getReports,
  updateReportStatus,
  deleteReport,
  clearAllReports
};
