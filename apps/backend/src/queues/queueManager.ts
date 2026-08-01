import { Queue } from 'bullmq';
import { QUEUES, IQueueStats } from '@task-platform/shared';
import { redisConnection } from './redis.js';
import { logger } from '../utils/index.js';

export const queues: Record<string, Queue> = {};

export function initializeQueues(): void {
  const queueNames = [QUEUES.DEFAULT, QUEUES.PRIORITY, QUEUES.SCHEDULED, QUEUES.WORKFLOW];

  queueNames.forEach((name) => {
    queues[name] = new Queue(name, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: { age: 3600 * 24, count: 1000 },
        removeOnFail: { age: 3600 * 24 * 7, count: 5000 },
      },
    });
    logger.info(`📋 Initialized BullMQ queue: ${name}`);
  });
}

export async function getAllQueueStats(): Promise<IQueueStats[]> {
  const statsList: IQueueStats[] = [];

  for (const [name, queue] of Object.entries(queues)) {
    const [waiting, active, completed, failed, delayed, isPaused] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.isPaused(),
    ]);

    statsList.push({
      queueName: name,
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused: isPaused,
    });
  }

  return statsList;
}

export async function closeQueues(): Promise<void> {
  for (const queue of Object.values(queues)) {
    await queue.close();
  }
  logger.info('🔌 Closed all BullMQ queue connections');
}
