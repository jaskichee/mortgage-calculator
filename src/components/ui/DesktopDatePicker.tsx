"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { formatLocalDate } from '@/lib/utils/format-date';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
  value?: Date | undefined;
  onChange: (d: Date | undefined) => void;
  label?: string;
  error?: string;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function daysInMonth(date: Date) {
  const m = date.getMonth();
  return new Date(date.getFullYear(), m + 1, 0).getDate();
}

export function DesktopDatePicker({ value, onChange, label, error }: Props) {
  const locale = useLocale();
  const t = useTranslations('Common');
  const [open, setOpen] = React.useState(false);
  const [viewMonth, setViewMonth] = React.useState<Date>(value ? startOfMonth(value) : startOfMonth(new Date()));
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const calendarRef = React.useRef<HTMLDivElement | null>(null);

  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (value) {
      // Only update input value if it's not currently being edited or if the date object actually changed
      // But since we want to allow free typing, we should be careful.
      // Simplest: Update input value when value prop changes.
      // To avoid cursor jumping or overwriting while typing, we might need to only update on blur or if the value is significantly different.
      // However, for this simple implementation, let's just sync.
      // Better: Only sync if the formatted value is different and we are not focused?
      // Let's just sync for now and see.
      setInputValue(formatLocalDate(value));
      setViewMonth(startOfMonth(value));
    } else {
      setInputValue('');
    }
  }, [value, locale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try parsing DD.MM.YYYY
    const dmy = val.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dmy) {
      const d = parseInt(dmy[1], 10);
      const m = parseInt(dmy[2], 10) - 1;
      const y = parseInt(dmy[3], 10);
      const date = new Date(y, m, d);
      if (!isNaN(date.getTime()) && date.getMonth() === m) {
        onChange(date);
        setViewMonth(new Date(y, m, 1));
      }
    }
  };

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current && !calendarRef.current) return;
      if (
        rootRef.current?.contains(e.target as Node) ||
        calendarRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  React.useEffect(() => {
    if (open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [open]);

  const handleSelect = (d: Date) => {
    onChange(d);
    setOpen(false);
  };

  const monthStart = startOfMonth(viewMonth);
  // Adjust for Monday start (Slovenian locale)
  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // We want: 0=Mon, ..., 6=Sun
  // Formula: (day + 6) % 7
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const totalDays = daysInMonth(viewMonth);

  const prevMonth = () => setViewMonth(m => addMonths(m, -1));
  const nextMonth = () => setViewMonth(m => addMonths(m, 1));

  // Generate localized weekday names starting from Monday
  // Jan 1, 2024 was a Monday
  const weekdays = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(2024, 0, 1 + i);
      const name = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
      // Take first 2 chars and uppercase
      days.push(name.slice(0, 2).toUpperCase());
    }
    return days;
  }, [locale]);

  const renderCalendar = () => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    return (
          <div className="grid grid-cols-7 gap-2">
        {weekdays.map(h => (
          <div key={h} className="text-xs text-muted-foreground text-center font-medium">{h}</div>
        ))}
        {cells.map((n, i) => {
          if (n === null) return <div key={i} className="h-9" />;
          const dt = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), n);
          const isSelected = value && dt.toDateString() === new Date(value).toDateString();
          return (
            <button
              key={i}
              onClick={() => handleSelect(dt)}
              className={`h-9 w-9 rounded-md flex items-center justify-center text-sm transition-transform duration-150 ${isSelected ? 'bg-gradient-to-br from-primary to-primary/70 text-white shadow-md ring-2 ring-primary/20' : 'hover:scale-105 hover:bg-white/5 text-foreground'}`}
            >{n}</button>
          );
        })}
      </div>
    );
  };

  const handleFocus = () => {
    if (rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-full">
      <Input
        clearOnFocus={false}
        label={label}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        error={error}
        placeholder="DD.MM.YYYY"
      />

      {open && createPortal(
        <div
          ref={calendarRef}
          style={{ top: position.top, left: position.left }}
          className="absolute z-[9999] w-72 transform-gpu transition-all duration-200 ease-out animate-in fade-in zoom-in-95"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-1">
              <button
                onClick={prevMonth}
                className="h-8 w-8 rounded-full flex items-center justify-center text-foreground/80 hover:bg-white/10 transition active:scale-95"
                aria-label={t('prevMonth')}
              >
                ‹
              </button>
              <div className="flex gap-1">
                <div className="relative group">
                  <select
                    value={viewMonth.getMonth()}
                    onChange={(e) => setViewMonth(new Date(viewMonth.getFullYear(), parseInt(e.target.value), 1))}
                    className="appearance-none bg-transparent text-sm font-semibold text-foreground cursor-pointer outline-none hover:text-primary transition-colors text-center pr-4 pl-2 py-1 rounded-md hover:bg-white/5 [&>option]:bg-background [&>option]:text-foreground"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2024, i, 1).toLocaleString(locale, { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative group">
                  <select
                    value={viewMonth.getFullYear()}
                    onChange={(e) => setViewMonth(new Date(parseInt(e.target.value), viewMonth.getMonth(), 1))}
                    className="appearance-none bg-transparent text-sm font-semibold text-foreground cursor-pointer outline-none hover:text-primary transition-colors text-center pr-4 pl-2 py-1 rounded-md hover:bg-white/5 [&>option]:bg-background [&>option]:text-foreground"
                  >
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={nextMonth}
                className="h-8 w-8 rounded-full flex items-center justify-center text-foreground/80 hover:bg-white/10 transition active:scale-95"
                aria-label={t('nextMonth')}
              >
                ›
              </button>
            </div>

            <div className="rounded-xl p-1">
              {renderCalendar()}
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-1.5 rounded-full bg-muted/50 hover:bg-muted/70 text-xs font-medium transition active:scale-95"
                onClick={() => setOpen(false)}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default DesktopDatePicker;
