// Centralized Design System Tokens
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))',
    },
    success: {
      DEFAULT: 'hsl(142.1 76.2% 36.3%)',
      foreground: 'hsl(355.7 100% 97.3%)',
      subtle: 'rgba(16, 185, 129, 0.12)',
    },
    warning: {
      DEFAULT: 'hsl(37.7 92.1% 50.2%)',
      foreground: 'hsl(48 96% 89%)',
      subtle: 'rgba(245, 158, 11, 0.12)',
    },
    danger: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))',
      subtle: 'rgba(239, 68, 68, 0.12)',
    },
    info: {
      DEFAULT: 'hsl(198.6 88.7% 48.4%)',
      foreground: 'hsl(204 100% 97%)',
      subtle: 'rgba(14, 165, 233, 0.12)',
    },
  },
  surfaces: {
    page: 'hsl(var(--background))',
    card: 'hsl(var(--card))',
    sidebar: 'hsl(var(--card))',
    navbar: 'rgba(var(--background-rgb), 0.8)',
    modal: 'hsl(var(--popover))',
  },
  borders: {
    default: 'hsl(var(--border))',
    subtle: 'hsl(var(--border) / 0.5)',
    focus: 'hsl(var(--ring))',
  },
  typography: {
    headingXL: 'text-3xl font-extrabold tracking-tight md:text-4xl',
    headingL: 'text-2xl font-bold tracking-tight md:text-3xl',
    headingM: 'text-xl font-semibold tracking-tight md:text-2xl',
    bodyLarge: 'text-base font-normal leading-relaxed',
    bodyMedium: 'text-sm font-normal leading-normal',
    bodySmall: 'text-xs font-normal leading-normal',
    caption: 'text-xs text-muted-foreground',
    label: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  shadows: {
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
    dropdown: '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
    modal: '0 20px 50px -12px rgba(0, 0, 0, 0.35)',
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  animation: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
