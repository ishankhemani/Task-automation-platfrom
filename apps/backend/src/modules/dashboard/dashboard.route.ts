import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';

const router = Router();

router.use(authenticate);
router.get('/stats', asyncHandler(DashboardController.getStats));

export default router;
