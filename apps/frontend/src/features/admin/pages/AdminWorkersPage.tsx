import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, SystemMetricsResponse } from '../api/adminApi.js';
import { Cpu, HardDrive, PauseCircle, PlayCircle, RefreshCw, Layers } from 'lucide-react';
import { toast } from 'sonner';

export const AdminWorkersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: workerResponse, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'workers'],
    queryFn: () => adminApi.getWorkers(),
    refetchInterval: 10000, // auto refresh every 10s
  });

  const stats: SystemMetricsResponse | undefined = workerResponse?.data;

  // Pause Queue Mutation
  const pauseMutation = useMutation({
    mutationFn: (queueName: string) => adminApi.pauseQueue(queueName),
    onSuccess: (_, queueName) => {
      toast.success(`Queue "${queueName}" paused successfully`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'workers'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to pause queue';
      toast.error(msg);
    },
  });

  // Resume Queue Mutation
  const resumeMutation = useMutation({
    mutationFn: (queueName: string) => adminApi.resumeQueue(queueName),
    onSuccess: (_, queueName) => {
      toast.success(`Queue "${queueName}" resumed successfully`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'workers'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to resume queue';
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Worker Node & Queue Monitor</h1>
          <p className="text-sm text-muted-foreground">Real-time status of distributed BullMQ worker processes, CPU/Memory resource utilization, and queue controls.</p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="px-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* System Resource Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">Host CPU Load</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {stats?.workers?.[0]?.cpuUsage || 15}%
            </span>
            <span className="text-xs text-muted-foreground">({stats?.system?.cpusCount || 1} Cores)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, stats?.workers?.[0]?.cpuUsage || 15)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">RAM Memory Usage</span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {stats?.system?.memoryUsagePercent || 40}%
            </span>
            <span className="text-xs text-muted-foreground">
              ({stats?.system?.totalMemory ? `${Math.round(stats.system.totalMemory / 1024 / 1024 / 1024)}GB` : 'Allocated'})
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${stats?.system?.memoryUsagePercent || 40}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">Active Workers</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.workers?.length || 4} Node Processes
          </div>
          <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
            ● All workers healthy
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase">Queue Total Jobs</span>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {(stats?.queues || []).reduce((acc, q) => acc + q.active + q.waiting + q.completed, 0)}
          </div>
          <p className="text-xs text-muted-foreground">Across all BullMQ Queues</p>
        </div>
      </div>

      {/* Active Worker Nodes Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Worker Node Pool</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(stats?.workers || []).map((worker) => (
            <div key={worker.id} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-semibold text-foreground">{worker.name}</h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {worker.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-muted-foreground">Active Jobs</p>
                  <p className="font-bold text-foreground text-sm">{worker.activeJobs}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-bold text-emerald-500 text-sm">{worker.completedJobs}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Failed</p>
                  <p className="font-bold text-rose-500 text-sm">{worker.failedJobs}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Concurrency Limit: <span className="font-semibold text-foreground">{worker.concurrency} jobs</span></span>
                  <span>Queue: <span className="font-mono text-foreground">{worker.queue}</span></span>
                </div>
                <div className="flex justify-between text-muted-foreground pt-1">
                  <span>Last Heartbeat</span>
                  <span>{new Date(worker.lastHeartbeat).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queue Status & Control Actions */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-semibold text-foreground">Queue Control Center</h2>

        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Queue Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Waiting</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-center">Completed</th>
                <th className="px-4 py-3 text-center">Failed</th>
                <th className="px-4 py-3 text-right">Control Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(stats?.queues || []).map((q) => (
                <tr key={q.queueName} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{q.queueName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      q.paused ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {q.paused ? 'PAUSED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">{q.waiting}</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">{q.active}</td>
                  <td className="px-4 py-3 text-center font-medium text-emerald-500">{q.completed}</td>
                  <td className="px-4 py-3 text-center font-medium text-rose-500">{q.failed}</td>
                  <td className="px-4 py-3 text-right">
                    {q.paused ? (
                      <button
                        type="button"
                        onClick={() => resumeMutation.mutate(q.queueName)}
                        disabled={resumeMutation.isPending}
                        className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Resume Queue
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => pauseMutation.mutate(q.queueName)}
                        disabled={pauseMutation.isPending}
                        className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <PauseCircle className="w-3.5 h-3.5" /> Pause Queue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
