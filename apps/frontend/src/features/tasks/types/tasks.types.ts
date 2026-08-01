export type TaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskAuthor {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface TaskHistoryItem {
  id: string;
  taskId: string;
  oldStatus: TaskStatus | null;
  newStatus: TaskStatus;
  changedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface TaskLogItem {
  id: string;
  taskId: string;
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: TaskStatus;
  scheduledTime?: string | null;
  retryCount: number;
  attachment?: string | null;
  createdBy: string;
  author?: TaskAuthor;
  assignedTo?: string | null;
  assignee?: TaskAuthor | null;
  createdAt: string;
  updatedAt: string;
  history?: TaskHistoryItem[];
  logs?: TaskLogItem[];
}

export interface TasksListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: Priority;
  assignedTo?: string;
  createdBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskFormData {
  title: string;
  description?: string;
  priority?: Priority;
  scheduledTime?: string;
  assignedTo?: string;
  attachment?: string;
}
