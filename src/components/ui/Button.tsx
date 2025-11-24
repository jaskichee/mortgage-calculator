import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] relative overflow-hidden';
    
    const variants = {
      primary: 'bg-primary/80 text-primary-foreground shadow-[0_8px_20px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 border-t border-white/20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] backdrop-blur-md',
      secondary: 'bg-secondary/50 text-secondary-foreground shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] backdrop-blur-md',
      outline: 'bg-transparent border border-white/20 text-foreground hover:bg-white/10 hover:border-white/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm',
      ghost: 'hover:bg-accent/50 hover:text-accent-foreground',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 sm:px-8 md:px-8 text-base sm:text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
