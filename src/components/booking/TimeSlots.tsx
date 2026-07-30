import { TIME_SLOT_GROUPS, isSlotFull } from '../../data/availability';
import { cn } from '../../lib/cn';

/** Figma: `[Comp] TimeSlots` inside frame 779:2572. */
interface TimeSlotsProps {
  date: string | null;
  value: string | null;
  onChange: (time: string) => void;
}

export function TimeSlots({ date, value, onChange }: TimeSlotsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-r-h2 text-text-primary">選擇時段</h3>

      {date === null ? (
        <p className="rounded-md border border-dashed border-input-border bg-background px-4 py-6 text-center text-r-note text-text-secondary">
          請先選擇用餐日期，系統將顯示可訂時段。
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {TIME_SLOT_GROUPS.map((group) => (
            <fieldset key={group.label} className="flex flex-col gap-2">
              <legend className="mb-1 text-r-note text-text-secondary">
                {group.label}
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.times.map((time) => {
                  const full = isSlotFull(date, time);
                  const selected = value === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={full}
                      aria-pressed={selected}
                      aria-label={full ? `${time}，已滿` : time}
                      onClick={() => onChange(time)}
                      className={cn(
                        'h-10 min-w-[76px] rounded-md border px-3 text-r-label tabular-nums transition-colors',
                        selected
                          ? 'border-brand bg-brand text-brand-contrast hover:bg-brand-hover'
                          : 'border-input-border bg-surface text-text-primary hover:border-brand hover:text-brand active:bg-brand-tint',
                        full &&
                          'cursor-not-allowed border-border bg-background text-text-muted line-through hover:border-border hover:text-text-muted',
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </div>
  );
}
