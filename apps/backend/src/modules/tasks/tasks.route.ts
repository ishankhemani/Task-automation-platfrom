import { Router } from 'express';
import { TasksController } from './tasks.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/index.js';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from './tasks.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(taskQuerySchema), asyncHandler(TasksController.getTasks));
router.post('/', validate(createTaskSchema), asyncHandler(TasksController.createTask));
router.get('/:id', asyncHandler(TasksController.getTaskById));
router.patch('/:id', validate(updateTaskSchema), asyncHandler(TasksController.updateTask));
router.delete('/:id', asyncHandler(TasksController.deleteTask));
router.post('/:id/cancel', asyncHandler(TasksController.cancelTask));
router.post('/:id/retry', asyncHandler(TasksController.retryTask));
router.post('/:id/duplicate', asyncHandler(TasksController.duplicateTask));

export default router;
