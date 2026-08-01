import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/index.js';
import { AUTH_MESSAGES } from './auth.constants.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';

export class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User registered successfully
   *       409:
   *         description: Email already exists
   */
  static async register(req: Request, res: Response): Promise<void> {
    const user = await AuthService.register(req.body, req.ip, req.get('user-agent'));
    sendSuccess(res, user, AUTH_MESSAGES.REGISTER_SUCCESS, 201);
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login with email and password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.login(req.body, req.ip, req.get('user-agent'));
    sendSuccess(res, result, AUTH_MESSAGES.LOGIN_SUCCESS);
  }

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     tags: [Auth]
   *     summary: Refresh access token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshTokenRequest'
   *     responses:
   *       200:
   *         description: Token refreshed
   *       401:
   *         description: Invalid refresh token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);
    sendSuccess(res, tokens, AUTH_MESSAGES.TOKEN_REFRESHED);
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     tags: [Auth]
   *     summary: Logout (revoke refresh token)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Logged out successfully
   */
  static async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const user = (req as AuthenticatedRequest).user;
    await AuthService.logout(refreshToken, user?.id, req.ip, req.get('user-agent'));
    sendSuccess(res, null, AUTH_MESSAGES.LOGOUT_SUCCESS);
  }

  /**
   * @swagger
   * /auth/logout-all:
   *   post:
   *     tags: [Auth]
   *     summary: Logout from all devices
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logged out from all devices
   */
  static async logoutAll(req: Request, res: Response): Promise<void> {
    const user = (req as AuthenticatedRequest).user;
    if (user) {
      await AuthService.logoutAll(user.id, req.ip, req.get('user-agent'));
    }
    sendSuccess(res, null, AUTH_MESSAGES.LOGOUT_ALL_SUCCESS);
  }

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     tags: [Auth]
   *     summary: Request password reset
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgotPasswordRequest'
   *     responses:
   *       200:
   *         description: Password reset link sent (if email exists)
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const result = await AuthService.forgotPassword(req.body);
    // In production, don't return the token; send via email instead
    sendSuccess(res, result || null, AUTH_MESSAGES.PASSWORD_RESET_SENT);
  }

  /**
   * @swagger
   * /auth/reset-password:
   *   post:
   *     tags: [Auth]
   *     summary: Reset password with token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPasswordRequest'
   *     responses:
   *       200:
   *         description: Password reset successfully
   *       401:
   *         description: Invalid or expired token
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    await AuthService.resetPassword(req.body);
    sendSuccess(res, null, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
  }

  /**
   * @swagger
   * /auth/change-password:
   *   post:
   *     tags: [Auth]
   *     summary: Change password (authenticated)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePasswordRequest'
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       401:
   *         description: Current password incorrect
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    const user = (req as AuthenticatedRequest).user;
    if (user) {
      await AuthService.changePassword(user.id, req.body, req.ip, req.get('user-agent'));
    }
    sendSuccess(res, null, AUTH_MESSAGES.PASSWORD_CHANGED);
  }

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Get current authenticated user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user profile
   *       401:
   *         description: Not authenticated
   */
  static async me(req: Request, res: Response): Promise<void> {
    const user = (req as AuthenticatedRequest).user;
    sendSuccess(res, user, 'Current user retrieved');
  }
}
