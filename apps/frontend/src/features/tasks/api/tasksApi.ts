import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse, PaginatedResponse } from '../../../types/index.js';
import { TaskItem, TasksListQueryParams, CreateTaskFormData } from '../types/tasks.types.js';

export const tasksApi = {
  getTasks: (params: TasksListQueryParams) =>
    axiosClient.get<unknown, PaginatedResponse<TaskItem>>('/tasks', { params }),

  getTaskById: (id: string) =>
    axiosClient.get<unknown, ApiResponse<TaskItem>>(`/tasks/${id}`),

  createTask: (data: CreateTaskFormData) =>
    axiosClient.post<unknown, ApiResponse<TaskItem>>('/tasks', data),

  updateTask: (id: string, data: Partial<CreateTaskFormData> & { status?: string }) =>
    axiosClient.patch<unknown, ApiResponse<TaskItem>>(`/tasks/${id}`, data),

  deleteTask: (id: string) =>
    axiosClient.delete<unknown, ApiResponse<null>>(`/tasks/${id}`),

  cancelTask: (id: string) =>
    axiosClient.post<unknown, ApiResponse<TaskItem>>(`/tasks/${id}/cancel`),

  retryTask: (id: string) =>
    axiosClient.post<unknown, ApiResponse<TaskItem>>(`/tasks/${id}/retry`),

  duplicateTask: (id: string) =>
    axiosClient.post<unknown, ApiResponse<TaskItem>>(`/tasks/${id}/duplicate`),
};
