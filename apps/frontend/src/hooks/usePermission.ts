import { useAuth } from './useAuth.js';
import { can, hasRole } from '../lib/permissions.js';
import { Permission } from '../types/index.js';
import { UserRole } from '@task-platform/shared';

export function usePermission() {
  const { user } = useAuth();

  const checkPermission = (permission: Permission, ownerId?: string): boolean => {
    return can(user, permission, ownerId);
  };

  const checkRole = (allowedRoles: UserRole[]): boolean => {
    return hasRole(user, allowedRoles);
  };

  return {
    can: checkPermission,
    hasRole: checkRole,
    isAdmin: user?.role === UserRole.ADMIN,
    isUser: user?.role === UserRole.USER,
    isViewer: user?.role === UserRole.VIEWER,
  };
}
