import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { useSocket } from '../../hooks/useSocket.js';
import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { toggleSidebar, toggleMobileSidebar, toggleNotificationDrawer } from '../../store/slices/uiSlice.js';
import { Menu, Sun, Moon, Bell, LogOut, Search, User as UserIcon, Shield } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.js';
import { CommandPalette } from '../navigation/CommandPalette.js';
import { NotificationDrawer } from '../feedback/NotificationDrawer.js';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi, Notification } from '../../features/notifications/api/notificationsApi.js';

export function Header() {
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { isConnected } = useSocket();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Silently poll for unread notification count
  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
    staleTime: 20000,
  });

  const unreadCount = ((notifData?.data as Notification[]) || []).filter((n) => !n.isRead).length;

  const handleMenuToggle = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleMobileSidebar());
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-2.5 sm:px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border transition-colors w-full min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            onClick={handleMenuToggle}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-bold text-sm xs:text-base sm:text-lg tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent truncate flex items-center gap-1">
              TaskAutomation <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shrink-0">Enterprise</span>
            </span>
            <div className="hidden md:block shrink-0">
              <StatusBadge status={isConnected ? 'ONLINE' : 'OFFLINE'} />
            </div>
          </div>
        </div>

        {/* Global Command Palette Search Trigger (Desktop & Tablet) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 px-3 py-1.5 rounded-lg border border-border/50 max-w-xs w-full transition-all"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Search or type command...</span>
          <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
        </button>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
          {/* Mobile Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
            aria-label="Open search"
          >
            <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* Notification Trigger */}
          <button
            onClick={() => dispatch(toggleNotificationDrawer())}
            className="relative p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {unreadCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-3 pl-1.5 sm:pl-3 border-l border-border">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium text-foreground leading-tight max-w-[120px] truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  {user.role}
                </span>
              </div>

              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold shrink-0 text-xs sm:text-sm">
                {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>

              <button
                onClick={logout}
                className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Modals & Drawers */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <NotificationDrawer />
    </>
  );
}
