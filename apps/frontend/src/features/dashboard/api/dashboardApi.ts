import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';

export interface DashboardStatsData {
  stats: {
    totalTasks: number;
    pendingCount: number;
    processingCount: number;
    completedCount: number;
    failedCount: number;
    cancelledCount: number;
    successRate: number;
    failureRate: number;
    avgProcessingTimeMs: number;
  };
  recentTasks: Array<Record<string, unknown>>;
  recentLogs: Array<Record<string, unknown>>;
}

export const dashboardApi = {
  getStats: () => axiosClient.get<unknown, ApiResponse<DashboardStatsData>>('/dashboard/stats'),
};
