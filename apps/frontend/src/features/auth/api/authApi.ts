import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse, LoginResponse, User } from '../../../types/index.js';
import { LoginInput, RegisterInput, ResetPasswordInput, ChangePasswordInput } from '@task-platform/shared';

export const authApi = {
  register: (data: RegisterInput) =>
    axiosClient.post<unknown, ApiResponse<User>>('/auth/register', data),

  login: (data: LoginInput) =>
    axiosClient.post<unknown, ApiResponse<LoginResponse>>('/auth/login', data),

  logout: (refreshToken: string) =>
    axiosClient.post<unknown, ApiResponse<null>>('/auth/logout', { refreshToken }),

  logoutAll: () =>
    axiosClient.post<unknown, ApiResponse<null>>('/auth/logout-all'),

  forgotPassword: (email: string) =>
    axiosClient.post<unknown, ApiResponse<{ resetToken?: string }>>('/auth/forgot-password', { email }),

  resetPassword: (data: ResetPasswordInput) =>
    axiosClient.post<unknown, ApiResponse<null>>('/auth/reset-password', data),

  changePassword: (data: ChangePasswordInput) =>
    axiosClient.post<unknown, ApiResponse<null>>('/auth/change-password', data),

  getMe: () =>
    axiosClient.get<unknown, ApiResponse<User>>('/auth/me'),
};
