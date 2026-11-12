import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'day' | 'night';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY_THEME = 'river_intelligence_theme_v2';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'night',
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
    } catch {
      // Fallback to signature midnight ocean theme
    }
    return 'night';
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
