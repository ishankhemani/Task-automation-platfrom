import { Worker, Job } from 'bullmq';
import { QUEUES, SOCKET_EVENTS } from '@task-platform/shared';
import { redisConnection } from '../queues/redis.js';
import { logger } from '../utils/index.js';
import { config } from '../config/index.js';
import { prisma } from '../database/index.js';
import { TaskStatus, NotificationType } from '@prisma/client';
import { CacheService } from '../cache/index.js';
import { getSocketServer } from '../sockets/socketServer.js';
import crypto from 'crypto';

const workers: Worker[] = [];
const WORKER_ID = `worker-${crypto.randomUUID()}`;

async function processJob(job: Job): Promise<unknown> {
  const { taskId, title, payload } = job.data as { taskId: string; title: string; payload?: unknown };
  const startTime = Date.now();
  logger.info({ workerId: WORKER_ID, jobId: job.id, taskId, queueName: job.queueName }, 'Worker picking up job for execution');

  const io = getSocketServer();

  if (taskId) {
    // 1. Set status to PROCESSING
    await prisma.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.PROCESSING },
    }).catch(() => null);

    await prisma.taskHistory.create({
      data: {
        taskId,
        oldStatus: TaskStatus.PENDING,
        newStatus: TaskStatus.PROCESSING,
        notes: `Worker node assigned execution job ${job.id}`,
      },
    }).catch(() => null);

    await prisma.taskLog.create({
      data: {
        taskId,
        level: 'info',
        message: `Task execution started on queue ${job.queueName}`,
        metadata: JSON.parse(JSON.stringify({ jobId: job.id, payload: payload ?? null, workerId: WORKER_ID })),
      },
    }).catch(() => null);

    // Broadcast socket event: job:started
    io?.emit(SOCKET_EVENTS.JOB_PROGRESS, {
      taskId,
      jobId: job.id,
      progress: 10,
      status: TaskStatus.PROCESSING,
    });
  }

  try {
    // Initial queue pickup pause to allow PENDING state visibility
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate realistic multi-step processing with live socket progress reporting
    await job.updateProgress(20);
    io?.emit(SOCKET_EVENTS.JOB_PROGRESS, { taskId, jobId: job.id, progress: 20, status: TaskStatus.PROCESSING });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    await job.updateProgress(40);
    io?.emit(SOCKET_EVENTS.JOB_PROGRESS, { taskId, jobId: job.id, progress: 40, status: TaskStatus.PROCESSING });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    await job.updateProgress(60);
    io?.emit(SOCKET_EVENTS.JOB_PROGRESS, { taskId, jobId: job.id, progress: 60, status: TaskStatus.PROCESSING });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    await job.updateProgress(80);
    io?.emit(SOCKET_EVENTS.JOB_PROGRESS, { taskId, jobId: job.id, progress: 80, status: TaskStatus.PROCESSING });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    await job.updateProgress(100);

    const executionTime = Date.now() - startTime;
    logger.info({ workerId: WORKER_ID, jobId: job.id, taskId, queueName: job.queueName, executionTime, status: 'SUCCESS' }, 'Worker job execution completed');

    if (taskId) {
      // 2. Set status to COMPLETED
      const task = await prisma.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.COMPLETED },
      });

      await prisma.taskHistory.create({
        data: {
          taskId,
          oldStatus: TaskStatus.PROCESSING,
          newStatus: TaskStatus.COMPLETED,
          notes: `Task completed successfully by worker job ${job.id}`,
        },
      }).catch(() => null);

      await prisma.taskLog.create({
        data: {
          taskId,
          level: 'info',
          message: 'Task processing completed successfully',
          metadata: { jobId: job.id, executionTime },
        },
      }).catch(() => null);

      // Create Notification for creator
      if (task.createdBy) {
        await prisma.notification.create({
          data: {
            userId: task.createdBy,
            taskId,
            type: NotificationType.SUCCESS,
            title: 'Task Completed',
            message: `Task "${title || task.title}" finished execution successfully.`,
          },
        }).catch(() => null);
      }

      // Invalidate dashboard metrics cache
      await CacheService.delete('dashboard:stats').catch(() => null);

      // Broadcast socket event: job:completed
      io?.emit(SOCKET_EVENTS.JOB_COMPLETED, {
        taskId,
        jobId: job.id,
        status: TaskStatus.COMPLETED,
        result: { success: true, finishedAt: new Date().toISOString() },
      });
    }

    return { success: true, processedAt: new Date().toISOString(), executionTime };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errMessage = error instanceof Error ? error.message : 'Unknown execution failure';
    const errStack = error instanceof Error ? error.stack : undefined;
    logger.error({ workerId: WORKER_ID, jobId: job.id, taskId, queueName: job.queueName, error: errMessage, errorStack: errStack, executionTime, status: 'ERROR' }, 'Worker job execution failed');

    if (taskId) {
      const task = await prisma.task.findUnique({ where: { id: taskId } }).catch(() => null);
      
      // Update retry count and status
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.FAILED,
          retryCount: { increment: 1 },
        },
      }).catch(() => null);

      if (updated) {
        await prisma.taskHistory.create({
          data: {
            taskId,
            oldStatus: TaskStatus.PROCESSING,
            newStatus: TaskStatus.FAILED,
            notes: `Execution failed: ${errMessage}`,
          },
        }).catch(() => null);

        await prisma.taskLog.create({
          data: {
            taskId,
            level: 'error',
            message: `Execution error: ${errMessage}`,
            metadata: { jobId: job.id, attemptsMade: job.attemptsMade },
          },
        }).catch(() => null);

        if (task?.createdBy) {
          await prisma.notification.create({
            data: {
              userId: task.createdBy,
              taskId,
              type: NotificationType.ERROR,
              title: 'Task Execution Failed',
              message: `Task "${task.title}" encountered an error: ${errMessage}`,
            },
          }).catch(() => null);
        }

        await CacheService.delete('dashboard:stats').catch(() => null);

        io?.emit(SOCKET_EVENTS.JOB_FAILED, {
          taskId,
          jobId: job.id,
          status: TaskStatus.FAILED,
          error: errMessage,
        });
      }
    }

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
    logger.info({ jobId: job.id, queueName }, 'BullMQ Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, queueName, error: err.message }, 'BullMQ Job failed');
  });

  worker.on('stalled', (jobId) => {
    logger.warn({ jobId, queueName }, 'BullMQ Job stalled');
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
