import { useState } from 'react';
import { useTasks, useTaskMutations } from '../hooks/useTaskQueries.js';
import { TasksListQueryParams, TaskItem } from '../types/tasks.types.js';
import { PageHeader } from '../../../components/data-display/PageHeader.js';
import { DataTable } from '../../../components/data-display/DataTable.js';
import { TaskStatusBadge, PriorityBadge } from '../components/TaskStatusBadge.js';
import { TaskFilterPanel } from '../components/TaskFilterPanel.js';
import { TaskBuilderModal } from '../components/TaskBuilderModal.js';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer.js';
import { Button } from '../../../components/ui/button.js';
import { Plus, Eye, RotateCcw, Ban, Copy, Trash2 } from 'lucide-react';

export function TasksPage() {
  const [filters, setFilters] = useState<TasksListQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: response, isLoading } = useTasks(filters);
  const { cancelTask, retryTask, duplicateTask, deleteTask } = useTaskMutations();

  const tasks = response?.data || [];

  const columns = [
    {
      header: 'Task Title',
      accessorKey: (row: TaskItem) => (
        <div>
          <button
            onClick={() => setSelectedTaskId(row.id)}
            className="font-semibold text-foreground hover:text-primary transition-colors text-left"
          >
            {row.title}
          </button>
          {row.description && (
            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Priority',
      accessorKey: (row: TaskItem) => <PriorityBadge priority={row.priority} />,
    },
    {
      header: 'Status',
      accessorKey: (row: TaskItem) => <TaskStatusBadge status={row.status} />,
    },
    {
      header: 'Author',
      accessorKey: (row: TaskItem) => (
        <span className="text-xs text-muted-foreground">{row.author?.name || 'User'}</span>
      ),
    },
    {
      header: 'Created Date',
      accessorKey: (row: TaskItem) => (
        <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: (row: TaskItem) => (
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => setSelectedTaskId(row.id)}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded hover:bg-accent min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && (
            <button
              onClick={() => cancelTask(row.id)}
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-amber-500 rounded hover:bg-amber-500/10 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
              title="Cancel Task"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => retryTask(row.id)}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary rounded hover:bg-primary/10 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
            title="Retry Task"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => duplicateTask(row.id)}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded hover:bg-accent min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm('Delete task?')) deleteTask(row.id);
            }}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Tasks Management"
        description="Configure, schedule, and monitor automated job queue dispatches"
        breadcrumbs={[{ label: 'Platform', href: '#' }, { label: 'Tasks' }]}
        actions={
          <Button size="sm" className="min-h-[44px] sm:min-h-[36px]" onClick={() => setIsBuilderOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Task
          </Button>
        }
      />

      {/* Filter Panel */}
      <TaskFilterPanel
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={() =>
          setFilters({
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          })
        }
      />

      {/* Tasks DataTable */}
      <DataTable
        data={tasks}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search task titles..."
      />

      {/* Builder Modal & Detail Drawer */}
      <TaskBuilderModal isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />
      <TaskDetailDrawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

export default TasksPage;
