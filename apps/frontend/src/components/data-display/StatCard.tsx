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
      className="p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">{value}</span>
        {change && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
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

      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </motion.div>
  );
}
