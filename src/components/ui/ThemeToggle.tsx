'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [minimized, setMinimized] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('theme_toggle_minimized');
      if (saved) setMinimized(saved === 'true');
    } catch (e) {}
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleMinimized = () => {
    const next = !minimized;
    setMinimized(next);
    try { localStorage.setItem('theme_toggle_minimized', String(next)); } catch (e) {}
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }} className="flex flex-col items-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={`rounded-full !p-0 glass-panel hover:bg-white/20 border border-white/10 shadow-2xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 ${minimized ? '!w-10 !h-10' : 'w-14 h-14'}`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: 8, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 8, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 8, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 8, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className="flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <button
        onClick={toggleMinimized}
        title={minimized ? 'Expand theme toggle' : 'Minimize theme toggle'}
        className="w-8 h-8 rounded-full bg-muted/40 text-foreground flex items-center justify-center border border-white/10 hover:bg-muted/60"
      >
        {minimized ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        )}
      </button>
    </div>
  );
}
