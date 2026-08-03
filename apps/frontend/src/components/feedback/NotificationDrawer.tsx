import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { setNotificationDrawerOpen } from '../../store/slices/uiSlice.js';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet.js';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Check, CheckCheck } from 'lucide-react';
import { EmptyState } from './EmptyState.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, Notification } from '../../features/notifications/api/notificationsApi.js';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationDrawer() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isOpen = useAppSelector((state) => state.ui.notificationDrawerOpen);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
    enabled: isAuthenticated && isOpen,
    refetchInterval: isOpen ? 15000 : false,
  });

  const notifications: Notification[] = Array.isArray(data?.data) ? (data.data as Notification[]) : [];
  const unreadCount = notifications.filter((n) => !n?.isRead).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'TASK_UPDATE':
        return <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  const getTimestamp = (createdAt: string) => {
    try {
      return timeAgo(createdAt);
    } catch {
      return 'recently';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setNotificationDrawerOpen(open))}>
      <SheetContent side="right" className="w-full max-w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <SheetTitle>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
          <SheetDescription className="text-xs sm:text-sm">
            Real-time platform activity and job execution alerts
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="You are all caught up!"
              icon={<Bell />}
            />
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all group ${
                  item.isRead
                    ? 'bg-card/50 border-border/50 opacity-75'
                    : 'bg-card border-primary/30 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs text-muted-foreground">{getTimestamp(item.createdAt)}</span>
                        {!item.isRead && (
                          <button
                            type="button"
                            onClick={() => markAsReadMutation.mutate(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3 text-primary" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.message}</p>
                    {!item.isRead && (
                      <span className="inline-block mt-1.5 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
