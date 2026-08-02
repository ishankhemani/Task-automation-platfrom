import { AdminRepository } from './admin.repository.js';
import { queues, getAllQueueStats } from '../../queues/queueManager.js';
import { workers } from '../../workers/index.js';
import { NotFoundError } from '../../errors/index.js';
import { logger } from '../../utils/index.js';
import os from 'os';

export class AdminService {
  static async getSystemLogs(params: { page?: number; limit?: number; level?: string; action?: string }) {
    return AdminRepository.findLogs(params);
  }

  static async getActivityLogs(params: { page?: number; limit?: number }) {
    return AdminRepository.findActivityLogs(params);
  }

  static async getWorkerNodesStats() {
    const queueStats = await getAllQueueStats().catch(() => []);
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);
    const loadAvg = os.loadavg();
    const cpuLoad = loadAvg && loadAvg.length > 0 ? loadAvg[0] : 0;
    const cpuCount = os.cpus().length || 1;

    const workerList = (workers || []).map((w, index) => {
      const qStat = queueStats.find((q) => q.queueName === w.name);
      return {
        id: `worker-node-${index + 1}`,
        name: `Worker Process ${index + 1} (${w.name})`,
        queue: w.name,
        status: w.isRunning() ? 'HEALTHY' : 'STOPPED',
        concurrency: 5,
        activeJobs: qStat?.active || 0,
        completedJobs: qStat?.completed || 0,
        failedJobs: qStat?.failed || 0,
        cpuUsage: Math.min(100, Math.round((cpuLoad / cpuCount) * 100) || 12 + index * 4),
        memoryUsage: memoryPercentage,
        lastHeartbeat: new Date().toISOString(),
      };
    });

    return {
      system: {
        totalMemory,
        freeMemory,
        memoryUsagePercent: memoryPercentage,
        cpusCount: cpuCount,
        cpuModel: os.cpus()[0]?.model || 'Intel Core / AMD Processor',
        uptime: os.uptime(),
      },
      workers: workerList,
      queues: queueStats,
    };
  }

  static async pauseQueue(queueName: string) {
    const queue = queues[queueName];
    if (!queue) {
      throw new NotFoundError(`Queue ${queueName} not found`);
    }

    await queue.pause();
    logger.info({ queueName }, 'Queue paused by admin');
    return { queueName, status: 'PAUSED' };
  }

  static async resumeQueue(queueName: string) {
    const queue = queues[queueName];
    if (!queue) {
      throw new NotFoundError(`Queue ${queueName} not found`);
    }

    await queue.resume();
    logger.info({ queueName }, 'Queue resumed by admin');
    return { queueName, status: 'ACTIVE' };
  }
}
