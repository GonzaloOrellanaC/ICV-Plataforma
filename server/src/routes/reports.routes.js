import { Router } from 'express';
import { ReportsService } from '../services';

const router = new Router()

router.post('/createReport', ReportsService.createReport)
router.post('/editReport', ReportsService.editReport)
router.post('/editReportById', ReportsService.editReportById)
router.post('/editReportFromAudit', ReportsService.editReportFromAudit)
router.post('/deleteReport', ReportsService.deleteReport)
router.get('/getAllReports', ReportsService.getReports)
router.post('/getReportById', ReportsService.getReportById)
router.post('/getReportByIndex', ReportsService.getReportByIndex)
router.post('/getReportByGuide', ReportsService.getReportByGuide)
router.post('/getReportByType', ReportsService.getReportByType)
router.post('/getReportByState', ReportsService.getReportByState)
router.post('/getReportsByUser', ReportsService.getReportsByUser)
router.post('/findMyAssignations', ReportsService.findMyAssignations)
router.post('/getReportByIdpm', ReportsService.getReportByIdpm)
router.post('/getReportByEquid', ReportsService.getReportByEquid)
router.post('/getReportsByDateRange', ReportsService.getReportsByDateRange)
router.get('/getTotalReportsToIndex', ReportsService.getTotalReportsToIndex)
router.get('/countTotalReportsLength', ReportsService.countTotalReportsLength)
router.get('/countTotalActivesReportsLength', ReportsService.countTotalActivesReportsLength)



export default router