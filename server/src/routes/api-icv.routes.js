/* Express */
import { ApiIcv } from '../api-icv'
/* Router */
import { Router } from 'express'

const router = new Router()

router.get('/fileMachines', ApiIcv.sendFileOfMachines)
router.get('/petitionFiles', ApiIcv.filesPetition)
router.post('/petitionFile', ApiIcv.filePetition)
router.get('/getSites', ApiIcv.readSites)

export default router
