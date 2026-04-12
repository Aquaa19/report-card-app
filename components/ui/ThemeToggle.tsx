// File: components/ui/ThemeToggle.tsx
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by ensuring component is mounted before rendering theme-specific UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the server-rendered HTML exactly
    return (
      <button className="p-2 rounded-full text-text-secondary flex items-center justify-center">
        <span className="material-symbols-outlined text-[22px]">dark_mode</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-surfaceHover text-text-secondary hover:text-primary-400 transition-colors tonal-transition flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined text-[22px]">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}