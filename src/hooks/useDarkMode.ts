import { useState, useEffect, useCallback } from 'react';

export type DarkModeState = 'light' | 'dark' | 'system';

export function useDarkMode(initialState: DarkModeState = 'system') {
  const [theme, setTheme] = useState<DarkModeState>(initialState);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (resolved: 'light' | 'dark') => {
      root.setAttribute('data-theme', resolved);
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    if (theme === 'system') {
      applyTheme(getSystemTheme());
    } else {
      applyTheme(theme);
    }
  }, [theme, getSystemTheme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      const newTheme = getSystemTheme();
      root.setAttribute('data-theme', newTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      setResolvedTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getSystemTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const setLight = useCallback(() => setTheme('light'), []);
  const setDark = useCallback(() => setTheme('dark'), []);
  const setSystem = useCallback(() => setTheme('system'), []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    setLight,
    setDark,
    setSystem,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  };
}
