import { Response } from 'express';
import { AdminService } from './admin.service.js';
import { sendSuccess } from '../../utils/index.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';

export class AdminController {
  static async getLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 15;
    const level = req.query.level as string | undefined;

    const result = await AdminService.getSystemLogs({ page, limit, level });
    sendSuccess(res, result.data, 'System logs retrieved successfully', 200, result.meta);
  }

  static async getActivityLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 15;

    const result = await AdminService.getActivityLogs({ page, limit });
    sendSuccess(res, result.data, 'Activity logs retrieved successfully', 200, result.meta);
  }

  static async getWorkers(req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await AdminService.getWorkerNodesStats();
    sendSuccess(res, result, 'Worker nodes stats retrieved successfully');
  }

  static async pauseQueue(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { name } = req.params;
    const result = await AdminService.pauseQueue(name);
    sendSuccess(res, result, `Queue ${name} paused successfully`);
  }

  static async resumeQueue(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { name } = req.params;
    const result = await AdminService.resumeQueue(name);
    sendSuccess(res, result, `Queue ${name} resumed successfully`);
  }
}
