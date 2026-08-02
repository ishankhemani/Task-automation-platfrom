import React from 'react';
import { cn } from '../../lib/utils.js';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({ className, children, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-3.5 sm:p-5 md:p-6 shadow-md transition-all w-full min-w-0 overflow-hidden',
        glow && 'glow-card hover:border-primary/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
