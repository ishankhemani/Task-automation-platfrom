import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';

const router = Router();

router.use(authenticate);
router.get('/', asyncHandler(NotificationsController.getNotifications));
router.patch('/:id/read', asyncHandler(NotificationsController.markAsRead));
router.post('/read-all', asyncHandler(NotificationsController.markAllAsRead));

export default router;
