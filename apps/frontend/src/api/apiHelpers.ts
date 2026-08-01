import { AxiosError } from 'axios';
import { ApiResponse } from '../types/index.js';

export function getErrorMessage(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') return error;

  const axiosErr = error as AxiosError<ApiResponse>;
  if (axiosErr.response?.data?.message) {
    return axiosErr.response.data.message;
  }

  if (axiosErr.message) {
    return axiosErr.message;
  }

  return fallbackMessage;
}

export function getValidationErrors(error: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  const axiosErr = error as AxiosError<ApiResponse>;

  const errData = axiosErr.response?.data?.errors;
  if (Array.isArray(errData)) {
    errData.forEach((item: { field?: string; message: string }) => {
      if (item.field) {
        errors[item.field] = item.message;
      }
    });
  }

  return errors;
}
