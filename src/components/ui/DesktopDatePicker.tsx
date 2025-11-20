"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';

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
  const [open, setOpen] = React.useState(false);
  const [viewMonth, setViewMonth] = React.useState<Date>(value ? startOfMonth(value) : startOfMonth(new Date()));
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const calendarRef = React.useRef<HTMLDivElement | null>(null);

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

  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const toInputValue = (d?: Date) => (d ? d.toISOString().slice(0, 10) : '');

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return onChange(undefined);
    const parts = val.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return onChange(undefined);
    onChange(new Date(parts[0], parts[1] - 1, parts[2]));
  };

  const handleSelect = (d: Date) => {
    onChange(d);
    setOpen(false);
  };

  if (isTouch) {
    return (
      <Input
        label={label}
        type="date"
        value={toInputValue(value)}
        onChange={handleNativeChange}
        error={error}
        className="text-base sm:text-sm" // Prevent zoom on mobile
      />
    );
  }

  const monthStart = startOfMonth(viewMonth);
  // Adjust for Monday start (Slovenian locale)
  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // We want: 0=Mon, ..., 6=Sun
  // Formula: (day + 6) % 7
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const totalDays = daysInMonth(viewMonth);

  const prevMonth = () => setViewMonth(m => addMonths(m, -1));
  const nextMonth = () => setViewMonth(m => addMonths(m, 1));

  const renderCalendar = () => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    return (
          <div className="grid grid-cols-7 gap-2">
        {['PO','TO','SR','ČE','PE','SO','NE'].map(h => (
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

  return (
    <div ref={rootRef} className="relative">
      <Input
        clearOnFocus
        label={label}
        type="text"
        value={value ? value.toLocaleDateString('sl-SI') : ''}
        readOnly
        onFocus={() => setOpen(true)}
        error={error}
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
                aria-label="Previous month"
              >
                ‹
              </button>
              <div className="text-sm font-semibold text-foreground capitalize">
                {viewMonth.toLocaleString('sl-SI', { month: 'long', year: 'numeric' })}
              </div>
              <button
                onClick={nextMonth}
                className="h-8 w-8 rounded-full flex items-center justify-center text-foreground/80 hover:bg-white/10 transition active:scale-95"
                aria-label="Next month"
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
                Zapri
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
