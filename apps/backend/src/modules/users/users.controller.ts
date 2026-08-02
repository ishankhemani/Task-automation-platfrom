import { Response } from 'express';
import { UsersService } from './users.service.js';
import { sendSuccess } from '../../utils/index.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';
import { Role } from '@prisma/client';

export class UsersController {
  static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const search = req.query.search as string | undefined;
    const role = req.query.role as Role | undefined;

    const result = await UsersService.getUsers({ page, limit, search, role });
    sendSuccess(res, result.data, 'Users retrieved successfully', 200, result.meta);
  }

  static async getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await UsersService.getUserById(id);
    sendSuccess(res, user, 'User details retrieved successfully');
  }

  static async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, role, status, avatar } = req.body;

    const updated = await UsersService.updateUser(id, { name, role, status, avatar });
    sendSuccess(res, updated, 'User updated successfully');
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      sendSuccess(res, null, 'No active session', 401);
      return;
    }
    const profile = await UsersService.getProfile(req.user.id);
    sendSuccess(res, profile, 'User profile retrieved successfully');
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      sendSuccess(res, null, 'No active session', 401);
      return;
    }
    const { name, avatar } = req.body;
    const updated = await UsersService.updateProfile(req.user.id, { name, avatar });
    sendSuccess(res, updated, 'Profile updated successfully');
  }

  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      sendSuccess(res, null, 'No active session', 401);
      return;
    }
    const { currentPassword, newPassword } = req.body;
    const result = await UsersService.changePassword(req.user.id, currentPassword, newPassword);
    sendSuccess(res, result, 'Password changed successfully');
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await UsersService.deleteUser(id);
    sendSuccess(res, null, 'User deleted successfully');
  }
}
