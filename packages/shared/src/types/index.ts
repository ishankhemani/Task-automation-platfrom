// Shared Data Transfer Objects (DTOs) & API Response types

export interface ApiMetadata {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  timestamp: string;
  [key: string]: unknown;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiErrorDetail[] | string | null;
  metadata?: ApiMetadata;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  queueId?: string;
  workerId?: string;
  userId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

