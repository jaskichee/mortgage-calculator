import React from 'react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueDisplay?: React.ReactNode;
  clearOnFocus?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', label, valueDisplay, clearOnFocus, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (!ref) return;
      if (typeof ref === 'function') ref(el);
      else (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (clearOnFocus && internalRef.current) {
        // For range inputs, clearing to an empty string may be undesirable; set to `min` if available, otherwise 0
        const minVal = internalRef.current.min !== '' ? internalRef.current.min : '0';
        internalRef.current.value = minVal as string;

        // If consumer provided an onChange handler, call it with the updated element as the event target
        const changeHandler = props.onChange as unknown as ((ev: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
        if (changeHandler) {
          // Create a synthetic event-like object with target.value
          changeHandler({ target: internalRef.current } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }

      if (props.onFocus) props.onFocus(e);
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          {label && <label className="text-sm font-medium text-foreground">{label}</label>}
          {valueDisplay && <span className="text-sm text-muted-foreground">{valueDisplay}</span>}
        </div>
        <input
          type="range"
          ref={setRefs}
          className={`w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary ${className}`}
          onFocus={handleFocus}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
