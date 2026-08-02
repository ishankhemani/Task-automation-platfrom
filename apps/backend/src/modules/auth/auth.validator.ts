import { z } from 'zod';
import { AUTH_CONSTANTS } from './auth.constants.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(AUTH_CONSTANTS.MAX_NAME_LENGTH),
    email: z.string().email('Invalid email address'),
    password: z.string().min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`),
    role: z.enum(['ADMIN', 'USER', 'VIEWER']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, `New password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`),
  }),
});
