import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { QueueService } from './queue.service.js';
import { sendSuccess } from '../../utils/response.js';

const service = new QueueService();

export class QueueController {
  static async getStats(_req: AuthenticatedRequest, res: Response) {
    const stats = await service.getQueueStats();
    return sendSuccess(res, stats, 'Queue metrics retrieved successfully');
  }

  static async getWorkers(_req: AuthenticatedRequest, res: Response) {
    const workers = await service.getWorkerStats();
    return sendSuccess(res, workers, 'Worker node stats retrieved successfully');
  }
}
