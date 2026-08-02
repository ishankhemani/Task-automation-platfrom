import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-4 sm:pb-6 border-b border-border mb-4 sm:mb-6 w-full">
      <div className="space-y-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 overflow-x-auto whitespace-nowrap py-0.5">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />}
                {item.href ? (
                  <a href={item.href} className="hover:text-foreground transition-colors shrink-0">
                    {item.label}
                  </a>
                ) : (
                  <span className="font-medium text-foreground shrink-0">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground break-words">{title}</h1>
        {description && <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 mt-1 md:mt-0">{actions}</div>}
    </div>
  );
}
