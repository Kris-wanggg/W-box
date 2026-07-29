/**
 * Design-system primitives for the reservation flow.
 *
 * Every component maps to a named Figma component in
 * "Rastaurant Reservation system": `[Comp] Button (…)` → <Button/>,
 * `[Comp] Tab (…)` → <Tab/>, `[Comp] Stepper (n)` → <Stepper/>, and so on.
 * Sizes come straight off the design (44px controls, 36px pills, 8px radii on
 * controls, 10px on inner cards, 12px on surface cards).
 */
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ChevronDownIcon, MinusIcon, PlusIcon, TrashIcon } from './icons';

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
};

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors ' +
  'disabled:cursor-not-allowed disabled:opacity-45';

const BUTTON_VARIANT: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-hover disabled:hover:bg-brand',
  outline:
    'border border-line bg-white/5 text-ink hover:bg-brand-tint active:bg-brand-tint disabled:hover:bg-white/5',
  ghost: 'text-brand hover:bg-brand-tint active:bg-brand-tint',
  danger: 'border border-danger/40 bg-white/5 text-danger hover:bg-danger/10 active:bg-danger/15',
};

const BUTTON_SIZE: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 text-[13px] leading-[19.5px]',
  md: 'h-11 px-[13px] text-[13px] leading-[19.5px]',
  lg: 'h-11 px-3 text-[16px] leading-[23.2px]',
};

export function Button({ variant = 'primary', size = 'lg', block, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], block && 'w-full', className)}
      {...props}
    />
  );
}

/* ── Category tabs ───────────────────────────────────────────────────────── */

export function Tab({
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'h-9 rounded-pill px-5 text-sm font-medium leading-[21px] transition-colors',
        active
          ? 'bg-brand text-white hover:bg-brand-hover'
          : 'border border-line text-ink hover:bg-brand-tint active:bg-brand-tint',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Quantity stepper ────────────────────────────────────────────────────── */

type StepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label: string;
};

/**
 * `[Comp] Stepper`. The `md` size is the 44px control used inside meal cards;
 * `sm` is the compact 32px variant used in the order-summary list, where the
 * decrement button turns into a delete affordance once the count reaches 1.
 */
export function Stepper({ value, onChange, min = 0, max = 99, size = 'md', label }: StepperProps) {
  const compact = size === 'sm';
  const btn = compact ? 'size-8 rounded-[6px]' : 'size-9 rounded-control';
  const icon = compact ? 16 : 20;
  const canDecrement = value > min;

  return (
    <div
      className={cx(
        'inline-flex items-center border border-line bg-white/5',
        compact ? 'h-8 rounded-[4px]' : 'h-11 rounded-control px-[5px]',
      )}
    >
      <button
        type="button"
        aria-label={value <= 1 && compact ? `移除 ${label}` : `減少 ${label}`}
        disabled={!canDecrement}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cx(
          btn,
          'inline-flex items-center justify-center text-ink transition-colors',
          'hover:bg-brand-tint active:bg-brand-tint disabled:opacity-35 disabled:hover:bg-transparent',
        )}
      >
        {compact && value <= 1 ? <TrashIcon size={icon} /> : <MinusIcon size={icon} />}
      </button>

      <span
        className={cx(
          'text-center font-medium text-ink',
          compact ? 'w-7 text-[13px] leading-[19.5px]' : 'w-10 text-[15px] leading-[22.5px]',
        )}
      >
        {value}
      </span>

      <button
        type="button"
        aria-label={`增加 ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cx(
          btn,
          'inline-flex items-center justify-center transition-colors',
          compact
            ? 'text-ink hover:bg-brand-tint active:bg-brand-tint'
            : 'bg-brand text-white hover:bg-brand-hover active:bg-brand-hover',
          'disabled:opacity-40',
        )}
      >
        <PlusIcon size={icon} />
      </button>
    </div>
  );
}

/* ── Surfaces ────────────────────────────────────────────────────────────── */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-panel bg-card shadow-card', className)}>
      <div className="flex flex-col gap-4 p-6">{children}</div>
    </section>
  );
}

/** The white 10px-radius row card used for meals, drinks, payment options. */
export function Tile({
  children,
  className,
  muted,
  selected,
  as: As = 'div',
  ...rest
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
  selected?: boolean;
  as?: 'div' | 'label';
} & Record<string, unknown>) {
  return (
    <As
      className={cx(
        'block rounded-tile border p-4 transition-colors',
        selected
          ? 'border-brand bg-white ring-1 ring-brand'
          : muted
            ? 'border-line-soft bg-white/5'
            : 'border-line bg-white',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

export function CardTitle({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-[20px] font-bold leading-7 text-ink">{children}</h2>
      {note ? <span className="text-xs leading-[18px] text-ink-muted">{note}</span> : null}
    </header>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx('h-px w-full border-0 bg-line', className)} />;
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'ok' | 'warn' | 'danger' | 'info';
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-badge text-ink-soft',
    brand: 'bg-brand-tint text-brand',
    ok: 'bg-ok/10 text-ok',
    warn: 'bg-warn/10 text-warn',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };
  return (
    <span className={cx('inline-flex items-center rounded-chip px-2.5 py-[5px] text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}

export function Notice({
  children,
  tone = 'neutral',
  icon,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'ok' | 'warn' | 'danger' | 'info';
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: 'border-line-soft bg-white/50 text-ink-muted',
    ok: 'border-ok/25 bg-ok/5 text-ok',
    warn: 'border-warn/25 bg-warn/5 text-warn',
    danger: 'border-danger/25 bg-danger/5 text-danger',
    info: 'border-info/25 bg-info/5 text-info',
  };
  return (
    <div className={cx('flex items-start gap-2 rounded-tile border p-3 text-[13px] leading-[19.5px]', tones[tone])}>
      {icon ? <span className="mt-px shrink-0">{icon}</span> : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/* ── Option controls ─────────────────────────────────────────────────────── */

/**
 * `[Comp] Checkbox (…)` — the wrapping option chip used by the set editor and
 * the drink 加料 row. Three distinct looks in the design: picked chips carry a
 * brand outline, pickable-but-unpicked ones a hairline outline, and options
 * that are locked out because the group is full drop their outline entirely
 * and grey down.
 */
export function OptionChip({
  label,
  extra,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  extra?: number;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cx(
        'inline-flex items-center gap-2 rounded-control px-3 py-1.5 text-[13px] transition-colors',
        disabled
          ? 'cursor-not-allowed border border-transparent text-ink-muted/55'
          : checked
            ? 'cursor-pointer border border-brand bg-white text-ink'
            : 'cursor-pointer border border-line bg-white text-ink hover:border-brand/60',
      )}
    >
      <input
        type="checkbox"
        className="size-3.5 accent-brand"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>{label}</span>
      {extra ? <span className={cx(disabled ? 'text-ink-muted/55' : 'text-brand-soft')}>+${extra}</span> : null}
    </label>
  );
}

/** `[Comp] Radio (…)` — the compact pill used for 冰塊 / 甜度. */
export function RadioChip({
  label,
  checked,
  onChange,
  name,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  name: string;
}) {
  return (
    <label
      className={cx(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-chip border px-3 py-1 text-[13px] transition-colors',
        checked ? 'border-brand font-medium text-brand' : 'border-line text-ink hover:border-brand/60',
      )}
    >
      <input type="radio" name={name} className="size-3.5 accent-brand" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

/**
 * The full-height radio used by the 客製化料理 form, where each choice takes
 * half the row rather than sitting in a pill.
 */
export function RadioBox({
  label,
  checked,
  onChange,
  name,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  name: string;
}) {
  return (
    <label
      className={cx(
        'flex h-11 flex-1 cursor-pointer items-center gap-2.5 rounded-control border px-3 text-sm transition-colors',
        checked ? 'border-brand font-medium text-brand' : 'border-line text-ink hover:border-brand/60',
      )}
    >
      <input type="radio" name={name} className="size-4 accent-brand" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

/** Label + required mark + optional qualifier, above a group of options. */
export function FieldLegend({
  children,
  required,
  qualifier,
}: {
  children: ReactNode;
  required?: boolean;
  qualifier?: string;
}) {
  return (
    <span className="flex items-center gap-1 text-[13px] font-medium text-ink">
      {required ? <span className="text-danger">＊</span> : null}
      {children}
      {qualifier ? <span className="font-normal text-ink-muted">{qualifier}</span> : null}
    </span>
  );
}

/* ── Form controls ───────────────────────────────────────────────────────── */

const CONTROL =
  'h-11 w-full rounded-control border border-line bg-white px-3 text-sm text-ink transition-colors ' +
  'placeholder:text-ink-muted/70 hover:border-brand/50 focus:border-brand disabled:bg-black/[0.03] disabled:text-ink-muted';

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-[13px] font-medium leading-[19.5px] text-ink">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs leading-[18px] text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs leading-[18px] text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(CONTROL, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block w-full">
      <select className={cx(CONTROL, 'appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDownIcon
        size={20}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
      />
    </span>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(CONTROL, 'h-auto min-h-[88px] py-2.5 leading-[21px]', className)} {...props} />;
}

export function Money({ value, className }: { value: number; className?: string }) {
  return <span className={className}>${value.toLocaleString('en-US')}</span>;
}

/** Label / value line used across every summary and receipt panel. */
export function SummaryRow({
  label,
  value,
  strong,
}: {
  label: ReactNode;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className={cx('text-sm leading-[21px]', strong ? 'font-medium text-ink' : 'text-ink-muted')}>{label}</span>
      <span className={cx('text-right text-sm leading-[21px]', strong ? 'font-medium text-ink' : 'text-ink')}>
        {value}
      </span>
    </div>
  );
}
