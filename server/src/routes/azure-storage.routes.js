import { Router } from 'express';
import { AzureServices } from '../services';

const router = new Router()

router.post('/uploadImageProfile', AzureServices.uploadImageProfile)
router.post('/uploadImageReport', AzureServices.uploadImageReport)
router.post('/uploadImage', AzureServices.uploadImage)
router.post('/uploadVideo', AzureServices.uploadVideo)
router.post('/uploadMachineImage', AzureServices.uploadMachineImage)

export default router