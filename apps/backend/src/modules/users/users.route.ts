import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';

const router = Router();

router.use(authenticate);

// User profile endpoints (authenticated user)
router.get('/me', asyncHandler(UsersController.getProfile));
router.patch('/me/profile', asyncHandler(UsersController.updateProfile));
router.patch('/me/password', asyncHandler(UsersController.changePassword));

// Admin-only endpoints
router.get('/', requireRole(['ADMIN']), asyncHandler(UsersController.getUsers));
router.get('/:id', asyncHandler(UsersController.getUserById));
router.patch('/:id', requireRole(['ADMIN']), asyncHandler(UsersController.updateUser));
router.delete('/:id', requireRole(['ADMIN']), asyncHandler(UsersController.deleteUser));

export default router;
