import { StatusBadge } from '../../../components/common/StatusBadge.js';
import { TaskStatus, Priority } from '../types/tasks.types.js';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <StatusBadge status={status} />;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    LOW: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    HIGH: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    CRITICAL: 'bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border uppercase tracking-wider ${styles[priority]}`}>
      {priority}
    </span>
  );
}
