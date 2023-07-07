import { Router } from 'express';
import { Cron } from '../models';
import accessControlServices from '../services/accessControl.services';

const router = new Router()

router.post('/updateTimeMachines', async (req, res) => {
    const timeMachines = req.body.timeMachines
    const response = await Cron.findByIdAndUpdate('649ebc8e2231b2ecbb2894ad', {timeMachines: timeMachines})
    if (response) {
        accessControlServices.stopTimeMachinesCron()
        setTimeout(() => {
            accessControlServices.initTimeMachinesCron()
        }, 1000);
        res.state(200).json({message: 'Tiempo de actualización de máquinas actualizado.'})
    }
})

router.post('/updateTimePautas', async (req, res) => {
    const timePautas = req.body.timePautas
    const response = await Cron.findByIdAndUpdate('649ebc8e2231b2ecbb2894ad', {timePautas: timePautas})
    return response
})

export default router