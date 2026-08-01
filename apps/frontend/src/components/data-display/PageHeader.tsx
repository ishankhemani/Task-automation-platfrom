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
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-6 border-b border-border mb-6">
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />}
                {item.href ? (
                  <a href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">{actions}</div>}
    </div>
  );
}
