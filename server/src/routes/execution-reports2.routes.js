/* Express */
import { Router } from 'express'

/* Controllers */
import { ExecutionReportsServices } from '../services'

const router = new Router()

router.post('/getExecutionReportById', ExecutionReportsServices.getExecutionReportById)
router.post('/saveExecutionReport', ExecutionReportsServices.saveExecutionReport)

export default router