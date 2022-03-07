/* Express */
import { Router } from 'express'

/* Controllers */
import { internalMessagesServices } from '../services'

const router = new Router()

router.post('/sendMessage', internalMessagesServices.sendMessage)
router.post('/removeMessage', internalMessagesServices.removeMessage)
router.post('/get-messages-by-user', internalMessagesServices.getMessagesByUser)
router.get('/getAllMessages', internalMessagesServices.getAllMessages)

export default router