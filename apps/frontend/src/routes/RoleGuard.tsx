import { Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission.js';
import { ROUTES } from '../config/constants.js';
import { UserRole } from '@task-platform/shared';

interface RoleGuardRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuardRoute({ children, allowedRoles }: RoleGuardRouteProps) {
  const { hasRole } = usePermission();

  if (!hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
