import { UserRole } from '@task-platform/shared';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isVerified?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'CREATE_TASK'
  | 'EDIT_TASK'
  | 'DELETE_TASK'
  | 'MANAGE_QUEUES'
  | 'MANAGE_USERS'
  | 'MANAGE_WORKERS'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_SETTINGS';
