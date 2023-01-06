/* Express */
import { Router } from 'express'

import AuthRoutes from './auth.routes'
import GraphqlRoutes from './graphql.routes'
import ApiIcvRoutes from './api-icv.routes' 
import RolesRoutes from './roles.routes'
import PermissionRoutes from './permisos.routes'
import UserRoutes from './user.routes'
import ReportsRoutes from './reports.routes'
import MachinesRoutes from './machines.routes'
import ExecutionReportsRoutes from './execution-reports.routes'
import AzureStorageRoutes from './azure-storage.routes'
import InternalMessagesRoutes from './internal-messages.routes'
import PdfMakerRoutes from './pdf-maker.routes'
import NotificationsRoutes from './notifications.routes'
import PatternsRoutes from './patterns.routes'

const router = new Router()

router.use('/auth', AuthRoutes)
router.use('/graphql', GraphqlRoutes)
router.use('/icv', ApiIcvRoutes)
router.use('/roles', RolesRoutes)
router.use('/permisos', PermissionRoutes)
router.use('/users', UserRoutes)
router.use('/reports', ReportsRoutes)
router.use('/machines', MachinesRoutes)
router.use('/execution-report', ExecutionReportsRoutes)
router.use('/azure-storage', AzureStorageRoutes)
router.use('/internalMessagesData', InternalMessagesRoutes)
router.use('/pdf-maker', PdfMakerRoutes)
router.use('/notifications', NotificationsRoutes)
router.use('/patterns', PatternsRoutes)

export default router
