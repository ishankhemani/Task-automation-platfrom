import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse, User } from '../../../types/index.js';

export const profileApi = {
  getProfile: () =>
    axiosClient.get<unknown, ApiResponse<User>>('/profile'),

  updateProfile: (data: Partial<User>) =>
    axiosClient.patch<unknown, ApiResponse<User>>('/profile', data),
};
