import { Router } from 'express';
import { RolesServices} from '../services'

const router = new Router()

router.get('/getRoles', RolesServices.getRoles)

export default router