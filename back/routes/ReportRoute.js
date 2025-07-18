const route = require('express').Router()
const { getReports, addNewReport, deleteReport } = require('../Controllers/ReportController')
const { verifyToken } = require('../Middelwares/verifyToken')
route.route('/')
    .get(getReports)

route.route('/add')
    .post(verifyToken , addNewReport)

route.route('/delete/:id')
    .delete(verifyToken , deleteReport)

module.exports = route