import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button.js';

interface FilterPanelProps {
  title?: string;
  onReset?: () => void;
  children: React.ReactNode;
}

export function FilterPanel({ title = 'Filters', onReset, children }: FilterPanelProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="w-4 h-4 text-primary" />
          <span>{title}</span>
        </div>
        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 px-2 text-xs text-muted-foreground">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{children}</div>
    </div>
  );
}
