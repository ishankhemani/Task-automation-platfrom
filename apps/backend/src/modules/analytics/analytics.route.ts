import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';

const router = Router();

router.use(authenticate);
router.get('/metrics', asyncHandler(AnalyticsController.getMetrics));

export default router;
