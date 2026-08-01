import { cn } from '../../lib/utils.js';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <div
        className={cn(
          'rounded-full border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <p className="text-sm text-muted-foreground animate-pulse">{label}</p>}
    </div>
  );
}
