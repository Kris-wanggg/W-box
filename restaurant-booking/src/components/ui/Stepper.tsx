/**
 * Figma: `Stepper` (Adult Stepper / Child Stepper / meal quantity)
 *
 * Renders the "Button - 減少 X" / value / "Button - 增加 X" trio. The
 * accessible names mirror the Figma layer names so tests can target them the
 * same way a designer reads the file.
 */
export interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: 'M' | 'L';
}

export function Stepper({
  label,
  value,
  min = 0,
  max = 99,
  onChange,
  size = 'M',
}: StepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const iconButton =
    'flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors ' +
    'hover:bg-surface-alt active:bg-surface-muted ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
    'disabled:cursor-not-allowed disabled:text-text-muted disabled:hover:bg-transparent';

  return (
    <div
      className={[
        'flex items-center rounded-md border border-border px-[5px] py-px',
        size === 'L' ? 'h-12' : 'h-11',
      ].join(' ')}
    >
      <button
        type="button"
        aria-label={`減少 ${label}`}
        disabled={!canDecrease}
        onClick={() => onChange(value - 1)}
        className={iconButton}
      >
        <span aria-hidden="true">−</span>
      </button>
      <output
        aria-label={`${label} 數量`}
        className="min-w-[44px] text-center text-body-base text-text-primary"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label={`增加 ${label}`}
        disabled={!canIncrease}
        onClick={() => onChange(value + 1)}
        className={iconButton}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
