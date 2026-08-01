import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { AnalyticsService } from './analytics.service.js';
import { sendSuccess } from '../../utils/response.js';

const service = new AnalyticsService();

export class AnalyticsController {
  static async getMetrics(req: AuthenticatedRequest, res: Response) {
    const days = Number(req.query.days) || 7;
    const metrics = await service.getMetrics(days);
    return sendSuccess(res, metrics, 'Analytics metrics retrieved successfully');
  }
}
