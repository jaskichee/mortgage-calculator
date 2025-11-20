import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 relative overflow-hidden';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 border border-white/10 backdrop-blur-md',
      secondary: 'bg-white/10 dark:bg-white/5 backdrop-blur-xl text-foreground border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5',
      outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent',
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
