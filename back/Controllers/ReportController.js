const asyncHandler = require('express-async-handler')
const { Report, ValidateReport } = require('../Modules/Report')

// 📌 إضافة تقرير جديد
const addNewReport = asyncHandler(async (req, res) => {
  const { error } = ValidateReport(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const { text, postId, reason } = req.body

  // ✅ منع التكرار: نفس الشخص ما يعملش تقرير لنفس البوست مرتين
  const existing = await Report.findOne({ owner: req.user._id, postId })
  if (existing) {
    return res.status(400).json({ message: "You already reported this post." })
  }

  const report = new Report({
    text,
    reason,
    postId,
    owner: req.user._id,
    status: "pending"
  })

  await report.save()
  res.status(201).json({ message: "Report sent successfully", report })
})


// 📌 عرض جميع التقارير (مناسب للـ Admin Panel)
const getReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query
  const skip = (page - 1) * limit
  const sortOrder = order === 'desc' ? -1 : 1

  const reports = await Report.find({})
    .populate('owner', 'username profileName profilePhoto') // صاحب البلاغ
    .populate({
      path: 'postId', // المنشور المبلغ عنه
      select: 'text Photos owner',
      populate: {
        path: 'owner', // صاحب المنشور
        select: 'username profileName profilePhoto'
      }
    })
    .sort({ [sortBy]: sortOrder })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean()

  const totalReports = await Report.countDocuments()

  res.status(200).json({
    total: totalReports,
    page: Number(page),
    limit: Number(limit),
    reports,
  })
})


// 📌 تحديث حالة التقرير (reviewed / resolved / rejected)
const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" })
  }

  const report = await Report.findById(id)
  if (!report) {
    return res.status(404).json({ message: "Report not found" })
  }

  report.status = status
  await report.save()

  res.status(200).json({ message: "Report status updated", report })
})


// 📌 حذف تقرير
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
  if (!report) {
    return res.status(404).json({ message: 'Report not found' })
  }
  await Report.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Report removed' })
})

module.exports = { addNewReport, getReports, updateReportStatus, deleteReport }
