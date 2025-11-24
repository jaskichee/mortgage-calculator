'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function SettingsPill() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark');
      return;
    }

    document.startViewTransition(() => {
      setTheme(isDark ? 'light' : 'dark');
    });
  };

  const toggleLanguage = () => {
    const nextLocale = locale === 'sl' ? 'en' : 'sl';
    const params = searchParams.toString();
    const href = params ? `${pathname}?${params}` : pathname;
    router.replace(href, {locale: nextLocale});
  };

  return (
    <div className="flex items-center p-1 rounded-full glass-panel border border-white/20 shadow-lg backdrop-blur-md bg-white/10 dark:bg-black/20 transition-all hover:scale-105">
      
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="w-9 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors hover:bg-white/10 dark:hover:bg-white/5 text-foreground overflow-hidden"
        aria-label="Toggle Language"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={locale}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="block"
          >
            {locale === 'sl' ? 'SL' : 'EN'}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-foreground/20 mx-1" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-9 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 dark:hover:bg-white/5 text-foreground"
        aria-label="Toggle Theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
