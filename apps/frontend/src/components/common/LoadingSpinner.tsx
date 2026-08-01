import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'default', className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return <Loader2 className={`${sizeMap[size]} text-primary animate-spin ${className}`} />;
}
