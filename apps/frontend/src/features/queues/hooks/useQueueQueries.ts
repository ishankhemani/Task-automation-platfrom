import { useQuery } from '@tanstack/react-query';
import { queuesApi } from '../api/queuesApi.js';
import { IQueueStats } from '@task-platform/shared';
import { WorkerNodeStats } from '../api/queuesApi.js';

export function useQueueQueries() {
  const queueStatsQuery = useQuery({
    queryKey: ['queues', 'stats'],
    queryFn: async (): Promise<IQueueStats[]> => {
      const res = await queuesApi.getStats();
      return Array.isArray(res?.data) ? res.data : [];
    },
    refetchInterval: 5000,
  });

  const workerStatsQuery = useQuery({
    queryKey: ['queues', 'workers'],
    queryFn: async (): Promise<WorkerNodeStats[]> => {
      const res = await queuesApi.getWorkers();
      return Array.isArray(res?.data) ? res.data : [];
    },
    refetchInterval: 10000,
  });

  return {
    queueStats: Array.isArray(queueStatsQuery.data) ? queueStatsQuery.data : [],
    isQueueLoading: queueStatsQuery.isLoading,
    refetchQueues: queueStatsQuery.refetch,
    workerStats: Array.isArray(workerStatsQuery.data) ? workerStatsQuery.data : [],
    isWorkerLoading: workerStatsQuery.isLoading,
  };
}
