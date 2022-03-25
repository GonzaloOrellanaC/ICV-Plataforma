import { Router } from 'express';
import { NotificationService } from '../services';

const router = new Router()

router.post('/getNotificationsById', NotificationService.getNotificationsById);
router.post('/actualiceNotificationState', NotificationService.actualiceNotificationState);


export default router