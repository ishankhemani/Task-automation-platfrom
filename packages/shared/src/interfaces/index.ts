// Shared entity and domain interfaces
import { TaskStatus, JobPriority } from '../enums/index.js';

export interface ITask {
  id: string;
  name: string;
  type: string;
  payload: Record<string, unknown>;
  status: TaskStatus;
  priority: JobPriority;
  progress: number;
  result?: Record<string, unknown> | null;
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobProgressPayload {
  taskId: string;
  progressPercentage: number;
  stepName?: string;
}

export interface IQueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}
