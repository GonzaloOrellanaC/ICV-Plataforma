/* Express */
import { Router } from 'express'

import AuthRoutes from './auth.routes'
import GraphqlRoutes from './graphql.routes'
import ApiIcvRoutes from './api-icv.routes' 
import RolesRoutes from './roles.routes'
import PermisosRoutes from './permisos.routes'
import UserRoutes from './user.routes'
import ReportsRoutes from './reports.routes'

const router = new Router()

router.use('/auth', AuthRoutes)
router.use('/graphql', GraphqlRoutes)
router.use('/icv', ApiIcvRoutes)
router.use('/roles', RolesRoutes)
router.use('/permisos', PermisosRoutes)
router.use('/users', UserRoutes)
router.use('/reports', ReportsRoutes)

export default router
