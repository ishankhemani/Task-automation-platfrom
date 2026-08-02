import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse, User } from '../../../types/index.js';

export interface ProfileUpdatePayload {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = {
  getProfile: () =>
    axiosClient.get<unknown, ApiResponse<User>>('/users/me'),

  updateProfile: (data: ProfileUpdatePayload) =>
    axiosClient.patch<unknown, ApiResponse<User>>('/users/me/profile', data),

  changePassword: (data: ChangePasswordPayload) =>
    axiosClient.patch<unknown, ApiResponse<{ message: string }>>('/users/me/password', data),
};
