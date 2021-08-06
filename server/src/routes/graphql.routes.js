/* Express */
import { Router } from 'express'

/* MiddleWare */
import { checkAuth } from '../middleware'

import { graphqlHTTP } from 'express-graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import { GraphqlController } from '../controller'

const router = new Router()

router.post('', checkAuth.required,
    graphqlUploadExpress({ maxFileSize: 1200000, maxFiles: 1 }),
    graphqlHTTP(GraphqlController.graphql)
)

export default router
