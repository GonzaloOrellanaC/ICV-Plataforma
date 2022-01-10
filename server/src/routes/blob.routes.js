/* Router */
import { Router } from 'express'
import { BlobController } from '../controller'

const router = new Router()

router.post('/uploadImageProfile', BlobController.uploadProfileImage)
//router.get('/getSites', ApiIcv.readSites)


export default router