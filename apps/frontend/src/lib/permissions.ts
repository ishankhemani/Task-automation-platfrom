import { User, Permission } from '../types/index.js';
import { UserRole } from '@task-platform/shared';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'VIEW_DASHBOARD',
    'CREATE_TASK',
    'EDIT_TASK',
    'DELETE_TASK',
    'MANAGE_QUEUES',
    'MANAGE_USERS',
    'MANAGE_WORKERS',
    'VIEW_ANALYTICS',
    'MANAGE_SETTINGS',
  ],
  [UserRole.USER]: [
    'VIEW_DASHBOARD',
    'CREATE_TASK',
    'EDIT_TASK',
    'DELETE_TASK',
    'VIEW_ANALYTICS',
  ],
  [UserRole.VIEWER]: [
    'VIEW_DASHBOARD',
    'VIEW_ANALYTICS',
  ],
};

/**
 * Permission engine helper. Evaluates whether a user has a permission.
 * Optional ownerId parameter allows evaluating owner-restricted actions (e.g. edit own task).
 */
export function can(
  user: User | null | undefined,
  permission: Permission,
  ownerId?: string
): boolean {
  if (!user) return false;

  const role = user.role as UserRole;
  const allowedPermissions = ROLE_PERMISSIONS[role] || [];

  if (!allowedPermissions.includes(permission)) {
    return false;
  }

  // If action is owner-restricted and user is not admin, check ownership
  if (ownerId && role !== UserRole.ADMIN) {
    return user.id === ownerId;
  }

  return true;
}

export function hasRole(user: User | null | undefined, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role as UserRole);
}
