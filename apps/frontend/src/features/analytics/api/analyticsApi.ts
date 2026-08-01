import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';

export interface AnalyticsMetricsData {
  summary: {
    totalCount: number;
    periodDays: number;
  };
  timeSeries: Array<{ date: string; completed: number; failed: number; total: number }>;
  priorityDistribution: Array<{ name: string; value: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
}

export const analyticsApi = {
  getMetrics: (days: number = 7) =>
    axiosClient.get<unknown, ApiResponse<AnalyticsMetricsData>>('/analytics/metrics', { params: { days } }),
};
