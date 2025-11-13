'use client';

import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('wallet-wrapped-theme') as Theme;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('wallet-wrapped-theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (theme: Theme) => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  return { theme, toggleTheme };
}

