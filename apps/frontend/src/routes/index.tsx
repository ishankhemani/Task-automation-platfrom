import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout.js';
import { AuthLayout } from '../components/layout/AuthLayout.js';
import { ProtectedRoute } from './ProtectedRoute.js';
import { GuestRoute } from './GuestRoute.js';
import { RoleGuardRoute } from './RoleGuard.js';
import { ROUTES } from '../config/constants.js';
import { UserRole } from '@task-platform/shared';

import { LoginPage } from '../features/auth/pages/LoginPage.js';
import { RegisterPage } from '../features/auth/pages/RegisterPage.js';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage.js';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage.js';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage.js';
import { SessionExpiredPage } from '../features/auth/pages/SessionExpiredPage.js';

import { DashboardPage } from '../features/dashboard/pages/DashboardPage.js';
import { TasksPage } from '../features/tasks/pages/TasksPage.js';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage.js';

function ShellPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Foundation Shell
        </span>
      </div>
      <div className="p-8 rounded-xl border border-border bg-card/50 text-center text-muted-foreground">
        <p className="text-sm">
          {title} shell is ready. Domain workflows will be connected in future modules.
        </p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <h2 className="text-xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <a
        href={ROUTES.DASHBOARD}
        className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm"
      >
        Return to Dashboard
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  // Guest Routes (Unauthenticated)
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },

  // Protected Application Routes
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.HOME, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.TASKS, element: <TasksPage /> },
      { path: ROUTES.QUEUES, element: <ShellPlaceholder title="Queue & Worker Monitoring" /> },
      { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
      { path: ROUTES.PROFILE, element: <ShellPlaceholder title="User Profile" /> },
      { path: ROUTES.SETTINGS, element: <ShellPlaceholder title="Application Settings" /> },

      // Admin Restricted Routes
      {
        path: ROUTES.ADMIN_USERS,
        element: (
          <RoleGuardRoute allowedRoles={[UserRole.ADMIN]}>
            <ShellPlaceholder title="User Management" />
          </RoleGuardRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_WORKERS,
        element: (
          <RoleGuardRoute allowedRoles={[UserRole.ADMIN]}>
            <ShellPlaceholder title="Worker Node Management" />
          </RoleGuardRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_LOGS,
        element: (
          <RoleGuardRoute allowedRoles={[UserRole.ADMIN]}>
            <ShellPlaceholder title="System Audit Logs" />
          </RoleGuardRoute>
        ),
      },
    ],
  },

  // Fallback Error & Unauthorized Routes
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/session-expired', element: <SessionExpiredPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
