/* Express */
import { Router } from 'express'

/* Controllers */
import { AuthController } from '../controller'

/* MiddleWare */
import { checkAuth } from '../middleware'

const router = new Router()

router.post('/login', AuthController.login)
router.post('/loginRut', AuthController.loginRut)
/* router.post('/logout', AuthController.logout) */
router.post('/register', checkAuth.optional, AuthController.register)
router.post('/forgotpassword', checkAuth.optional, AuthController.forgotPassword)
router.post('/resetpassword/:token', checkAuth.reset, AuthController.resetPassword)

export default router
