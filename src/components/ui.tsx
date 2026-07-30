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

/**
 * `Button` in the `components` library (639:3612). Its own variant axes are
 * `size` and `state`, so those are the prop names here — `state` keeps Figma's
 * exact casing, capital `Default` included, so the code and the file can be
 * read against each other without a translation table.
 *
 * `style=dark|light` is the third axis. Every screen in the section is `light`,
 * so only the light values are encoded; the dark set is still undecided.
 */
export type ButtonSize = 'xs' | 'S' | 'M' | 'L';
export type ButtonState = 'primary' | 'Default' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  state?: ButtonState;
  block?: boolean;
};

/**
 * The nine `style=light` combinations the library publishes, each copied from
 * its symbol. Sizes carry their own type and padding, so the two are not
 * separable: `size=M` is 44px *and* 14/21 *and* 24px of padding.
 */
const BUTTON: Partial<Record<`${ButtonSize}/${ButtonState}`, string>> = {
  // 791:453 — 修改訂位: border/active, primary label
  'xs/Default':
    'h-7 rounded-chip border border-brand px-[11px] text-[12px] font-medium leading-[18px] text-ink ' +
    'hover:border-selected disabled:hover:border-brand',
  // 838:1102 — 清除設定: border/default, secondary label, no fill
  'xs/secondary':
    'h-7 rounded-chip border border-line px-[11px] text-[12px] font-medium leading-[18px] text-ink-secondary ' +
    'hover:border-selected disabled:hover:border-line',
  // 835:2251 — the 活動類型 chip when picked: the #C9922A selection outline
  'S/primary':
    'h-9 rounded-control border-2 border-selected bg-white px-[14px] text-[13px] font-medium leading-[19.5px] text-ink',
  // 835:2252
  'S/Default':
    'h-9 rounded-control border border-line bg-subtle px-[13px] text-[13px] font-normal leading-[19.5px] text-ink ' +
    'hover:border-selected',
  // 835:1171
  'M/primary':
    'h-11 rounded-control bg-brand px-6 text-[14px] font-medium leading-[21px] text-white ' +
    'hover:bg-brand/90 disabled:hover:bg-brand',
  // 835:1172 — border is text/secondary, not border/default
  'M/Default':
    'h-11 rounded-control border border-ink-secondary px-[25px] text-[14px] font-medium leading-[21px] text-ink ' +
    'hover:border-selected disabled:hover:border-ink-secondary',
  // 791:455
  'L/primary':
    'h-12 rounded-control bg-brand px-3 text-btn text-white hover:bg-brand/90 disabled:hover:bg-brand',
  // 791:454
  'L/Default':
    'h-12 rounded-control border border-ink-secondary px-3 text-[16px] font-medium leading-[22.5px] text-ink ' +
    'hover:border-selected disabled:hover:border-ink-secondary',
  // 892:1288 — Medium, matching the library. The 確認取消訂位 instance on
  // `success-*/cancel-order` is Bold, and the library is the authority.
  'L/danger':
    'h-12 rounded-control bg-destructive px-3 text-[16px] font-medium leading-[22.5px] text-white ' +
    'hover:bg-destructive/90 disabled:hover:bg-destructive',
};

export function Button({ size = 'L', state = 'primary', block, className, ...props }: ButtonProps) {
  const spec = BUTTON[`${size}/${state}`];
  if (!spec && import.meta.env.DEV) {
    // Guard against silently inventing a combination: the library publishes
    // nine, and anything else has to be drawn in Figma first.
    console.warn(`Button: size=${size} state=${state} is not published in the library`);
  }
  return (
    <button
      type="button"
      data-comp={`Button/${size}/${state}`}
      className={cx(
        'inline-flex items-center justify-center gap-2 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-45',
        spec ?? BUTTON['L/primary'],
        block && 'w-full',
        className,
      )}
      {...props}
    />
  );
}

/**
 * `Button/dropdown` (649:3622) — its own component, not a Button state: 44px
 * with a 20px chevron, `state=active` flipping the chevron once the panel it
 * discloses is open (791:456 / 791:457).
 */
export function Dropdown({
  active,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-expanded={active}
      data-comp="Button/dropdown"
      className={cx(
        'inline-flex h-11 items-center gap-3 rounded-control border border-line bg-subtle px-[13px]',
        'text-[13px] font-medium leading-[19.5px] text-ink transition-colors hover:border-selected',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon size={20} className={cx('transition-transform', active && 'rotate-180')} />
    </button>
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
 * The 活動類型 chip is `Button` at `size=S`: `state=primary` when picked,
 * `state=Default` otherwise. This wrapper exists only to add `aria-pressed`,
 * since the chips are a single-select group rather than nine separate actions.
 */
export function SelectChip({
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return <Button size="S" state={active ? 'primary' : 'Default'} aria-pressed={active} {...props} />;
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

/**
 * `stepper` (791:459) — three published `style=light` sizes, and they differ by
 * more than height:
 *
 * | | `s` 32px (791:462) | `M` 44px (791:465) | `L` 48px (835:554) |
 * |---|---|---|---|
 * | shell | bg/subtle, 4px radius | bg/subtle, 8px radius | **no fill**, 8px radius |
 * | keys | 32px, 6px radius | 36px, 8px radius | **40px, 6px radius** |
 * | − key | no fill | no fill | **text/primary at 6%** |
 * | value | 13/19.5, 28px wide | 15/22.5, 40px wide | **16/24, 109px wide** |
 *
 * `s` is the order-summary line, whose decrement key becomes a delete at 1;
 * `M` sits on the meal cards and `L` on the 用餐人數 rows of reservation-v2.
 */
type StepperSize = 's' | 'M' | 'L';

type StepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: StepperSize;
  label: string;
};

const STEPPER: Record<StepperSize, { shell: string; key: string; value: string; icon: number }> = {
  s: { shell: 'h-8 rounded-box border-line bg-subtle', key: 'size-8 rounded-chip', value: 'w-7 text-[13px] leading-[19.5px]', icon: 16 },
  M: { shell: 'h-11 rounded-control border-line bg-subtle px-[5px]', key: 'size-9 rounded-control', value: 'w-10 text-[15px] leading-[22.5px]', icon: 20 },
  L: { shell: 'h-12 rounded-control border-line px-[5px]', key: 'size-10 rounded-chip', value: 'w-[109px] text-[16px] leading-6', icon: 20 },
};

export function Stepper({ value, onChange, min = 0, max = 99, size = 'M', label }: StepperProps) {
  const spec = STEPPER[size];
  /** Only the order-summary size turns its decrement key into a delete. */
  const deletes = size === 's' && value <= 1;

  return (
    <div data-comp={`stepper/${size}`} className={cx('inline-flex items-center border', spec.shell)}>
      <button
        type="button"
        aria-label={deletes ? `移除 ${label}` : `減少 ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cx(
          spec.key,
          'inline-flex items-center justify-center text-ink transition-colors',
          // L fills its decrement key; the smaller two leave it bare.
          size === 'L' ? 'bg-ink/[0.06] hover:bg-ink/[0.10]' : 'hover:bg-brand/[0.08] disabled:hover:bg-transparent',
          'disabled:opacity-30',
        )}
      >
        {deletes ? <TrashIcon size={spec.icon} /> : <MinusIcon size={spec.icon} />}
      </button>

      <span className={cx('text-center font-medium text-ink', spec.value)}>{value}</span>

      <button
        type="button"
        aria-label={`增加 ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cx(
          spec.key,
          'inline-flex items-center justify-center transition-colors disabled:opacity-40',
          size === 's' ? 'text-ink hover:bg-brand/[0.08]' : 'bg-brand text-white hover:bg-brand/90',
        )}
      >
        <PlusIcon size={spec.icon} />
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
 * `tag` (649:3617) — four published `style=light` states. Three are 24px status
 * washes: confirm (791:440) is a gold wash with accent text on a full pill,
 * success (791:438) and warning (791:439) are 6px-radius washes with primary
 * text. `info` (791:441) is the odd one — **32px** tall with 10px of padding,
 * bg/muted and text/tertiary — and it is the step badge in the header.
 */
export function Badge({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: 'info' | 'confirm' | 'success' | 'warning';
}) {
  const tones: Record<string, string> = {
    info: 'h-8 rounded-chip bg-muted px-[10px] text-ink-tertiary',
    confirm: 'h-6 rounded-pill border border-tag-confirm-border bg-tag-confirm-bg px-[9px] text-brand',
    success: 'h-6 rounded-chip border border-tag-success-border bg-tag-success-bg px-[9px] text-ink',
    warning: 'h-6 rounded-chip border border-tag-warning-border bg-tag-warning-bg px-[9px] text-ink',
  };
  return (
    <span data-comp={`tag/${tone}`} className={cx('inline-flex items-center text-[12px] font-medium leading-[18px]', tones[tone])}>
      {children}
    </span>
  );
}

/**
 * `[Comp] Field` in its warning state (791:466) — the advisory block that sits
 * under status headers and inside panels. White fill over border/default, an
 * 8px radius, 17/13 padding and a 10px gap; the ⚠ is 14px in text/accent and
 * the copy is 13/20.15 in text/primary.
 */
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
    <div className="flex items-start gap-[10px] rounded-control border border-line bg-white px-[17px] py-[13px]">
      <span
        className={cx(
          'w-[14px] shrink-0 text-[14px] leading-[21px]',
          tone === 'warn' ? 'text-brand' : 'text-ink-secondary',
        )}
        aria-hidden
      >
        {icon ?? '⚠'}
      </span>
      <div className="min-w-0 flex-1 text-[13px] leading-[20.15px] text-ink">{children}</div>
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
 * `Radio` (658:3637) — three published `style=light` sizes, and the mark itself
 * changes shape between them:
 *
 * | | `S` 32px (791:444) | `M` 44px (835:2250) | `L` 48px (839:1428) |
 * |---|---|---|---|
 * | mark | 16px, **8px radius** | 18px, **circle** | 18px, **circle** |
 * | dot | 8px, 4px radius | 8px, circle | 8px, circle |
 * | gap | 8px | 10px | 12px |
 * | label | 13/19.5 | 14/21 | 14/21 |
 * | picked fill | none | none | **white** |
 *
 * `S` is the 冰塊／甜度 chip, `M` the 包廂／加購飲品 pair, `L` the payment-method
 * rows. Horizontal padding shifts by 1px between states to absorb the 2px
 * selected border.
 */
type RadioSize = 'S' | 'M' | 'L';

const RADIO: Record<RadioSize, { box: string; picked: string; unpicked: string; mark: string; dot: string; label: string }> = {
  S: {
    box: 'h-8 gap-2',
    picked: 'border-2 border-selected pl-[14px] pr-[18px]',
    unpicked: 'border border-line pl-[13px] pr-[17px] hover:border-selected',
    mark: 'size-4 rounded-control',
    dot: 'size-2 rounded-box',
    label: 'text-[13px] leading-[19.5px]',
  },
  M: {
    box: 'h-11 gap-2.5',
    picked: 'border-2 border-selected px-4',
    unpicked: 'border border-line bg-subtle px-[17px] hover:border-selected',
    mark: 'size-[18px] rounded-full',
    dot: 'size-2 rounded-full',
    label: 'text-[14px] leading-[21px]',
  },
  L: {
    box: 'h-12 gap-3',
    picked: 'border-2 border-selected bg-white px-4',
    unpicked: 'border border-line bg-subtle px-[15px] hover:border-selected',
    mark: 'size-[18px] rounded-full',
    dot: 'size-2 rounded-full',
    label: 'text-[14px] leading-[21px]',
  },
};

export function Radio({
  label,
  checked,
  onChange,
  name,
  size = 'S',
  block,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: () => void;
  name: string;
  size?: RadioSize;
  /** Spans its container, as the 包廂 pair and the payment rows do. */
  block?: boolean;
}) {
  const spec = RADIO[size];
  return (
    <label
      data-comp={`Radio/${size}`}
      className={cx(
        'cursor-pointer items-center rounded-control transition-colors',
        block ? 'flex w-full' : 'inline-flex',
        spec.box,
        checked ? spec.picked : spec.unpicked,
      )}
    >
      <span
        className={cx('flex shrink-0 items-center justify-center border p-px', spec.mark, checked ? 'border-selected' : 'border-line')}
        aria-hidden
      >
        {checked ? <span className={cx('bg-selected', spec.dot)} /> : null}
      </span>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      <span className={cx(spec.label, 'text-ink', checked || size !== 'S' ? 'font-medium' : 'font-normal')}>
        {label}
      </span>
    </label>
  );
}

/** `size=S` — the 冰塊／甜度 chips. */
export function RadioChip(props: Omit<Parameters<typeof Radio>[0], 'size' | 'block'>) {
  return <Radio {...props} size="S" />;
}

/** `size=M` — the full-width 包廂／加購飲品 pair in 客製化料理. */
export function RadioBox(props: Omit<Parameters<typeof Radio>[0], 'size'>) {
  return <Radio {...props} size="M" block />;
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

/** `[Comp] Field` (822:459) — 44px, 8px radius, bg/input over border/default,
 *  15px of horizontal padding, Restaurant/body with a text/placeholder hint. */
const CONTROL =
  'h-11 w-full rounded-control border border-line bg-inputbg px-[15px] text-body text-ink transition-colors ' +
  'placeholder:text-ink-placeholder hover:border-selected focus:border-brand ' +
  'disabled:bg-off-bg disabled:text-off-text';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  /** The 聯絡資料 and 訂位查詢 forms label at Restaurant/label (14/21); the
   *  credit-card form drops to 13px. */
  labelSize = 'label',
}: {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  labelSize?: 'label' | 'label-sm';
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className={cx(labelSize === 'label' ? 'text-label' : 'text-label-sm', 'text-ink')}>
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
