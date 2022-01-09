import { Router } from 'express';
import { ApiIcv } from '../api-icv'

const router = new Router()

router.get('/getMachinesOfProject', ApiIcv.readMachinesOfProject);
router.get('/readAllMachines', ApiIcv.readAllMachinesFromDb);
router.post('/readMachineByEquid', ApiIcv.readMachinesByEquid);
router.post('/getAllMachinesByModel', ApiIcv.readMachinesByModel);
router.post('/getMachineByEquid', ApiIcv.getMachineByEquid);


export default router