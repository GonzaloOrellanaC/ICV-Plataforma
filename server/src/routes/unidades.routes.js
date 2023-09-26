import { Router } from 'express';
import { Unidades } from '../models';

const router = new Router()

router.get('/getUnidades', async (req, res) => {
    try {
        const unidades = await Unidades.find()
        res.status(200).json({state: true, unidades: unidades})
    } catch (error) {
        res.status(400).json({state: false, data: error})
    }
});


export default router