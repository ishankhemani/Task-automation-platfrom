import { PageHeader } from '../data-display/PageHeader.js';
import { StatCard } from '../data-display/StatCard.js';
import { GlassCard } from '../data-display/GlassCard.js';
import { DataTable } from '../data-display/DataTable.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { AreaChartWrapper } from '../data-display/charts/AreaChartWrapper.js';
import { BarChartWrapper } from '../data-display/charts/BarChartWrapper.js';
import { CheckSquare, Cpu, Layers, Activity, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button.js';
import { showSuccess } from '../../lib/toast.js';

const MOCK_METRIC_CHART_DATA = [
  { time: '00:00', tasks: 12, latency: 120 },
  { time: '04:00', tasks: 19, latency: 110 },
  { time: '08:00', tasks: 45, latency: 230 },
  { time: '12:00', tasks: 78, latency: 180 },
  { time: '16:00', tasks: 62, latency: 140 },
  { time: '20:00', tasks: 34, latency: 115 },
];

const MOCK_JOBS_TABLE_DATA = [
  { id: 'JOB-901', name: 'ETL Financial Sync Job', priority: 'HIGH', status: 'COMPLETED', duration: '1.2s', time: '10 mins ago' },
  { id: 'JOB-902', name: 'User Avatar Image Optimization', priority: 'MEDIUM', status: 'PROCESSING', duration: '450ms', time: 'Just now' },
  { id: 'JOB-903', name: 'Weekly System Audit Log Export', priority: 'CRITICAL', status: 'PENDING', duration: '-', time: 'Scheduled 14:00' },
  { id: 'JOB-904', name: 'Webhook Event Notification Relay', priority: 'LOW', status: 'FAILED', duration: '3.1s', time: '1 hour ago' },
  { id: 'JOB-905', name: 'Database Maintenance & Index Cleanup', priority: 'HIGH', status: 'COMPLETED', duration: '4.8s', time: '2 hours ago' },
];

export function DashboardShell() {
  const columns = [
    { header: 'Job ID', accessorKey: 'id' as const },
    { header: 'Task Name', accessorKey: 'name' as const },
    {
      header: 'Priority',
      accessorKey: (row: typeof MOCK_JOBS_TABLE_DATA[0]) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: (row: typeof MOCK_JOBS_TABLE_DATA[0]) => <StatusBadge status={row.status} />,
    },
    { header: 'Duration', accessorKey: 'duration' as const },
    { header: 'Timestamp', accessorKey: 'time' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time distributed task automation & queue processing metrics"
        breadcrumbs={[{ label: 'Platform', href: '#' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => showSuccess('Dashboard metrics refreshed')}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button size="sm" onClick={() => showSuccess('Task builder modal opened')}>
              <Plus className="w-4 h-4 mr-2" /> Create Task
            </Button>
          </>
        }
      />

      {/* Stat Cards Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks Executed"
          value="1,428"
          change="+12.4%"
          trend="up"
          icon={<CheckSquare className="w-5 h-5" />}
          description="Tasks processed in last 24 hours"
        />
        <StatCard
          title="Active Worker Nodes"
          value="8 / 10"
          change="Optimal"
          trend="neutral"
          icon={<Cpu className="w-5 h-5" />}
          description="98.2% cluster health"
        />
        <StatCard
          title="Queue Throughput"
          value="340 / min"
          change="+5.1%"
          trend="up"
          icon={<Layers className="w-5 h-5" />}
          description="Average latency 140ms"
        />
        <StatCard
          title="Execution Failure Rate"
          value="0.42%"
          change="-0.15%"
          trend="down"
          icon={<Activity className="w-5 h-5" />}
          description="Within target SLO threshold"
        />
      </div>

      {/* Recharts Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Task Execution Volume</h3>
              <p className="text-xs text-muted-foreground">Jobs executed across 24 hour window</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
              Real-time
            </span>
          </div>
          <AreaChartWrapper data={MOCK_METRIC_CHART_DATA} xKey="time" yKey="tasks" color="#3b82f6" height={260} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Average Queue Latency</h3>
              <p className="text-xs text-muted-foreground">Execution latency in milliseconds</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
              Healthy
            </span>
          </div>
          <BarChartWrapper data={MOCK_METRIC_CHART_DATA} xKey="time" yKey="latency" color="#10b981" height={260} />
        </GlassCard>
      </div>

      {/* Real-time Jobs DataTable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Recent Task Queue Operations</h3>
          <span className="text-xs text-muted-foreground">Showing 5 most recent jobs</span>
        </div>
        <DataTable data={MOCK_JOBS_TABLE_DATA} columns={columns} pageSize={5} searchPlaceholder="Search queue jobs..." />
      </div>
    </div>
  );
}
