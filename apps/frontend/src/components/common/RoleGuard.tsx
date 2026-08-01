import React from 'react';
import { usePermission } from '../../hooks/usePermission.js';
import { Permission } from '../../types/index.js';
import { UserRole } from '@task-platform/shared';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  permission?: Permission;
  ownerId?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  permission,
  ownerId,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole, can } = usePermission();

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  if (permission && !can(permission, ownerId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
