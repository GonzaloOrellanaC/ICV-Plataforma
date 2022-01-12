/* Express */
import { Router } from 'express'

/* Controllers */
import { ExecutionReportsServices } from '../services'

const router = new Router()

router.post('/getExecutionReportById', ExecutionReportsServices.getExecutionReportById)

export default router