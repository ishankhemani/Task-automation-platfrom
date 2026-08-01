// Shared entity and domain interfaces
import { TaskStatus, JobPriority, UserRole, WorkflowStatus, WorkerStatus, QueueStatus } from '../enums/index.js';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITask {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  payload: Record<string, unknown>;
  status: TaskStatus;
  priority: JobPriority;
  progress: number;
  result?: Record<string, unknown> | null;
  error?: string | null;
  queueId?: string | null;
  workflowId?: string | null;
  assignedWorkerId?: string | null;
  retryCount: number;
  scheduledAt?: Date | string | null;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
  createdBy?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IWorkflow {
  id: string;
  name: string;
  description?: string | null;
  definition: Record<string, unknown>;
  trigger: string;
  status: WorkflowStatus;
  version: number;
  isActive: boolean;
  createdBy?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IQueue {
  id: string;
  name: string;
  status: QueueStatus;
  concurrency: number;
  createdAt: Date | string;
}

export interface IWorkerNode {
  id: string;
  hostname: string;
  ipAddress: string;
  status: WorkerStatus;
  cpuUsage: number;
  memoryUsage: number;
  activeJobs: number;
  lastPing: Date | string;
  lastHeartbeat: Date | string;
  createdAt: Date | string;
}

export interface IJobLog {
  id: string;
  taskId: string;
  workerId?: string | null;
  queueId?: string | null;
  level: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  executionStatus?: string | null;
  startTime?: Date | string | null;
  endTime?: Date | string | null;
  duration?: number | null;
  errorMessage?: string | null;
  retryAttempt?: number | null;
  timestamp: Date | string;
}

export interface IJobProgressPayload {
  taskId: string;
  progressPercentage: number;
  stepName?: string;
}

export interface IQueueStats {
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

export interface IDashboardMetrics {
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  runningJobs: number;
  totalWorkers: number;
  onlineWorkers: number;
  successRate: number;
  avgExecutionTimeMs: number;
}

