import { Priority, TaskStatus } from '@prisma/client';

export interface TasksListQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: Priority;
  assignedTo?: string;
  createdBy?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  scheduledTime?: string | Date;
  assignedTo?: string;
  attachment?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  scheduledTime?: string | Date;
  assignedTo?: string;
  attachment?: string;
}
