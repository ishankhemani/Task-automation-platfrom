import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { hoverLiftProps } from '../../lib/animations.js';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
}

export function StatCard({ title, value, change, trend, icon, description }: StatCardProps) {
  return (
    <motion.div
      {...hoverLiftProps}
      className="p-4 sm:p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all group relative overflow-hidden w-full"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">{title}</span>
        {icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground break-all">{value}</span>
        {change && (
          <div
            className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
              trend === 'up'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : trend === 'down'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {description && <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 leading-relaxed">{description}</p>}
    </motion.div>
  );
}
