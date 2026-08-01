import { useAppDispatch, useAppSelector } from '../../store/index.js';
import { setNotificationDrawerOpen } from '../../store/slices/uiSlice.js';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet.js';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { EmptyState } from './EmptyState.js';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Task Execution Completed',
    message: 'High priority ETL data pipeline job completed in 1.2s.',
    type: 'success',
    timestamp: '2 mins ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Worker Node Scale Up',
    message: 'New background worker instance spawned on node-04.',
    type: 'info',
    timestamp: '15 mins ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'High Queue Latency Warning',
    message: 'Scheduled task queue latency exceeded 500ms threshold.',
    type: 'warning',
    timestamp: '1 hour ago',
    isRead: true,
  },
];

export function NotificationDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.notificationDrawerOpen);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setNotificationDrawerOpen(open))}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <SheetTitle>Notifications</SheetTitle>
          </div>
          <SheetDescription>Real-time platform activity and job execution alerts</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {SAMPLE_NOTIFICATIONS.length === 0 ? (
            <EmptyState title="No notifications" description="You are all caught up!" icon={<Bell />} />
          ) : (
            SAMPLE_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.isRead ? 'bg-card/50 border-border/50 opacity-75' : 'bg-card border-primary/30 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>
                      <span className="text-xs text-muted-foreground shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.message}</p>
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
