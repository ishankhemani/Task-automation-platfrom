import React from 'react';
import { Label } from '../ui/label.js';

interface FormFieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormFieldWrapper({
  label,
  description,
  error,
  required,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && <Label required={required}>{label}</Label>}
      {children}
      {description && !error && <p className="text-xs text-muted-foreground">{description}</p>}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
