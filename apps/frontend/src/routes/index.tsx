import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '../components/layout/AppLayout.js';
import { AuthLayout } from '../components/layout/AuthLayout.js';
import { ProtectedRoute } from './ProtectedRoute.js';
import { GuestRoute } from './GuestRoute.js';
import { RoleGuardRoute } from './RoleGuard.js';
import { ROUTES } from '../config/constants.js';
import { UserRole } from '@task-platform/shared';

// Lazy-loaded page components for code-splitting
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage.js').then(m => ({ default: m.LoginPage || m.default })));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage.js').then(m => ({ default: m.RegisterPage || m.default })));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage.js').then(m => ({ default: m.ForgotPasswordPage || m.default })));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage.js').then(m => ({ default: m.ResetPasswordPage || m.default })));
const UnauthorizedPage = lazy(() => import('../features/auth/pages/UnauthorizedPage.js').then(m => ({ default: m.UnauthorizedPage || m.default })));
const SessionExpiredPage = lazy(() => import('../features/auth/pages/SessionExpiredPage.js').then(m => ({ default: m.SessionExpiredPage || m.default })));

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage.js').then(m => ({ default: m.DashboardPage || m.default })));
const TasksPage = lazy(() => import('../features/tasks/pages/TasksPage.js').then(m => ({ default: m.TasksPage || m.default })));
const AnalyticsPage = lazy(() => import('../features/analytics/pages/AnalyticsPage.js').then(m => ({ default: m.AnalyticsPage || m.default })));
const QueuesPage = lazy(() => import('../features/queues/pages/QueuesPage.js').then(m => ({ default: m.QueuesPage || m.default })));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage.js').then(m => ({ default: m.ProfilePage || m.default })));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage.js').then(m => ({ default: m.SettingsPage || m.default })));

const AdminUsersPage = lazy(() => import('../features/admin/pages/AdminUsersPage.js').then(m => ({ default: m.AdminUsersPage || m.default })));
const AdminWorkersPage = lazy(() => import('../features/admin/pages/AdminWorkersPage.js').then(m => ({ default: m.AdminWorkersPage || m.default })));
const AdminLogsPage = lazy(() => import('../features/admin/pages/AdminLogsPage.js').then(m => ({ default: m.AdminLogsPage || m.default })));

// Suspense fallback spinner
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

// Wrap a lazy component in Suspense
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
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
      { path: ROUTES.LOGIN, element: <Lazy><LoginPage /></Lazy> },
      { path: ROUTES.REGISTER, element: <Lazy><RegisterPage /></Lazy> },
      { path: ROUTES.FORGOT_PASSWORD, element: <Lazy><ForgotPasswordPage /></Lazy> },
      { path: ROUTES.RESET_PASSWORD, element: <Lazy><ResetPasswordPage /></Lazy> },
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
      { path: ROUTES.DASHBOARD, element: <Lazy><DashboardPage /></Lazy> },
      { path: ROUTES.TASKS, element: <Lazy><TasksPage /></Lazy> },
      { path: ROUTES.QUEUES, element: <Lazy><QueuesPage /></Lazy> },
      { path: ROUTES.ANALYTICS, element: <Lazy><AnalyticsPage /></Lazy> },
      { path: ROUTES.PROFILE, element: <Lazy><ProfilePage /></Lazy> },
      { path: ROUTES.SETTINGS, element: <Lazy><SettingsPage /></Lazy> },

      // Admin Restricted Routes
      {
        path: ROUTES.ADMIN_USERS,
        element: (
          <RoleGuardRoute allowedRoles={[UserRole.ADMIN]}>
            <Lazy><AdminUsersPage /></Lazy>
          </RoleGuardRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_WORKERS,
        element: (
          <RoleGuardRoute allowedRoles={[UserRole.ADMIN]}>
            <Lazy><AdminWorkersPage /></Lazy>
          </RoleGuardRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_LOGS,
        element: (
          <RoleGuardRoute allowedRoles={[UserRole.ADMIN]}>
            <Lazy><AdminLogsPage /></Lazy>
          </RoleGuardRoute>
        ),
      },
    ],
  },

  // Fallback Error & Unauthorized Routes
  { path: '/unauthorized', element: <Lazy><UnauthorizedPage /></Lazy> },
  { path: '/session-expired', element: <Lazy><SessionExpiredPage /></Lazy> },
  { path: '*', element: <NotFoundPage /> },
]);
