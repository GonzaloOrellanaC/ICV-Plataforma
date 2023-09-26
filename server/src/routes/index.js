/* Express */
import { Router } from 'express'

import AuthRoutes from './auth.routes'
import GraphqlRoutes from './graphql.routes'
import ApiIcvRoutes from './api-icv.routes' 
import RolesRoutes from './roles.routes'
import PermissionRoutes from './permisos.routes'
import UserRoutes from './user.routes'
import ReportsRoutes from './reports.routes'
import Reports2Routes from './reports2.routes'
import MachinesRoutes from './machines.routes'
import ExecutionReportsRoutes from './execution-reports.routes'
import ExecutionReports2Routes from './execution-reports2.routes'
import AzureStorageRoutes from './azure-storage.routes'
import InternalMessagesRoutes from './internal-messages.routes'
import PdfMakerRoutes from './pdf-maker.routes'
import NotificationsRoutes from './notifications.routes'
import PatternsRoutes from './patterns.routes'
import SitesRoutes from './sites.routes'
import CronRoutes from './cron.routes'
import NewsRoutes from './news.routes'
import ApiExternalRoutes from './api-external.routes'
import UnidadesRoutes from './unidades.routes'

const router = new Router()

router.use('/auth', AuthRoutes)
router.use('/graphql', GraphqlRoutes)
router.use('/icv', ApiIcvRoutes)
router.use('/roles', RolesRoutes)
router.use('/permisos', PermissionRoutes)
router.use('/users', UserRoutes)
router.use('/reports', ReportsRoutes)
router.use('/reports2', Reports2Routes)
router.use('/machines', MachinesRoutes)
router.use('/execution-report', ExecutionReportsRoutes)
router.use('/execution-report2', ExecutionReports2Routes)
router.use('/azure-storage', AzureStorageRoutes)
router.use('/internalMessagesData', InternalMessagesRoutes)
router.use('/pdf-maker', PdfMakerRoutes)
router.use('/notifications', NotificationsRoutes)
router.use('/patterns', PatternsRoutes)
router.use('/sites', SitesRoutes)
router.use('/cron', CronRoutes)
router.use('/news', NewsRoutes)
router.use('/api', ApiExternalRoutes)
router.use('/unidades/', UnidadesRoutes)

export default router
