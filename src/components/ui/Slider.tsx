import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueDisplay?: React.ReactNode;
  clearOnFocus?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', label, valueDisplay, clearOnFocus, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    
    // Determine current value for visual representation
    const isControlled = props.value !== undefined;
    const [localValue, setLocalValue] = useState<number>(
      Number(props.value ?? props.defaultValue ?? props.min ?? 0)
    );

    useEffect(() => {
      if (isControlled) {
        setLocalValue(Number(props.value));
      }
    }, [props.value, isControlled]);

    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (!ref) return;
      if (typeof ref === 'function') ref(el);
      else (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (clearOnFocus && internalRef.current) {
        const minVal = internalRef.current.min !== '' ? internalRef.current.min : '0';
        internalRef.current.value = minVal as string;
        
        // Update local state immediately for visual feedback
        if (!isControlled) {
            setLocalValue(Number(minVal));
        }

        const changeHandler = onChange as unknown as ((ev: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
        if (changeHandler) {
          const syntheticEvent = {
            ...e,
            target: internalRef.current,
            currentTarget: internalRef.current,
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          changeHandler(syntheticEvent);
        }
      }

      if (props.onFocus) props.onFocus(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setLocalValue(Number(e.target.value));
        }
        if (onChange) {
          onChange(e);
        }
    };

    const min = Number(props.min ?? 0);
    const max = Number(props.max ?? 100);
    // Avoid division by zero
    const range = max - min || 100; 
    const percentage = Math.min(100, Math.max(0, ((localValue - min) / range) * 100));

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          {label && <label className="text-sm font-medium text-foreground">{label}</label>}
          {valueDisplay && <span className="text-sm text-muted-foreground">{valueDisplay}</span>}
        </div>
        
        <div className="relative h-4 w-full group">
            {/* Invisible Input for Interaction */}
            <input
            type="range"
            ref={setRefs}
            className={`absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer ${className}`}
            onFocus={handleFocus}
            onChange={handleChange}
            {...props}
            />

            {/* Visual Track (Glass Tube) */}
            <div className="absolute inset-0 w-full h-full bg-secondary/20 rounded-full p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] border border-white/10 backdrop-blur-sm overflow-hidden pointer-events-none transition-colors group-hover:bg-secondary/30">
                {/* Filled Portion */}
                <motion.div 
                    className="h-full rounded-full relative overflow-hidden bg-slate-600/80 dark:bg-slate-500/80"
                    style={{ 
                        width: `${percentage}%`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Top Highlight for 3D effect */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                    
                    {/* Animated Shimmer - More subtle */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                    />
                </motion.div>
            </div>

            {/* Thumb Indicator (Visual Only) */}
            <motion.div 
                className="absolute w-5 h-5 bg-white rounded-full shadow-md z-10 pointer-events-none border border-slate-200/50 group-hover:scale-110 group-active:scale-95 transition-transform duration-200 ease-out"
                initial={false}
                animate={{ 
                    left: `calc(${percentage}% - ${(percentage * 0.20).toFixed(2)}px)`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ 
                    top: '50%',
                    y: '-50%'
                }} 
            />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
