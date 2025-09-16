const asyncHandler = require('express-async-handler')
const { Report, ValidateReport } = require('../Modules/Report')

const addNewReport = asyncHandler(async (req, res) => {
    const { error } = ValidateReport(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const report = new Report({
        text: req.body.text,
        postId: req.body.postId,
        owner : req.user._id
    })
    await report.save()
    res.status(201).json({message : "Report Send Successfully"})
})

const getReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;
  const skip = (page - 1) * limit;
  const sortOrder = order === 'desc' ? -1 : 1;

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
    .lean();

  const totalReports = await Report.countDocuments();

  res.status(200).json({
    total: totalReports,
    page: Number(page),
    limit: Number(limit),
    reports,
  });
});


const deleteReport = asyncHandler(async (req, res) => { 
    const report = await Report.findById(req.params.id)
    if (!report) {
        res.status(404);
        throw new Error('Community not found');
    }
    await Report.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Community removed' })
})


module.exports = {getReports , addNewReport , deleteReport}