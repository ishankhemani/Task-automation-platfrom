import { useQueueQueries } from '../hooks/useQueueQueries.js';
import { PageHeader } from '../../../components/data-display/PageHeader.js';
import { StatCard } from '../../../components/data-display/StatCard.js';
import { GlassCard } from '../../../components/data-display/GlassCard.js';
import { DataTable } from '../../../components/data-display/DataTable.js';
import { StatusBadge } from '../../../components/common/StatusBadge.js';
import { Layers, Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button.js';
import { showSuccess } from '../../../lib/toast.js';
import { IQueueStats } from '@task-platform/shared';

export function QueuesPage() {
  const { queueStats, isQueueLoading, refetchQueues, workerStats, isWorkerLoading } = useQueueQueries();

  const totalWaiting = queueStats.reduce((acc, q) => acc + q.waiting, 0);
  const totalActive = queueStats.reduce((acc, q) => acc + q.active, 0);
  const totalCompleted = queueStats.reduce((acc, q) => acc + q.completed, 0);
  const totalFailed = queueStats.reduce((acc, q) => acc + q.failed, 0);

  const queueColumns = [
    { header: 'Queue Name', accessorKey: 'queueName' as const },
    {
      header: 'Waiting',
      accessorKey: (row: unknown) => (
        <span className="font-semibold text-amber-500">{(row as IQueueStats).waiting}</span>
      ),
    },
    {
      header: 'Active',
      accessorKey: (row: unknown) => (
        <span className="font-semibold text-blue-500 animate-pulse">{(row as IQueueStats).active}</span>
      ),
    },
    {
      header: 'Completed',
      accessorKey: (row: unknown) => (
        <span className="font-semibold text-emerald-500">{(row as IQueueStats).completed}</span>
      ),
    },
    {
      header: 'Failed',
      accessorKey: (row: unknown) => (
        <span className="font-semibold text-rose-500">{(row as IQueueStats).failed}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: (row: unknown) => (
        <StatusBadge status={(row as IQueueStats).paused ? 'PAUSED' : 'ACTIVE'} />
      ),
    },
  ];

  const workerColumns = [
    { header: 'Worker ID', accessorKey: 'id' as const },
    { header: 'Queue Assignment', accessorKey: 'name' as const },
    {
      header: 'Concurrency',
      accessorKey: (row: (typeof workerStats)[0]) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted border">
          {row.concurrency} Threads
        </span>
      ),
    },
    {
      header: 'Node Status',
      accessorKey: (row: (typeof workerStats)[0]) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Queue & Worker Monitoring"
        description="Distributed queue depth analytics and background worker cluster telemetry"
        breadcrumbs={[{ label: 'Platform', href: '#' }, { label: 'Queue Monitoring' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchQueues();
              showSuccess('Queue metrics updated');
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        }
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Active Processing Jobs"
          value={totalActive.toString()}
          change="Real-time"
          trend="up"
          icon={<Activity className="w-5 h-5" />}
          description="Currently executing worker tasks"
        />
        <StatCard
          title="Waiting Queue Depth"
          value={totalWaiting.toString()}
          change="Optimal"
          trend="neutral"
          icon={<Layers className="w-5 h-5" />}
          description="Jobs queued for next available thread"
        />
        <StatCard
          title="Completed Jobs"
          value={totalCompleted.toString()}
          change="Success"
          trend="up"
          icon={<CheckCircle className="w-5 h-5" />}
          description="Processed without execution errors"
        />
        <StatCard
          title="Failed Jobs"
          value={totalFailed.toString()}
          change={totalFailed > 0 ? 'Action required' : '0 errors'}
          trend={totalFailed > 0 ? 'down' : 'up'}
          icon={<AlertTriangle className="w-5 h-5" />}
          description="Jobs in Dead Letter Queue"
        />
      </div>

      {/* BullMQ Queue Overview Table */}
      <GlassCard className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">Pipeline Queue Status</h3>
            <p className="text-xs text-muted-foreground">Live depth metrics across isolated queue pipelines</p>
          </div>
        </div>
        <DataTable data={queueStats.map(q => ({ ...q, id: q.queueName }))} columns={queueColumns} isLoading={isQueueLoading} />
      </GlassCard>

      {/* Worker Node Cluster Health */}
      <GlassCard className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">Worker Cluster Topology</h3>
            <p className="text-xs text-muted-foreground">Active execution threads in worker pool</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Cluster Operational
          </span>
        </div>
        <DataTable data={workerStats} columns={workerColumns} isLoading={isWorkerLoading} />
      </GlassCard>
    </div>
  );
}

export default QueuesPage;
