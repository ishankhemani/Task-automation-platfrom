import { Router, Request, Response } from 'express';
import { IQueueStats } from '@task-platform/shared';
import { sendSuccess, sendError, asyncHandler } from '../utils/index.js';
import { prisma } from '../services/index.js';
import { checkRedisHealth, getAllQueueStats } from '../queues/index.js';

export const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    let dbStatus = 'OFFLINE';
    let redisStatus = 'OFFLINE';
    let queueStats: IQueueStats[] = [];

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'HEALTHY';
    } catch {
      dbStatus = 'UNHEALTHY';
    }

    try {
      const isRedisOk = await checkRedisHealth();
      redisStatus = isRedisOk ? 'HEALTHY' : 'UNHEALTHY';
      if (isRedisOk) {
        queueStats = await getAllQueueStats();
      }
    } catch {
      redisStatus = 'UNHEALTHY';
    }

    const isSystemHealthy = dbStatus === 'HEALTHY' && redisStatus === 'HEALTHY';
    const statusCode = isSystemHealthy ? 200 : 503;

    const healthData = {
      status: isSystemHealthy ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
      queues: queueStats,
    };

    if (!isSystemHealthy) {
      return sendError(res, 'Service degraded', statusCode, null, healthData);
    }

    return sendSuccess(res, healthData, 'System is healthy');
  })
);
