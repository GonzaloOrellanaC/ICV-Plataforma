/* Express */
import { Router } from 'express'

import AuthRoutes from './auth.routes'
import GraphqlRoutes from './graphql.routes'

const router = new Router()

router.use('/auth', AuthRoutes)
router.use('/graphql', GraphqlRoutes)

export default router
