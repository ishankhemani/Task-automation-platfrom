import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../store/index.js';
import { usePermission } from '../../hooks/usePermission.js';
import { ROUTES } from '../../config/constants.js';
import { cn } from '../../lib/utils.js';
import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  BarChart3,
  Users,
  Cpu,
  FileText,
  User,
  Settings,
} from 'lucide-react';
import { UserRole } from '@task-platform/shared';

export function Sidebar() {
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const { hasRole } = usePermission();

  const mainNavItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Tasks', path: ROUTES.TASKS, icon: CheckSquare },
    { label: 'Queues', path: ROUTES.QUEUES, icon: Layers },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  ];

  const adminNavItems = [
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Worker Nodes', path: ROUTES.ADMIN_WORKERS, icon: Cpu },
    { label: 'System Logs', path: ROUTES.ADMIN_LOGS, icon: FileText },
  ];

  const userNavItems = [
    { label: 'Profile', path: ROUTES.PROFILE, icon: User },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed top-16 left-0 bottom-0 z-20 flex flex-col bg-card border-r border-border transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Main Navigation */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Platform
            </p>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    sidebarCollapsed && 'justify-center px-0'
                  )
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Admin Navigation (Role Restricted) */}
        {hasRole([UserRole.ADMIN]) && (
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Administration
              </p>
            )}
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                      sidebarCollapsed && 'justify-center px-0'
                    )
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* User Account Navigation */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Account
            </p>
          )}
          <nav className="space-y-1">
            {userNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    sidebarCollapsed && 'justify-center px-0'
                  )
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
