import { Router } from 'express';
import { UserController } from '../controller'

const router = new Router()

router.post('/createUser', UserController.createUser)
router.post('/editUser', UserController.editUser)
router.get('/getUsers', UserController.readAllUsers)
router.post('/getUser', UserController.readUser)
router.post('/deleteUser', UserController.deleteUser)

export default router