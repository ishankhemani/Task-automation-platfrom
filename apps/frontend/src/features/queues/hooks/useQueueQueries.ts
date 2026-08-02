import { useQuery } from '@tanstack/react-query';
import { queuesApi } from '../api/queuesApi.js';

export function useQueueQueries() {
  const queueStatsQuery = useQuery({
    queryKey: ['queues', 'stats'],
    queryFn: async () => {
      const res = await queuesApi.getStats();
      return res.data || [];
    },
    refetchInterval: 5000,
  });

  const workerStatsQuery = useQuery({
    queryKey: ['queues', 'workers'],
    queryFn: async () => {
      const res = await queuesApi.getWorkers();
      return res.data || [];
    },
    refetchInterval: 10000,
  });

  return {
    queueStats: queueStatsQuery.data || [],
    isQueueLoading: queueStatsQuery.isLoading,
    refetchQueues: queueStatsQuery.refetch,
    workerStats: workerStatsQuery.data || [],
    isWorkerLoading: workerStatsQuery.isLoading,
  };
}
