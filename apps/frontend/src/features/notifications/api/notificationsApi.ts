import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';

export const notificationsApi = {
  getNotifications: () =>
    axiosClient.get<unknown, ApiResponse<unknown[]>>('/notifications'),
};
