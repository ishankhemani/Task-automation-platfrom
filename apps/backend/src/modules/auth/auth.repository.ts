import { prisma } from '../../services/prisma.js';
import type { Prisma } from '@prisma/client';

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatar: true, isVerified: true, status: true },
    });
  }

  static async findUserByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, password: true, role: true, avatar: true, isVerified: true, status: true },
    });
  }

  static async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  static async updateUserPassword(userId: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  static async createRefreshToken(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  }

  static async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  static async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  static async revokeAllUserTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  static async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  static async createActivityLog(data: {
    userId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.activityLog.create({ data });
  }
}
