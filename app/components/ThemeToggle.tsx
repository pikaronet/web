import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle(): React.JSX.Element {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg btn-secondary text-text-muted transition-colors p-0 m-0"
      aria-label="Toggle dark mode"
    >
      <p>{isDark ? "light" : "dark"}</p>
    </button>
  );
}