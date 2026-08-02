import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { closeMobileSidebar } from '../../store/slices/uiSlice.js';
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
  X,
} from 'lucide-react';
import { UserRole } from '@task-platform/shared';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const mobileSidebarOpen = useAppSelector((state) => state.ui.mobileSidebarOpen);
  const { hasRole } = usePermission();

  // Close mobile drawer on route navigation
  useEffect(() => {
    dispatch(closeMobileSidebar());
  }, [location.pathname, dispatch]);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Tasks', path: ROUTES.TASKS, icon: CheckSquare },
    { label: 'Queues', path: ROUTES.QUEUES, icon: Layers },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Worker Nodes', path: ROUTES.ADMIN_WORKERS, icon: Cpu },
    { label: 'System Logs', path: ROUTES.ADMIN_LOGS, icon: FileText },
  ];

  const userNavItems: NavItem[] = [
    { label: 'Profile', path: ROUTES.PROFILE, icon: User },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

  const renderNavSection = (title: string, items: NavItem[], isMobile = false) => (
    <div>
      {(!sidebarCollapsed || isMobile) && (
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (isMobile) dispatch(closeMobileSidebar());
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                sidebarCollapsed && !isMobile && 'justify-center px-0'
              )
            }
            title={sidebarCollapsed && !isMobile ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => dispatch(closeMobileSidebar())}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Navigation (< lg) */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border flex flex-col lg:hidden transition-transform duration-300 shadow-2xl',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            TaskAutomation
          </span>
          <button
            onClick={() => dispatch(closeMobileSidebar())}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {renderNavSection('Platform', mainNavItems, true)}
          {hasRole([UserRole.ADMIN]) && renderNavSection('Administration', adminNavItems, true)}
          {renderNavSection('Account', userNavItems, true)}
        </div>
      </aside>

      {/* Desktop Sidebar (>= lg) */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-20 hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {renderNavSection('Platform', mainNavItems, false)}
          {hasRole([UserRole.ADMIN]) && renderNavSection('Administration', adminNavItems, false)}
          {renderNavSection('Account', userNavItems, false)}
        </div>
      </aside>
    </>
  );
}
