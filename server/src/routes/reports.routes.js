import { Router } from 'express';
import { ReportsService } from '../services';

const router = new Router()

router.post('/createReport', ReportsService.createReport)
router.post('/editReport', ReportsService.editReport)
router.get('/getAllReports', ReportsService.getReports)
router.post('/getReportByIndex', ReportsService.getReportByIndex)
router.post('/getReportByGuide', ReportsService.getReportByGuide)
router.post('/getReportByType', ReportsService.getReportByType)
router.post('/getReportByState', ReportsService.getReportByState)

export default router