import { cn } from '../../lib/utils.js';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const getVariantClass = () => {
    if (variant) {
      switch (variant) {
        case 'success':
          return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        case 'warning':
          return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        case 'destructive':
          return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        case 'outline':
          return 'bg-background text-foreground border-border';
        default:
          return 'bg-primary/15 text-primary border-primary/30';
      }
    }

    // Auto-detect based on status string
    const normalized = status.toUpperCase();
    if (['COMPLETED', 'ACTIVE', 'ONLINE', 'SUCCESS', 'HEALTHY'].includes(normalized)) {
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
    if (['PROCESSING', 'PENDING', 'BUSY', 'WARNING', 'DEGRADED'].includes(normalized)) {
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
    if (['FAILED', 'CANCELLED', 'OFFLINE', 'ERROR', 'UNHEALTHY'].includes(normalized)) {
      return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    }

    return 'bg-secondary text-secondary-foreground border-border';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        getVariantClass(),
        className
      )}
    >
      {status}
    </span>
  );
}
