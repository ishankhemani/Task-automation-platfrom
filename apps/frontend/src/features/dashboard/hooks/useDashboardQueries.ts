import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi.js';

export function useDashboardQueries() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data;
    },
    refetchInterval: 15000, // Background polling for live dashboard metrics
  });
}
