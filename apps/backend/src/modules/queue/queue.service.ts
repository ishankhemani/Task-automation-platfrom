import { getAllQueueStats } from '../../queues/queueManager.js';
import { workers } from '../../workers/index.js';

export class QueueService {
  async getQueueStats() {
    return getAllQueueStats();
  }

  async getWorkerStats() {
    return workers.map((w, idx) => ({
      id: `worker-node-${idx + 1}`,
      name: w.name,
      status: w.isRunning() ? 'ONLINE' : 'OFFLINE',
      concurrency: w.opts.concurrency,
    }));
  }
}
