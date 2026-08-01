import { useState } from 'react';
import { useAnalyticsQueries } from '../hooks/useAnalyticsQueries.js';
import { PageHeader } from '../../../components/data-display/PageHeader.js';
import { GlassCard } from '../../../components/data-display/GlassCard.js';
import { AreaChartWrapper } from '../../../components/data-display/charts/AreaChartWrapper.js';
import { LineChartWrapper } from '../../../components/data-display/charts/LineChartWrapper.js';
import { BarChartWrapper } from '../../../components/data-display/charts/BarChartWrapper.js';
import { PieChartWrapper } from '../../../components/data-display/charts/PieChartWrapper.js';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner.js';

export function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const { data, isLoading } = useAnalyticsQueries(days);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & System Metrics"
        description="Historical trends, priority distributions, and operational throughput metrics"
        breadcrumbs={[{ label: 'Platform', href: '#' }, { label: 'Analytics' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Time Horizon:</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
        }
      />

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Main Execution Trend Area Chart */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Task Execution Aggregations</h3>
                <p className="text-xs text-muted-foreground">Total task throughput over the last {days} days</p>
              </div>
            </div>
            <AreaChartWrapper
              data={data?.timeSeries || []}
              xKey="date"
              yKey="total"
              color="#3b82f6"
              height={280}
            />
          </GlassCard>

          {/* Breakdown Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Line Chart */}
            <GlassCard>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Completed Tasks Trend</h3>
                <p className="text-xs text-muted-foreground">Successful task completions over time</p>
              </div>
              <LineChartWrapper
                data={data?.timeSeries || []}
                xKey="date"
                yKey="completed"
                color="#10b981"
                height={260}
              />
            </GlassCard>

            {/* Failure Rate Bar Chart */}
            <GlassCard>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Failed Executions Trend</h3>
                <p className="text-xs text-muted-foreground">Task failures requiring retry intervention</p>
              </div>
              <BarChartWrapper
                data={data?.timeSeries || []}
                xKey="date"
                yKey="failed"
                color="#ef4444"
                height={260}
              />
            </GlassCard>
          </div>

          {/* Distribution Pie Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Priority Distribution</h3>
                <p className="text-xs text-muted-foreground">Breakdown of tasks by priority level</p>
              </div>
              <PieChartWrapper data={data?.priorityDistribution || []} height={250} />
            </GlassCard>

            <GlassCard>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Status Distribution</h3>
                <p className="text-xs text-muted-foreground">Breakdown of tasks by lifecycle status</p>
              </div>
              <PieChartWrapper
                data={data?.statusDistribution || []}
                colors={['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#64748b']}
                height={250}
              />
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
