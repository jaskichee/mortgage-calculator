"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FinisherHeader: any;
  }
}

export default function FinisherHeader() {
  const { theme, systemTheme } = useTheme();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    if (!mounted || !scriptLoaded || !window.FinisherHeader || !containerRef.current) return;

    // Clean up previous instance content if any (though key change handles most of it)
    containerRef.current.innerHTML = '';

    new window.FinisherHeader({
      "count": 12,
      "size": {
        "min": 1300,
        "max": 1500,
        "pulse": 0
      },
      "speed": {
        "x": {
          "min": 0.6,
          "max": 3
        },
        "y": {
          "min": 0.6,
          "max": 3
        }
      },
      "colors": {
        "background": isDark ? "#1b1f22" : "#ffffff",
        "particles": [
          "#ffb7b2",
          "#ffdac1",
          "#e2f0cb",
          "#b5ead7",
          "#c7ceea"
        ]
      },
      "blending": isDark ? "lighten" : "multiply",
      "opacity": {
        "center": 0.6,
        "edge": 0
      },
      "skew": 0,
      "shapes": [
        "c"
      ]
    });
  }, [isDark, scriptLoaded, mounted]);

  return (
    <>
      <Script 
        src="https://www.finisher.co/lab/header/assets/finisher-header.es5.min.js" 
        strategy="afterInteractive" 
        onLoad={() => setScriptLoaded(true)}
      />
      {mounted && (
        <div 
          key={isDark ? 'dark' : 'light'}
          ref={containerRef}
          className="finisher-header fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
        />
      )}
    </>
  );
}
