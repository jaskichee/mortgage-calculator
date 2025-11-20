'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function BackgroundOrbs() {
  const { theme, systemTheme } = useTheme();
  const [shadows, setShadows] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const generateDots = (count: number) => {
        let shadow = '';
        for (let i = 0; i < count; i++) {
          const x = (-0.5 + Math.random() * 3).toFixed(2) + 'em';
          const y = (-0.5 + Math.random() * 3).toFixed(2) + 'em';
          const blur = '7px';
          
          // Futuristic Palette: Cyan, Blue, Purple, Magenta
          const hue = Math.floor(Math.random() * 140 + 180); 
          const color = `hsla(${hue}, 80%, 60%, 0.8)`;
          
          shadow += `${x} ${y} ${blur} ${color},`;
        }
        return shadow.slice(0, -1);
      };

      setShadows([
        generateDots(15),
        generateDots(15),
        generateDots(15),
        generateDots(15)
      ]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {shadows.map((shadow, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-[3em] h-[3em] text-transparent leading-[1.3]"
          style={{
            fontSize: '52px',
            textShadow: shadow,
            animation: `move ${120 + i * 10}s ${-60 - i * 10}s infinite ease-in-out alternate`,
            mixBlendMode: isDark ? 'screen' : 'multiply',
            opacity: isDark ? 0.6 : 0.3, // Adjust opacity for subtlety
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          .
        </div>
      ))}
    </div>
  );
}
