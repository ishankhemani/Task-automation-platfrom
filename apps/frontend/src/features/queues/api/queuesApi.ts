import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';

export const queuesApi = {
  getQueueStats: () =>
    axiosClient.get<unknown, ApiResponse<unknown[]>>('/queues/stats'),
};
