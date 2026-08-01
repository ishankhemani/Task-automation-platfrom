import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import { useSocket } from '../../hooks/useSocket.js';
import { useAppDispatch } from '../../store/index.js';
import { toggleSidebar, toggleNotificationDrawer } from '../../store/slices/uiSlice.js';
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

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              TaskAutomation
            </span>
            <StatusBadge status={isConnected ? 'ONLINE' : 'OFFLINE'} />
          </div>
        </div>

        {/* Global Command Palette Search Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 px-3 py-1.5 rounded-lg border border-border/50 max-w-xs w-full transition-all"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Search or type command...</span>
          <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Trigger */}
          <button
            onClick={() => dispatch(toggleNotificationDrawer())}
            className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-foreground leading-tight">{user.name}</span>
                <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  {user.role}
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold">
                {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>

              <button
                onClick={logout}
                className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
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
