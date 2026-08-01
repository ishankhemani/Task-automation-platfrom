import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  return {
    theme: theme || 'system',
    setTheme,
    isDark,
    toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
  };
}
