/* Router */
import { Router } from 'express'
import { ApiExternalController } from '../controller'

const router = new Router()

router.get('/insumosPorOM', ApiExternalController.insumosPorReporte)

export default router