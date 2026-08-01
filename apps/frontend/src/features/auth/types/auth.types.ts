import { User } from '../../../types/index.js';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface AuthStateProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
