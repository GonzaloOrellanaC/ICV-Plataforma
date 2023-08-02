/* Express */
import { Router } from 'express'

/* Controllers */
import { ExecutionReportsServices } from '../services'

const router = new Router()

router.post('/getExecutionReportById', ExecutionReportsServices.getExecutionReportById)
router.post('/saveExecutionReport', ExecutionReportsServices.saveExecutionReport)
router.post('/createExecutionReport', ExecutionReportsServices.createExecutionReport)


export default router