export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: unknown;
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
