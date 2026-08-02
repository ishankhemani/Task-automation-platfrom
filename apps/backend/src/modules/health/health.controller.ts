import { Request, Response } from 'express';
import { prisma } from '../../database/index.js';
import { redisConnection } from '../../queues/redis.js';
import { getAllQueueStats } from '../../queues/index.js';
import { io } from '../../server.js';
import { logger } from '../../utils/index.js';

export const getGeneralHealth = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
};

export const getLiveness = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'live', timestamp: new Date().toISOString() });
};

export const getReadiness = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redisConnection.ping();
    res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: (error as Error).message });
  }
};

export const getDatabaseHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    res.status(200).json({ status: 'ok', latencyMs: latency });
  } catch (error) {
    logger.error({ error }, 'Database health check failed');
    res.status(503).json({ status: 'error', message: 'Database disconnected' });
  }
};

export const getRedisHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    const start = Date.now();
    await redisConnection.ping();
    const latency = Date.now() - start;
    res.status(200).json({ status: 'ok', latencyMs: latency });
  } catch (error) {
    logger.error({ error }, 'Redis health check failed');
    res.status(503).json({ status: 'error', message: 'Redis disconnected' });
  }
};

export const getWorkersHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getAllQueueStats();
    res.status(200).json({ status: 'ok', queues: stats });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Worker check failed' });
  }
};

export const getSocketHealth = (req: Request, res: Response): void => {
  try {
    if (!io) {
      res.status(503).json({ status: 'error', message: 'Socket.IO not initialized' });
      return;
    }
    const connections = io.engine.clientsCount;
    res.status(200).json({ status: 'ok', activeConnections: connections });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Socket check failed' });
  }
};
