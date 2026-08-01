import { Router } from 'express';
import { QueueController } from './queue.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';

const router = Router();

router.use(authenticate);
router.get('/stats', asyncHandler(QueueController.getStats));
router.get('/workers', asyncHandler(QueueController.getWorkers));

export default router;
