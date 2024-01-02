import { Router } from 'express';
import { ApiIcv } from '../api-icv'
import { MachinesController } from '../controller';

const router = new Router()

router.get('/getMachinesOfProject', ApiIcv.readMachinesOfProject);
router.get('/readAllMachines', ApiIcv.readAllMachinesFromDb);
router.post('/readMachineByEquid', ApiIcv.readMachinesByEquid);
router.post('/getAllMachinesByModel', ApiIcv.readMachinesByModel);
router.post('/getMachineByEquid', ApiIcv.getMachineByEquid);
router.post('/getMachineBySiteId', ApiIcv.getMachineBySiteId);
router.post('/saveMachineDataById', ApiIcv.saveMachineDataById)
router.post('/createMachine', MachinesController.createMachine)


export default router