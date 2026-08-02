import { describe, it, expect, vi } from 'vitest';
import { QueueService } from '../../modules/queue/queue.service.js';

vi.mock('../../queues/queueManager.js', () => ({
  getAllQueueStats: vi.fn().mockResolvedValue([
    {
      queueName: 'default-task-queue',
      waiting: 2,
      active: 1,
      completed: 45,
      failed: 0,
      delayed: 0,
      paused: false,
    },
  ]),
}));

vi.mock('../../workers/index.js', () => ({
  workers: [
    {
      name: 'default-task-queue',
      isRunning: () => true,
      opts: { concurrency: 5 },
    },
  ],
}));

describe('QueueService', () => {
  const service = new QueueService();

  it('should return aggregated queue stats', async () => {
    const stats = await service.getQueueStats();
    expect(stats).toHaveLength(1);
    expect(stats[0].queueName).toBe('default-task-queue');
    expect(stats[0].waiting).toBe(2);
  });

  it('should return worker node status', async () => {
    const workers = await service.getWorkerStats();
    expect(workers).toHaveLength(1);
    expect(workers[0].status).toBe('ONLINE');
    expect(workers[0].concurrency).toBe(5);
  });
});
