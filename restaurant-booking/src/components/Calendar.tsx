/**
 * Figma: `Date Picker` > `Calendar`
 *
 * Day Button states from the design: Default / Selected / Closed / Outside.
 */
const weekdayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CalendarProps {
  year: number;
  month: number; // 1-12
  selected: string | null;
  closedDates?: string[];
  onSelect: (isoDate: string) => void;
  onMonthChange?: (delta: number) => void;
}

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function Calendar({
  year,
  month,
  selected,
  closedDates = [],
  onSelect,
  onMonthChange,
}: CalendarProps) {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();

  const cells: ({ day: number; iso: string } | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      iso: toIso(year, month, i + 1),
    })),
  ];

  const navButton =
    'flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors ' +
    'hover:bg-surface-alt active:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  return (
    <section aria-label="選擇日期" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="上個月"
          className={navButton}
          onClick={() => onMonthChange?.(-1)}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <p className="text-body-base font-medium text-text-primary">
          {year} 年 {month}月
        </p>
        <button
          type="button"
          aria-label="下個月"
          className={navButton}
          onClick={() => onMonthChange?.(1)}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid">
        {weekdayHeadings.map((heading) => (
          <div
            key={heading}
            role="columnheader"
            className="py-1 text-center text-caption text-text-muted"
          >
            {heading}
          </div>
        ))}

        {cells.map((cell, index) => {
          if (!cell) return <div key={`blank-${index}`} aria-hidden="true" />;
          const isSelected = selected === cell.iso;
          const isClosed = closedDates.includes(cell.iso);
          return (
            <button
              key={cell.iso}
              type="button"
              role="gridcell"
              aria-label={`${month} 月 ${cell.day} 日`}
              aria-pressed={isSelected}
              disabled={isClosed}
              onClick={() => onSelect(cell.iso)}
              className={[
                'flex h-10 items-center justify-center rounded-md text-body-base transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'bg-primary text-text-inverse'
                  : 'text-text-primary hover:bg-surface-alt active:bg-surface-muted',
                isClosed
                  ? 'cursor-not-allowed text-text-muted line-through hover:bg-transparent'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
