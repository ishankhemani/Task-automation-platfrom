import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse, PaginatedResponse, User } from '../../../types/index.js';

export const adminApi = {
  getUsers: (params?: Record<string, unknown>) =>
    axiosClient.get<unknown, ApiResponse<PaginatedResponse<User>>>('/admin/users', { params }),

  getWorkers: () =>
    axiosClient.get<unknown, ApiResponse<unknown[]>>('/admin/workers'),
};
