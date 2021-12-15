import { Router } from 'express';
import { ApiIcv } from '../api-icv'

const router = new Router()

router.get('/getMachinesOfProject', ApiIcv.readMachinesOfProject);
router.get('/readAllMachines', ApiIcv.readAllMachinesFromDb);
router.post('/getAllMachinesByModel', ApiIcv.readMachinesByModel);


export default router