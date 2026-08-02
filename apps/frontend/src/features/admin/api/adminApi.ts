import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse, PaginatedResponse, User } from '../../../types/index.js';

export interface SystemLogItem {
  id: string;
  taskId?: string;
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface WorkerNodeInfo {
  id: string;
  name: string;
  queue: string;
  status: string;
  concurrency: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  cpuUsage: number;
  memoryUsage: number;
  lastHeartbeat: string;
}

export interface SystemMetricsResponse {
  system: {
    totalMemory: number;
    freeMemory: number;
    memoryUsagePercent: number;
    cpusCount: number;
    cpuModel: string;
    uptime: number;
  };
  workers: WorkerNodeInfo[];
  queues: Array<{
    queueName: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
  }>;
}

export const adminApi = {
  getUsers: (params?: Record<string, unknown>) =>
    axiosClient.get<unknown, ApiResponse<PaginatedResponse<User>>>('/users', { params }),

  updateUser: (id: string, data: { name?: string; role?: string; status?: string; avatar?: string }) =>
    axiosClient.patch<unknown, ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    axiosClient.delete<unknown, ApiResponse<null>>(`/users/${id}`),

  getWorkers: () =>
    axiosClient.get<unknown, ApiResponse<SystemMetricsResponse>>('/admin/workers'),

  getSystemLogs: (params?: Record<string, unknown>) =>
    axiosClient.get<unknown, ApiResponse<PaginatedResponse<SystemLogItem>>>('/admin/logs', { params }),

  getActivityLogs: (params?: Record<string, unknown>) =>
    axiosClient.get<unknown, ApiResponse<PaginatedResponse<ActivityLogItem>>>('/admin/activity', { params }),

  pauseQueue: (queueName: string) =>
    axiosClient.post<unknown, ApiResponse<{ queueName: string; status: string }>>(`/admin/queues/${queueName}/pause`),

  resumeQueue: (queueName: string) =>
    axiosClient.post<unknown, ApiResponse<{ queueName: string; status: string }>>(`/admin/queues/${queueName}/resume`),
};
