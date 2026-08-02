import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticate, roleGuard } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate, roleGuard([Role.ADMIN]));

router.get('/logs', asyncHandler(AdminController.getLogs));
router.get('/activity', asyncHandler(AdminController.getActivityLogs));
router.get('/workers', asyncHandler(AdminController.getWorkers));
router.post('/queues/:name/pause', asyncHandler(AdminController.pauseQueue));
router.post('/queues/:name/resume', asyncHandler(AdminController.resumeQueue));

export default router;
