import { Router } from 'express';
import { PermisosServices } from '../services'

const router = new Router()

router.get('/getPermisos', PermisosServices.getPermisos)
router.post('/getPermisosByUser', PermisosServices.getPermisosByUser)

export default router