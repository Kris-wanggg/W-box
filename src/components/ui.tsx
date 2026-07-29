/**
 * Design-system primitives for the reservation flow.
 *
 * Every component here mirrors a named component in "Rastaurant Reservation
 * system", and its sizes, radii, weights and colours are copied from that
 * component's spec — the node id is cited on each one. Colours come from the
 * `Restaurant/*` variable collection via tailwind.config.js; where the design
 * paints something the collection does not publish (the #C9922A selection
 * outline, the Tag washes, the destructive red), the config carries it as a
 * named token attributed to its source component. No colour is invented here.
 *
 * Interaction states are not specified in Figma. They are built only from
 * colours the design already uses: hover borrows the selection outline, focus
 * borrows the brand, and neither introduces a new hue.
 */
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { ChevronDownIcon, MinusIcon, PlusIcon, TrashIcon } from './icons';

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'quiet' | 'danger';
  block?: boolean;
};

/**
 * `[Comp] Button`. Four variants exist in the file:
 *
 * - primary  — 835:860, bg/brand, 16/23.2 Medium, inverse text
 * - outline  — 835:493, hairline in text/secondary, 16/22.5 Medium
 * - quiet    — 791:467, bg/subtle over border/default, 13/19.5 Medium
 * - danger   — 822:555, #C21400, 16/22.5 **Bold**, inverse text
 *
 * All four are 44px tall with an 8px radius.
 */
const BUTTON_VARIANT: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand px-3 text-btn text-white hover:bg-brand/90 active:bg-brand/90 disabled:hover:bg-brand',
  outline:
    'border border-ink-secondary px-3 text-[16px] font-medium leading-[22.5px] text-ink ' +
    'hover:border-selected active:border-selected disabled:hover:border-ink-secondary',
  quiet:
    'gap-3 border border-line bg-subtle px-[13px] text-[13px] font-medium leading-[19.5px] text-ink ' +
    'hover:border-selected active:border-selected disabled:hover:border-line',
  danger:
    'bg-destructive px-3 text-[16px] font-bold leading-[22.5px] text-white ' +
    'hover:bg-destructive/90 active:bg-destructive/90 disabled:hover:bg-destructive',
};

export function Button({ variant = 'primary', block, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex h-11 items-center justify-center gap-2 rounded-control transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-45',
        BUTTON_VARIANT[variant],
        block && 'w-full',
        className,
      )}
      {...props}
    />
  );
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */

/** `[Comp] Tab` (835:681) — 36px pill, 20px padding, 14/21 Medium in both states. */
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
        'h-9 rounded-pill px-5 text-[14px] font-medium leading-[21px] transition-colors',
        active
          ? 'bg-brand text-white hover:bg-brand/90'
          : 'border border-line text-ink hover:border-selected active:border-selected',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * The meal-period pill inside `[Comp] TimeSlots` (779:2783). Same 36px pill as
 * the category tab, but 0.7px tracking, a 16px line box, and — unlike the
 * category tab — a *regular* weight when unselected.
 */
export function PeriodTab({
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'h-9 rounded-pill px-5 text-[14px] leading-[16px] tracking-[0.7px] transition-colors',
        active
          ? 'bg-brand font-medium text-white hover:bg-brand/90'
          : 'border border-line font-normal text-ink hover:border-selected active:border-selected',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * A time slot from `[Comp] TimeSlots` — 41px tall, 8px radius, bg/subtle over
 * border/default, 14/21 Medium. The unavailable state fades both border and
 * label to 30%. Figma does not draw a selected slot, so selection uses
 * border/active, the collection's own token for exactly that.
 */
export function TimeSlot({
  active,
  unavailable,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; unavailable?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={unavailable}
      className={cx(
        'h-[41px] rounded-control bg-subtle text-[14px] font-medium leading-[21px] transition-colors',
        unavailable
          ? 'cursor-not-allowed border border-unavailable-border text-unavailable-text'
          : active
            ? 'border-2 border-brand text-ink'
            : 'border border-line text-ink hover:border-selected',
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
 * `[Comp] Stepper`. `md` is the 44px control on meal cards (36px keys, an 8px
 * radius, the increment key filled with bg/brand); `sm` is the 32px variant in
 * the order summary, whose decrement key becomes a delete once the count is 1.
 */
export function Stepper({ value, onChange, min = 0, max = 99, size = 'md', label }: StepperProps) {
  const compact = size === 'sm';
  const key = compact ? 'size-8 rounded-chip' : 'size-9 rounded-control';
  const icon = compact ? 16 : 20;

  return (
    <div
      className={cx(
        'inline-flex items-center border border-line bg-subtle',
        compact ? 'h-8 rounded-box' : 'h-11 rounded-control px-[5px]',
      )}
    >
      <button
        type="button"
        aria-label={value <= 1 && compact ? `移除 ${label}` : `減少 ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cx(
          key,
          'inline-flex items-center justify-center text-ink transition-colors',
          'hover:bg-brand/[0.08] disabled:opacity-35 disabled:hover:bg-transparent',
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
          key,
          'inline-flex items-center justify-center transition-colors disabled:opacity-40',
          compact ? 'text-ink hover:bg-brand/[0.08]' : 'bg-brand text-white hover:bg-brand/90',
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

/** The 10px-radius row card used for meals, drinks and payment options. */
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
        selected ? 'border-selected bg-white' : muted ? 'border-line-subtle bg-subtle' : 'border-line bg-white',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

export function CardTitle({
  children,
  note,
  size = 'lg',
}: {
  children: ReactNode;
  note?: ReactNode;
  /** `lg` is Restaurant/h3 on the ordering screens; `sm` the 14px title the
   *  訂位資訊 / 訂金狀態 / 聯絡資料 info cards use. */
  size?: 'lg' | 'sm';
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h2 className={cx(size === 'lg' ? 'text-h3' : 'text-sm font-semibold leading-5', 'text-ink')}>{children}</h2>
      {note ? <span className="text-cap text-ink-secondary">{note}</span> : null}
    </header>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx('h-px w-full border-0 bg-line', className)} />;
}

/**
 * `[Comp] Tag`. Three states, each 24px tall with 9px padding:
 * confirm (791:440) is a gold wash with accent text on a full pill; success
 * (822:540) and warning (835:482) are 6px-radius washes with primary text.
 */
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'confirm' | 'success' | 'warning';
}) {
  const tones: Record<string, string> = {
    neutral: 'rounded-chip bg-muted text-ink-tertiary',
    confirm: 'rounded-pill border border-tag-confirm-border bg-tag-confirm-bg text-brand',
    success: 'rounded-chip border border-tag-success-border bg-tag-success-bg text-ink',
    warning: 'rounded-chip border border-tag-warning-border bg-tag-warning-bg text-ink',
  };
  return (
    <span
      className={cx('inline-flex h-6 items-center px-[9px] text-[12px] font-medium leading-4', tones[tone])}
    >
      {children}
    </span>
  );
}

/** The bordered advisory block used under status headers and inside panels. */
export function Notice({
  children,
  tone = 'warn',
  icon,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'warn';
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-control border border-line bg-white p-3 text-body-sm text-ink">
      <span className={cx('mt-px shrink-0', tone === 'warn' ? 'text-selected' : 'text-ink-secondary')} aria-hidden>
        {icon ?? '⚠'}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/* ── Option controls ─────────────────────────────────────────────────────── */

/**
 * `[Comp] Checkbox` (835:966 / 835:1844 / 835:979) — 38px tall, 8px radius.
 * Picked draws a 2px #C9922A outline with a white box and a Medium label;
 * pickable draws a hairline in border/default with a Regular label; and an
 * option locked out because its group is full drops to a 10%-white outline
 * with a 25% label, which is why those read as borderless on the page.
 * The horizontal padding shifts by 1px between states to absorb the extra
 * border width, exactly as the component does.
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
        'inline-flex h-[38px] items-center gap-2 rounded-control transition-colors',
        disabled
          ? 'cursor-not-allowed border border-off-border bg-off-bg pl-[13px] pr-[15px]'
          : checked
            ? 'cursor-pointer border-2 border-selected pl-[14px] pr-[18px]'
            : 'cursor-pointer border border-line bg-subtle pl-[13px] pr-[15px] hover:border-selected',
      )}
    >
      <span
        className={cx(
          'flex size-4 shrink-0 items-center justify-center rounded-box border text-[10px] font-bold leading-none',
          disabled ? 'border-off-box text-transparent' : checked ? 'border-selected bg-white text-ink' : 'border-line text-transparent',
        )}
        aria-hidden
      >
        ✓
      </span>
      <input type="checkbox" className="sr-only" checked={checked} disabled={disabled} onChange={onChange} />
      <span
        className={cx(
          'text-[13px] leading-[19.5px]',
          disabled ? 'font-medium text-off-text' : checked ? 'font-medium text-ink' : 'font-normal text-ink',
        )}
      >
        {label}
        {extra ? ` +$${extra}` : ''}
      </span>
    </label>
  );
}

/**
 * `[Comp] Radio` (835:1742 / 835:1038) — 32px tall, 8px radius. Selected is a
 * **2px** #C9922A outline with a filled 8px dot and a Medium label; unselected
 * is a 1px border/default outline with a Regular label. The label colour does
 * not change between states.
 */
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
        'inline-flex h-8 cursor-pointer items-center gap-2 rounded-control transition-colors',
        checked
          ? 'border-2 border-selected pl-[14px] pr-[18px]'
          : 'border border-line pl-[13px] pr-[17px] hover:border-selected',
      )}
    >
      <span
        className={cx(
          'flex size-4 shrink-0 items-center justify-center rounded-control border p-px',
          checked ? 'border-selected' : 'border-line',
        )}
        aria-hidden
      >
        {checked ? <span className="size-2 rounded-box bg-selected" /> : null}
      </span>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      <span className={cx('text-[13px] leading-[19.5px] text-ink', checked ? 'font-medium' : 'font-normal')}>
        {label}
      </span>
    </label>
  );
}

/** The full-width radio the 客製化料理 form uses, sharing the Radio's marks. */
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
        'flex h-11 flex-1 cursor-pointer items-center gap-2.5 rounded-control px-3 transition-colors',
        checked ? 'border-2 border-selected' : 'border border-line hover:border-selected',
      )}
    >
      <span
        className={cx(
          'flex size-4 shrink-0 items-center justify-center rounded-control border p-px',
          checked ? 'border-selected' : 'border-line',
        )}
        aria-hidden
      >
        {checked ? <span className="size-2 rounded-box bg-selected" /> : null}
      </span>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      <span className={cx('text-body text-ink', checked && 'font-medium')}>{label}</span>
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
    <span className="flex items-center gap-1 text-label-sm text-ink">
      {required ? <span className="text-destructive">＊</span> : null}
      {children}
      {qualifier ? <span className="font-normal text-ink-secondary">{qualifier}</span> : null}
    </span>
  );
}

/* ── Form controls ───────────────────────────────────────────────────────── */

const CONTROL =
  'h-11 w-full rounded-control border border-line bg-white px-3 text-body text-ink transition-colors ' +
  'placeholder:text-ink-placeholder hover:border-selected focus:border-brand ' +
  'disabled:bg-off-bg disabled:text-off-text';

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
      <span className="text-label-sm text-ink">
        {label}
        {required ? <span className="ml-0.5 text-destructive">＊</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-cap text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-cap text-ink-secondary">{hint}</span>
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
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary"
      />
    </span>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(CONTROL, 'h-auto min-h-[88px] py-2.5', className)} {...props} />;
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
      <span className={cx('text-body-sm', strong ? 'font-medium text-ink' : 'text-ink-secondary')}>{label}</span>
      <span className={cx('text-right text-body-sm text-ink', strong && 'font-medium')}>{value}</span>
    </div>
  );
}
