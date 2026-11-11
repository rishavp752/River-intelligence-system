import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'day' | 'night';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY_THEME = 'river_intelligence_theme_v1';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'day',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'day' || saved === 'night') {
        return saved;
      }
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'night';
      }
    } catch {
      // Fallback to day mode
    }
    return 'day';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'night') {
      root.classList.add('theme-night', 'dark');
      root.classList.remove('theme-day');
      body.classList.add('theme-night');
      body.classList.remove('theme-day');
    } else {
      root.classList.add('theme-day');
      root.classList.remove('theme-night', 'dark');
      body.classList.add('theme-day');
      body.classList.remove('theme-night');
    }

    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  // Listen to OS theme changes if user hasn't explicitly locked a preference yet
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_THEME);
        if (!saved) {
          setThemeState(e.matches ? 'night' : 'day');
        }
      } catch {
        // Ignore
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
