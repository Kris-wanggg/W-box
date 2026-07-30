import { cn } from '../../lib/cn';

interface ChoiceProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  /** Rendered to the right of the label, e.g. "+$40". */
  suffix?: string;
  name?: string;
}

const CONTROL_BASE =
  'grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors';

const ROW_BASE =
  'inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-r-label transition-colors ' +
  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2';

/** Figma: `[Comp] Radio` */
export function Radio({
  label,
  checked,
  onChange,
  disabled = false,
  suffix,
  name,
}: ChoiceProps) {
  return (
    <label
      className={cn(
        ROW_BASE,
        checked
          ? 'border-brand bg-brand-tint text-text-primary'
          : 'border-input-border bg-surface text-text-secondary',
        disabled
          ? 'cursor-not-allowed border-border bg-background text-text-muted'
          : 'hover:border-brand hover:text-text-primary active:bg-brand-tint',
      )}
    >
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={cn(
          CONTROL_BASE,
          'rounded-full',
          checked ? 'border-brand' : 'border-input-border',
          disabled && 'border-border',
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
      <span>{label}</span>
      {suffix !== undefined && (
        <span className="text-r-note text-text-secondary">{suffix}</span>
      )}
    </label>
  );
}

/** Figma: `[Comp] Checkbox` */
export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  suffix,
}: ChoiceProps) {
  return (
    <label
      className={cn(
        ROW_BASE,
        checked
          ? 'border-brand bg-brand-tint text-text-primary'
          : 'border-input-border bg-surface text-text-secondary',
        disabled
          ? 'cursor-not-allowed border-border bg-background text-text-muted'
          : 'hover:border-brand hover:text-text-primary active:bg-brand-tint',
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={cn(
          CONTROL_BASE,
          'rounded-[4px]',
          checked ? 'border-brand bg-brand text-brand-contrast' : 'border-input-border',
          disabled && 'border-border',
        )}
      >
        {checked && <span className="text-[11px] leading-none">✓</span>}
      </span>
      <span>{label}</span>
      {suffix !== undefined && (
        <span className="text-r-note text-text-secondary">{suffix}</span>
      )}
    </label>
  );
}

/** A pill-shaped single-select chip — used by 活動類型 and 桌菜價位. */
export function Chip({
  label,
  checked,
  onChange,
  disabled = false,
}: Omit<ChoiceProps, 'suffix' | 'name'>) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'h-10 rounded-md border px-4 text-r-label transition-colors',
        checked
          ? 'border-brand bg-brand text-brand-contrast'
          : 'border-input-border bg-surface text-text-secondary',
        disabled
          ? 'cursor-not-allowed border-border text-text-muted'
          : 'hover:border-brand hover:text-brand active:bg-brand-tint-strong',
        checked && !disabled && 'hover:bg-brand-hover hover:text-brand-contrast',
      )}
    >
      {label}
    </button>
  );
}
