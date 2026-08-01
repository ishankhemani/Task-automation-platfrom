import { FilterPanel } from '../../../components/common/FilterPanel.js';
import { TaskStatus, Priority, TasksListQueryParams } from '../types/tasks.types.js';

interface TaskFilterPanelProps {
  filters: TasksListQueryParams;
  onChange: (filters: TasksListQueryParams) => void;
  onReset: () => void;
}

export function TaskFilterPanel({ filters, onChange, onReset }: TaskFilterPanelProps) {
  return (
    <FilterPanel onReset={onReset}>
      {/* Search Input */}
      <div>
        <label className="text-xs text-muted-foreground block mb-1 font-medium">Search Keyword</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          placeholder="Filter by title or content..."
          className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="text-xs text-muted-foreground block mb-1 font-medium">Task Status</label>
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: (e.target.value as TaskStatus) || undefined, page: 1 })}
          className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="FAILED">FAILED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="text-xs text-muted-foreground block mb-1 font-medium">Priority Level</label>
        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ ...filters, priority: (e.target.value as Priority) || undefined, page: 1 })}
          className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs text-muted-foreground block mb-1 font-medium">Sort Order</label>
        <select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value, page: 1 })}
          className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Task Title</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>
    </FilterPanel>
  );
}
