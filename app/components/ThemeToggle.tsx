import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle(): React.JSX.Element {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg btn-secondary text-text-muted transition-colors"
      aria-label="Toggle dark mode"
    >
      <p>{isDark ? "light" : "dark"}</p>
    </button>
  );
}