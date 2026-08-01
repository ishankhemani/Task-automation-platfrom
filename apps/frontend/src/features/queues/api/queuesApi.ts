import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';
import { IQueueStats } from '@task-platform/shared';

export interface WorkerNodeStats {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  concurrency: number;
}

export const queuesApi = {
  getStats: () => axiosClient.get<unknown, ApiResponse<IQueueStats[]>>('/queues/stats'),
  getWorkers: () => axiosClient.get<unknown, ApiResponse<WorkerNodeStats[]>>('/queues/workers'),
};
