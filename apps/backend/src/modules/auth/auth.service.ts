import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import { config } from '../../config/index.js';
import { AuthRepository } from './auth.repository.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../errors/index.js';
import { AUTH_CONSTANTS, AUTH_MESSAGES } from './auth.constants.js';
import { logger } from '../../utils/index.js';
import { CacheService } from '../../cache/index.js';
import type { RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO, ChangePasswordDTO } from './auth.dto.js';

// Redis key prefix for password reset tokens
const PWD_RESET_PREFIX = 'pwd_reset:';

export class AuthService {
  static async register(dto: RegisterDTO, ipAddress?: string, userAgent?: string) {
    const existingUser = await AuthRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError(AUTH_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, AUTH_CONSTANTS.SALT_ROUNDS);

    // Public registration strictly creates standard USER accounts (Admin accounts are fixed/seeded)
    const userRole = dto.role === Role.ADMIN ? Role.USER : ((dto.role as Role) || Role.USER);

    const user = await AuthRepository.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: userRole,
    });

    logger.info({ userId: user.id, email: user.email }, 'User registered successfully');

    // Log activity
    await AuthRepository.createActivityLog({
      userId: user.id,
      action: 'AUTH_REGISTER',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async login(dto: LoginDTO, ipAddress?: string, userAgent?: string) {
    const user = await AuthRepository.findUserByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      logger.warn({ email: dto.email }, 'Failed login attempt');
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] }
    );

    await AuthRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS),
    });

    await AuthRepository.updateLastLogin(user.id);

    logger.info({ userId: user.id, email: user.email }, 'User logged in successfully');

    // Log activity
    await AuthRepository.createActivityLog({
      userId: user.id,
      action: 'AUTH_LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };
    } catch {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const storedToken = await AuthRepository.findRefreshToken(token);

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = await AuthRepository.findUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // Revoke old token (rotation)
    await AuthRepository.revokeRefreshToken(storedToken.id);

    // Generate new pair
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'] }
    );

    await AuthRepository.createRefreshToken({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS),
    });

    logger.info({ userId: user.id }, 'Token refreshed successfully');

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(token: string, userId?: string, ipAddress?: string, userAgent?: string) {
    const storedToken = await AuthRepository.findRefreshToken(token);
    if (storedToken) {
      await AuthRepository.revokeRefreshToken(storedToken.id);
    }

    logger.info({ userId }, 'User logged out');

    if (userId) {
      await AuthRepository.createActivityLog({
        userId,
        action: 'AUTH_LOGOUT',
        entity: 'User',
        entityId: userId,
        ipAddress,
        userAgent,
      });
    }
  }

  static async logoutAll(userId: string, ipAddress?: string, userAgent?: string) {
    await AuthRepository.revokeAllUserTokens(userId);

    logger.info({ userId }, 'User logged out from all devices');

    await AuthRepository.createActivityLog({
      userId,
      action: 'AUTH_LOGOUT_ALL',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  static async forgotPassword(dto: ForgotPasswordDTO) {
    const user = await AuthRepository.findUserByEmail(dto.email);

    // Always return the same message regardless of whether user exists (security best practice)
    if (!user) {
      logger.info({ email: dto.email }, 'Forgot password requested for non-existent email');
      return;
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store reset token in Redis with TTL (production-safe, survives restarts & scales)
    const ttlSeconds = Math.floor(AUTH_CONSTANTS.PASSWORD_RESET_EXPIRY_MS / 1000);
    await CacheService.set(`${PWD_RESET_PREFIX}${hashedToken}`, { userId: user.id }, ttlSeconds);

    logger.info({ userId: user.id, email: dto.email }, 'Password reset token generated');

    // Log activity
    await AuthRepository.createActivityLog({
      userId: user.id,
      action: 'AUTH_FORGOT_PASSWORD',
      entity: 'User',
      entityId: user.id,
    });

    // In production: send email with link containing resetToken
    // e.g. https://yourapp.com/reset-password?token=<resetToken>
    // For development: token is logged server-side only (not exposed in API response)
    logger.info({ resetToken }, '[DEV] Password reset token (wire up email provider for production)');

    return { message: 'If this email is registered, a password reset link has been sent.' };
  }

  static async resetPassword(dto: ResetPasswordDTO) {
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');
    const resetData = await CacheService.get<{ userId: string }>(`${PWD_RESET_PREFIX}${hashedToken}`);

    if (!resetData) {
      // Token not found or already expired (Redis TTL handled expiry automatically)
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.SALT_ROUNDS);
    await AuthRepository.updateUserPassword(resetData.userId, hashedPassword);

    // Clean up the used token from Redis (prevent token reuse)
    await CacheService.delete(`${PWD_RESET_PREFIX}${hashedToken}`);

    // Revoke all existing refresh tokens for security
    await AuthRepository.revokeAllUserTokens(resetData.userId);

    logger.info({ userId: resetData.userId }, 'Password reset successfully');

    // Log activity
    await AuthRepository.createActivityLog({
      userId: resetData.userId,
      action: 'AUTH_RESET_PASSWORD',
      entity: 'User',
      entityId: resetData.userId,
    });
  }

  static async changePassword(userId: string, dto: ChangePasswordDTO, ipAddress?: string, userAgent?: string) {
    const user = await AuthRepository.findUserByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CURRENT_PASSWORD);
    }

    // Ensure new password differs from current
    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new ConflictError(AUTH_MESSAGES.SAME_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.SALT_ROUNDS);
    await AuthRepository.updateUserPassword(userId, hashedPassword);

    // Revoke all refresh tokens on password change for security
    await AuthRepository.revokeAllUserTokens(userId);

    logger.info({ userId }, 'Password changed successfully');

    // Log activity
    await AuthRepository.createActivityLog({
      userId,
      action: 'AUTH_CHANGE_PASSWORD',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }
}
