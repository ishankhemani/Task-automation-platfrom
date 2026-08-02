import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, SystemLogItem, ActivityLogItem } from '../api/adminApi.js';
import { Filter, Eye, ChevronLeft, ChevronRight, FileText, Download, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogsPage: React.FC = () => {
  const [tab, setTab] = useState<'system' | 'activity'>('system');
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [selectedMetadata, setSelectedMetadata] = useState<Record<string, unknown> | null>(null);

  // System Logs Query
  const { data: systemLogsResponse, isLoading: systemLoading } = useQuery({
    queryKey: ['admin', 'logs', 'system', page, levelFilter],
    queryFn: () =>
      adminApi.getSystemLogs({
        page,
        limit: 15,
        level: levelFilter || undefined,
      }),
    enabled: tab === 'system',
  });

  // Activity Logs Query
  const { data: activityLogsResponse, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'logs', 'activity', page],
    queryFn: () => adminApi.getActivityLogs({ page, limit: 15 }),
    enabled: tab === 'activity',
  });

  const systemLogs = systemLogsResponse?.data?.data || [];
  const systemMeta = systemLogsResponse?.data?.meta || { page: 1, limit: 15, total: 0, totalPages: 1 };

  const activityLogs = activityLogsResponse?.data?.data || [];
  const activityMeta = activityLogsResponse?.data?.meta || { page: 1, limit: 15, total: 0, totalPages: 1 };

  const handleExportCSV = () => {
    const dataToExport = tab === 'system' ? systemLogs : activityLogs;
    if (!dataToExport || dataToExport.length === 0) {
      toast.error('No log data available to export');
      return;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dataToExport, null, 2));

    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${tab}_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Logs exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">System & Activity Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Comprehensive system error traces, execution events, and user activity audit trails.</p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-primary" />
          Export JSON
        </button>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-muted rounded-lg w-fit">
          <button
            type="button"
            onClick={() => {
              setTab('system');
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === 'system' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            System Execution Logs
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('activity');
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              tab === 'activity' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            User Activity Logs
          </button>
        </div>

        {/* Level Filter dropdown for system logs */}
        {tab === 'system' && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Log Levels</option>
              <option value="info">INFO</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
            </select>
          </div>
        )}
      </div>

      {/* Logs Data Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'system' ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Log Message</th>
                  <th className="px-4 py-3">Task ID</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {systemLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Loading system logs...
                      </div>
                    </td>
                  </tr>
                ) : systemLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No system execution logs found.
                    </td>
                  </tr>
                ) : (
                  systemLogs.map((log: SystemLogItem) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            log.level === 'error'
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              : log.level === 'warn'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}
                        >
                          {log.level === 'error' ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : log.level === 'warn' ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <Info className="w-3 h-3" />
                          )}
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground max-w-md truncate">
                        {log.message}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {log.taskId ? log.taskId.substring(0, 8) + '...' : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {log.metadata && (
                          <button
                            type="button"
                            onClick={() => setSelectedMetadata(log.metadata || null)}
                            className="p-1.5 rounded-lg hover:bg-muted text-primary transition-colors text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Payload
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activityLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Loading activity logs...
                      </div>
                    </td>
                  </tr>
                ) : activityLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No user activity logs found.
                    </td>
                  </tr>
                ) : (
                  activityLogs.map((log: ActivityLogItem) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {log.entity || '-'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {log.userId ? log.userId.substring(0, 8) + '...' : 'System'}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{tab === 'system' ? systemMeta.page : activityMeta.page}</span> of{' '}
            <span className="font-semibold text-foreground">
              {tab === 'system' ? systemMeta.totalPages || 1 : activityMeta.totalPages || 1}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-border bg-background text-foreground text-xs hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={
                tab === 'system'
                  ? page >= systemMeta.totalPages
                  : page >= activityMeta.totalPages
              }
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-border bg-background text-foreground text-xs hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metadata JSON Modal */}
      {selectedMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Log Metadata Payload
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMetadata(null)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-muted/60 border border-border text-xs font-mono text-foreground overflow-x-auto max-h-80">
              {JSON.stringify(selectedMetadata, null, 2)}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedMetadata(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
