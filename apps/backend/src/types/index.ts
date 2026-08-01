// Backend-specific type extensions
// Canonical AuthenticatedRequest type - use this throughout the application
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(page = 1, limit = 20): PaginationParams {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}
