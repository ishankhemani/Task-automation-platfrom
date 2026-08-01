import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { getErrorMessage } from '../../../api/apiHelpers.js';
import { showSuccess, showError } from '../../../lib/toast.js';
import { ROUTES } from '../../../config/constants.js';
import {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '@task-platform/shared';

export function useAuthQueries() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: setAuthCredentials, logout: clearAuthCredentials, accessToken } = useAuth();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, accessToken } = response.data;
        setAuthCredentials(user, accessToken);
        showSuccess('Welcome back!', `Logged in as ${user.name}`);
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Login failed. Please check your credentials.');
      showError(message);
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (response) => {
      if (response.success) {
        showSuccess('Account created successfully!', 'You can now log in with your credentials.');
        navigate(ROUTES.LOGIN);
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Registration failed. Email may already be in use.');
      showError(message);
    },
  });

  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (response) => {
      showSuccess('Password reset link sent!', 'If an account exists, instructions have been dispatched.');
      // In dev environment, log the token if returned
      if (response.data?.resetToken) {
        console.info('[DEV ONLY] Password Reset Token:', response.data.resetToken);
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Failed to process password reset request.');
      showError(message);
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordInput) => authApi.resetPassword(data),
    onSuccess: () => {
      showSuccess('Password reset successful!', 'You can now log in with your new password.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Invalid or expired password reset token.');
      showError(message);
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
    onSuccess: () => {
      showSuccess('Password changed successfully!', 'All other active sessions have been revoked.');
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Failed to change password. Ensure current password is correct.');
      showError(message);
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(accessToken || ''),
    onSettled: () => {
      clearAuthCredentials();
      queryClient.clear();
      showSuccess('Logged out successfully');
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotSending: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetting: resetPasswordMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
