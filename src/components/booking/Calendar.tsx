import { useState } from 'react';
import {
  WEEKDAY_LABELS,
  isClosed,
  isPast,
  monthGrid,
  startOfToday,
  toISODate,
} from '../../data/availability';
import { monthLabel } from '../../lib/format';
import { ChevronLeft, ChevronRight } from '../layout/Header';
import { cn } from '../../lib/cn';

/** Figma: `Date Picker` inside frame 779:2572. */
interface CalendarProps {
  value: string | null;
  onChange: (iso: string) => void;
}

export function Calendar({ value, onChange }: CalendarProps) {
  const today = startOfToday();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = monthGrid(cursor.getFullYear(), cursor.getMonth());
  const atFirstMonth =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const shiftMonth = (delta: number) => {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-r-h2 text-text-primary">選擇日期</h3>

      <div className="flex items-center justify-between">
        <p aria-live="polite" className="text-r-label text-text-primary">
          {monthLabel(cursor.getFullYear(), cursor.getMonth())}
        </p>
        <div className="flex gap-1">
          <NavButton
            label="上個月"
            disabled={atFirstMonth}
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft />
          </NavButton>
          <NavButton label="下個月" disabled={false} onClick={() => shiftMonth(1)}>
            <ChevronRight />
          </NavButton>
        </div>
      </div>

      <div role="grid" aria-label="訂位日期" className="flex flex-col gap-1">
        <div role="row" className="grid grid-cols-7">
          {WEEKDAY_LABELS.map((w) => (
            <span
              key={w}
              role="columnheader"
              className="py-1 text-center text-r-note text-text-secondary"
            >
              {w}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((date) => {
            const iso = toISODate(date);
            const outside = date.getMonth() !== cursor.getMonth();
            const closed = isClosed(date);
            const past = isPast(date);
            const disabled = outside || closed || past;
            const selected = value === iso;

            return (
              <div key={iso} role="gridcell" className="grid place-items-center">
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-label={
                    closed
                      ? `${date.getMonth() + 1} 月 ${date.getDate()} 日，公休`
                      : `${date.getMonth() + 1} 月 ${date.getDate()} 日`
                  }
                  onClick={() => onChange(iso)}
                  className={cn(
                    'grid h-[34px] w-[34px] place-items-center rounded-full text-r-note tabular-nums transition-colors',
                    selected && 'bg-brand text-brand-contrast hover:bg-brand-hover',
                    !selected && !disabled &&
                      'text-text-primary hover:bg-brand-tint hover:text-brand active:bg-brand-tint-strong',
                    !selected && disabled && 'cursor-not-allowed text-text-muted',
                    outside && 'opacity-40',
                    closed && !outside && 'line-through decoration-text-muted',
                  )}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-r-note text-text-secondary">
        劃線日期為每週一公休，暫不開放訂位。
      </p>
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-[30px] w-[30px] place-items-center rounded-md border border-input-border text-text-secondary transition-colors hover:border-brand hover:text-brand active:bg-brand-tint disabled:cursor-not-allowed disabled:border-border disabled:text-text-muted"
    >
      {children}
    </button>
  );
}
