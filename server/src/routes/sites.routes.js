import { Router } from 'express';
import { Site } from '../models';

const router = new Router()

router.post('/getSiteById', async (req, res) => {
    /* console.log(req.body) */
    /* const {_id} = req.body */
    const site = await Site.findById(req.body)
    /* console.log(site) */
    res.status(200).json({data: site})
})

router.get('/getSites', async (req, res) => {
    const sites = await Site.find()
    res.status(200).json({data: sites})
})

export default router