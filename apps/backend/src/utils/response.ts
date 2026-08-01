import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: unknown;
  errors?: unknown;
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message = 'Success',
  statusCode = 200,
  meta?: unknown
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  errors?: unknown,
  data?: unknown
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}
