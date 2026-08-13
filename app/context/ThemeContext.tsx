import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// 1. Define the shape of your context state
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// 2. Define the props for the Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

// 3. Initialize context with undefined (for safety checks)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check if running in a browser environment (SSR safety)
    if (typeof window === 'undefined') return false;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';

    // Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Custom hook with built-in null-check for TypeScript autocomplete safety
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};