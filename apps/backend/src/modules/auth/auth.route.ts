import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/index.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validator.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), asyncHandler(AuthController.register));
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login));
router.post('/refresh-token', validate(refreshTokenSchema), asyncHandler(AuthController.refreshToken));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(AuthController.forgotPassword));
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(AuthController.resetPassword));

// Protected routes (require authentication)
router.post('/logout', authenticate, validate(logoutSchema), asyncHandler(AuthController.logout));
router.post('/logout-all', authenticate, asyncHandler(AuthController.logoutAll));
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(AuthController.changePassword));
router.get('/me', authenticate, asyncHandler(AuthController.me));

export default router;
