/* Express */
import { Router } from 'express'

import AuthRoutes from './auth.routes'
import GraphqlRoutes from './graphql.routes'
import ApiIcvRoutes from './api-icv.routes' 

const router = new Router()

router.use('/auth', AuthRoutes)
router.use('/graphql', GraphqlRoutes)
router.use('/icv', ApiIcvRoutes)


export default router
