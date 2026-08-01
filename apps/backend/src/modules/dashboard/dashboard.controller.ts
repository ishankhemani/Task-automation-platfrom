import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { DashboardService } from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.js';
import { Role } from '@prisma/client';

const service = new DashboardService();

export class DashboardController {
  static async getStats(req: AuthenticatedRequest, res: Response) {
    const user = { id: req.user!.id, role: req.user!.role as Role };
    const stats = await service.getDashboardStats(user);
    return sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
  }
}
