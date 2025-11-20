'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', children, ...props }: CardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateShadow = () => {
      if (!divRef.current) return;
      // Throttle shadow updates with requestAnimationFrame
      requestAnimationFrame(() => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        // Calculate shadow direction (light source at center screen)
        // Shadow moves AWAY from light source
        const x = (cardCenterX - centerX) / 25;
        const y = (cardCenterY - centerY) / 25;
        
        setShadowOffset({ x, y });
      });
    };

    window.addEventListener('scroll', updateShadow, { passive: true });
    window.addEventListener('resize', updateShadow, { passive: true });
    updateShadow();

    return () => {
      window.removeEventListener('scroll', updateShadow);
      window.removeEventListener('resize', updateShadow);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'dark';
  const isDark = currentTheme === 'dark';
  const spotlightColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-panel relative rounded-2xl text-card-foreground transition-transform duration-500 group overflow-hidden ${className}`}
      style={{
        boxShadow: isHovered 
          ? `0 20px 40px -5px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.3)` 
          : `${shadowOffset.x}px ${shadowOffset.y}px 30px -5px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)`,
        transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        // @ts-ignore
        '--mouse-x': '0px',
        '--mouse-y': '0px',
      }}
      {...props}
    >
      {/* Spotlight / Reflection Effect */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${spotlightColor}, transparent 40%)`,
          zIndex: 1
        }}
      />

      {/* Dissolve Light Effect (Background Fade) */}
      <div 
        className="absolute inset-0 bg-background/5 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 0 : 1, // Fades out on hover to reveal clearer glass
          zIndex: 0
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ className = '', ...props }: CardProps) {
  return <div className={`flex flex-col space-y-1.5 p-4 sm:p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg sm:text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: CardProps) {
  return <div className={`p-4 sm:p-6 pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: CardProps) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />;
}
