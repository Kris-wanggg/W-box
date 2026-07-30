import { cn } from '../../lib/cn';

/** Figma: `[Comp] Stepper (n)` */
interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Used to build accessible labels, e.g. "增加 商業午餐套餐 數量". */
  itemLabel: string;
  size?: 'sm' | 'md';
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
  itemLabel,
  size = 'md',
}: StepperProps) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const width = size === 'sm' ? 'w-8' : 'w-10';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-input-border bg-surface',
        size === 'sm' ? 'h-8' : 'h-10',
      )}
    >
      <StepperButton
        className={box}
        label={`移除 ${itemLabel}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </StepperButton>
      <span
        aria-live="polite"
        className={cn(
          'text-center text-r-label tabular-nums text-text-primary',
          width,
        )}
      >
        {value}
      </span>
      <StepperButton
        className={box}
        label={`增加 ${itemLabel} 數量`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        ＋
      </StepperButton>
    </div>
  );
}

function StepperButton({
  className,
  label,
  disabled,
  onClick,
  children,
}: {
  className: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid place-items-center rounded-md text-text-secondary transition-colors',
        'hover:bg-brand-tint hover:text-brand active:bg-brand-tint-strong',
        'disabled:cursor-not-allowed disabled:text-text-muted disabled:hover:bg-transparent',
        className,
      )}
    >
      {children}
    </button>
  );
}
