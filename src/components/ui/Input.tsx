import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** When true, existing value will be cleared when the input receives focus */
  clearOnFocus?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const { onFocus, onChange, value, clearOnFocus, ...rest } = props as InputProps & {
      onFocus?: React.FocusEventHandler<HTMLInputElement>;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
      value?: string | number | readonly string[];
    };

    const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
      if (clearOnFocus) {
        // If uncontrolled, directly clear the DOM value
        if (value === undefined) {
          e.currentTarget.value = '';
        } else if (onChange) {
          // If controlled, call onChange with empty value to let parent update
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: '' },
            currentTarget: { ...e.currentTarget, value: '' },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }

      if (onFocus) onFocus(e);
    };

    return (
      <div className="w-full max-w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`block h-12 w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring transition-all duration-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] ${
            error ? 'border-destructive/50 focus-visible:ring-destructive/50' : ''
          } ${className}`}
          onFocus={handleFocus}
          onChange={onChange}
          value={value}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
