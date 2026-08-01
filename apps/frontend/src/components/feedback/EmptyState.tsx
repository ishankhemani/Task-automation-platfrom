import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No data available',
  description = 'There are no items to display at this time.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card/50 rounded-xl border border-border/50 my-4">
      {icon && <div className="text-4xl mb-3 text-muted-foreground">{icon}</div>}
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
