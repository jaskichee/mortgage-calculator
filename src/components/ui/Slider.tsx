import React from 'react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueDisplay?: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', label, valueDisplay, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          {label && <label className="text-sm font-medium text-foreground">{label}</label>}
          {valueDisplay && <span className="text-sm text-muted-foreground">{valueDisplay}</span>}
        </div>
        <input
          type="range"
          ref={ref}
          className={`w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
