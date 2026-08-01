// BullMQ Worker initialization
import { Worker, Job } from 'bullmq';
import { QUEUES } from '@task-platform/shared';
import { redisConnection } from '../queues/redis.js';
import { logger } from '../utils/index.js';
import { config } from '../config/index.js';

const workers: Worker[] = [];

async function processJob(job: Job): Promise<unknown> {
  logger.info({ jobId: job.id, jobName: job.name, queueName: job.queueName }, 'Processing job');

  try {
    // Job processing logic will be implemented per-module
    switch (job.name) {
      case 'task:execute':
        logger.info({ jobId: job.id, data: job.data }, 'Executing task job');
        // Task execution logic will be added in task module
        break;

      case 'notification:send':
        logger.info({ jobId: job.id, data: job.data }, 'Sending notification');
        // Notification logic will be added in notification module
        break;

      case 'email:send':
        logger.info({ jobId: job.id, data: job.data }, 'Sending email');
        // Email sending logic will be added later
        break;

      default:
        logger.info({ jobId: job.id, jobName: job.name, data: job.data }, 'Processing generic job');
        break;
    }

    await job.updateProgress(100);
    return { success: true, processedAt: new Date().toISOString() };
  } catch (error) {
    logger.error({ jobId: job.id, error }, 'Job processing failed');
    throw error;
  }
}

function createWorker(queueName: string): Worker {
  const worker = new Worker(queueName, processJob, {
    connection: redisConnection,
    concurrency: config.bullmq.concurrency,
    limiter: {
      max: 10,
      duration: 1000,
    },
  });

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, queueName }, 'Job completed successfully');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, queueName, error: err.message }, 'Job failed');
  });

  worker.on('stalled', (jobId) => {
    logger.warn({ jobId, queueName }, 'Job stalled');
  });

  worker.on('error', (err) => {
    logger.error({ queueName, error: err.message }, 'Worker error');
  });

  return worker;
}

export function setupWorker(): void {
  const queueNames = [QUEUES.DEFAULT, QUEUES.PRIORITY, QUEUES.SCHEDULED, QUEUES.WORKFLOW];

  queueNames.forEach((name) => {
    const worker = createWorker(name);
    workers.push(worker);
    logger.info(`⚙️ Worker initialized for queue: ${name}`);
  });
}

export async function closeWorkers(): Promise<void> {
  for (const worker of workers) {
    await worker.close();
  }
  logger.info('🔌 Closed all BullMQ workers');
}

export { workers };
