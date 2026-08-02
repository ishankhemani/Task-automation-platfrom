import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { useSocket } from '../../hooks/useSocket.js';
import { useAppDispatch } from '../../store/index.js';
import { toggleSidebar, toggleMobileSidebar, toggleNotificationDrawer } from '../../store/slices/uiSlice.js';
import { Menu, Sun, Moon, Bell, LogOut, Search, User as UserIcon, Shield } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.js';
import { CommandPalette } from '../navigation/CommandPalette.js';
import { NotificationDrawer } from '../feedback/NotificationDrawer.js';

export function Header() {
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { isConnected } = useSocket();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleMenuToggle = () => {
    if (window.innerWidth < 1024) {
      dispatch(toggleMobileSidebar());
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleMenuToggle}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              TaskAutomation
            </span>
            <div className="hidden xs:block sm:block">
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

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Trigger */}
          <button
            onClick={() => dispatch(toggleNotificationDrawer())}
            className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium text-foreground leading-tight max-w-[120px] truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  {user.role}
                </span>
              </div>

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold shrink-0">
                {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>

              <button
                onClick={logout}
                className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
