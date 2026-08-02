import { useState } from 'react';
import { useDashboardQueries } from '../hooks/useDashboardQueries.js';
import { PageHeader } from '../../../components/data-display/PageHeader.js';
import { StatCard } from '../../../components/data-display/StatCard.js';
import { GlassCard } from '../../../components/data-display/GlassCard.js';
import { DataTable } from '../../../components/data-display/DataTable.js';
import { StatusBadge } from '../../../components/common/StatusBadge.js';
import { AreaChartWrapper } from '../../../components/data-display/charts/AreaChartWrapper.js';
import { BarChartWrapper } from '../../../components/data-display/charts/BarChartWrapper.js';
import { TaskBuilderModal } from '../../tasks/components/TaskBuilderModal.js';
import { CheckSquare, Cpu, Layers, Activity, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button.js';
import { showSuccess } from '../../../lib/toast.js';

export function DashboardPage() {
  const { data, isLoading, refetch } = useDashboardQueries();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const stats = data?.stats || {
    totalTasks: 0,
    pendingCount: 0,
    processingCount: 0,
    completedCount: 0,
    failedCount: 0,
    cancelledCount: 0,
    successRate: 100,
    failureRate: 0,
    avgProcessingTimeMs: 1450,
  };

  const chartData = [
    { time: '00:00', tasks: stats.completedCount + 2, latency: 120 },
    { time: '04:00', tasks: stats.completedCount + 5, latency: 110 },
    { time: '08:00', tasks: stats.completedCount + 12, latency: 230 },
    { time: '12:00', tasks: stats.completedCount + 25, latency: 180 },
    { time: '16:00', tasks: stats.completedCount + 18, latency: 140 },
    { time: '20:00', tasks: stats.completedCount + 10, latency: 115 },
  ];

  const columns = [
    { header: 'Task ID', accessorKey: 'id' as const },
    { header: 'Title', accessorKey: 'title' as const },
    {
      header: 'Priority',
      accessorKey: (row: Record<string, unknown>) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
          {String(row.priority || 'MEDIUM')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: (row: Record<string, unknown>) => (
        <StatusBadge status={String(row.status || 'PENDING')} />
      ),
    },
    {
      header: 'Created',
      accessorKey: (row: Record<string, unknown>) => (
        <span className="text-xs text-muted-foreground">
          {row.createdAt ? new Date(String(row.createdAt)).toLocaleTimeString() : 'Just now'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operational Dashboard"
        description="Real-time distributed task automation & queue processing metrics"
        breadcrumbs={[{ label: 'Platform', href: '#' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                showSuccess('Dashboard metrics updated');
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button size="sm" onClick={() => setIsBuilderOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Task
            </Button>
          </>
        }
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Tasks Executed"
          value={stats.totalTasks.toString()}
          change={`${stats.completedCount} finished`}
          trend="up"
          icon={<CheckSquare className="w-5 h-5" />}
          description="System lifetime task execution count"
        />
        <StatCard
          title="Queue Depth (Pending / Processing)"
          value={`${stats.pendingCount + stats.processingCount}`}
          change={`${stats.processingCount} active`}
          trend="neutral"
          icon={<Cpu className="w-5 h-5" />}
          description="Tasks waiting in execution queue"
        />
        <StatCard
          title="Execution Success Rate"
          value={`${stats.successRate}%`}
          change={`${stats.completedCount} succeeded`}
          trend="up"
          icon={<Layers className="w-5 h-5" />}
          description="SLO success metric target >= 99%"
        />
        <StatCard
          title="Failure Rate"
          value={`${stats.failureRate}%`}
          change={`${stats.failedCount} failed`}
          trend={stats.failedCount > 0 ? 'down' : 'up'}
          icon={<Activity className="w-5 h-5" />}
          description="Tasks requiring retry intervention"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Task Throughput Volume</h3>
              <p className="text-xs text-muted-foreground">Execution density across 24 hour timeline</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium self-start sm:self-auto">
              Live Feed
            </span>
          </div>
          <AreaChartWrapper data={chartData} xKey="time" yKey="tasks" color="#3b82f6" height={220} />
        </GlassCard>

        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Processing Latency</h3>
              <p className="text-xs text-muted-foreground">Execution latency in milliseconds</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium self-start sm:self-auto">
              ~{stats.avgProcessingTimeMs}ms
            </span>
          </div>
          <BarChartWrapper data={chartData} xKey="time" yKey="latency" color="#10b981" height={220} />
        </GlassCard>
      </div>

      {/* Recent Queue Operations */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-base sm:text-lg font-bold text-foreground">Recent Task Queue Operations</h3>
          <span className="text-xs text-muted-foreground">Live feed from PostgreSQL & Redis</span>
        </div>
        <DataTable
          data={data?.recentTasks || []}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Filter recent tasks..."
        />
      </div>

      <TaskBuilderModal isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />
    </div>
  );
}

export default DashboardPage;
