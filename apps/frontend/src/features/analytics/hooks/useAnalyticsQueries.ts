import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analyticsApi.js';

export function useAnalyticsQueries(days: number = 7) {
  return useQuery({
    queryKey: ['analytics', 'metrics', days],
    queryFn: async () => {
      const response = await analyticsApi.getMetrics(days);
      return response.data;
    },
  });
}
