import { Router } from 'express';
import { UserController } from '../controller'

const router = new Router()

router.post('/createUser', UserController.createUser)
router.post('/editUser', UserController.editUser)
router.post('/getUsers', UserController.readAllUsers)
router.post('/getMantenedores', UserController.getMantenedores)
router.post('/getOperadores', UserController.getOperadores)
router.post('/getUserSign', UserController.getUserSign)
router.post('/getUser', UserController.readUser)
router.post('/deleteUser', UserController.deleteUser)
router.post('/findByRut', UserController.findByRut)
router.post('/findByRole', UserController.findByRole)

export default router