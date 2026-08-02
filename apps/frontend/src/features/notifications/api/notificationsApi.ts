import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';

export interface Notification {
  id: string;
  userId: string;
  taskId?: string | null;
  title: string;
  message: string;
  isRead: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'TASK_UPDATE' | 'SYSTEM';
  createdAt: string;
  updatedAt: string;
}

export const notificationsApi = {
  getNotifications: () =>
    axiosClient.get<unknown, ApiResponse<Notification[]>>('/notifications'),

  markAsRead: (id: string) =>
    axiosClient.patch<unknown, ApiResponse<null>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    axiosClient.post<unknown, ApiResponse<null>>('/notifications/read-all'),
};
