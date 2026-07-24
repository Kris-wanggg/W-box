/** Small selectable controls shared by the drink & banquet editors. */
import { CheckIcon } from './icons';

/** Single-select pill with a leading radio dot. */
export function RadioPill({
  label,
  active,
  onClick,
  className = '',
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-gold bg-gold-soft text-cream'
          : 'border-gold-faint text-cream-dim hover:bg-gold-soft'
      } ${className}`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          active ? 'bg-gold-light' : 'bg-transparent ring-1 ring-gold-faint'
        }`}
      />
      {label}
    </button>
  );
}

/** Multi-select chip with a leading checkbox. */
export function CheckChip({
  label,
  suffix,
  active,
  disabled,
  onClick,
}: {
  label: string;
  suffix?: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-btn border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-gold bg-gold-soft text-cream'
          : disabled
            ? 'cursor-not-allowed border-gold-faint/60 text-muted/60'
            : 'border-gold-faint text-cream-dim hover:bg-gold-soft'
      }`}
    >
      <span
        className={`grid h-3.5 w-3.5 place-items-center rounded-[3px] border ${
          active ? 'border-gold bg-gold-gradient' : 'border-gold-faint'
        }`}
      >
        {active && <CheckIcon size={11} className="text-ink" />}
      </span>
      {label}
      {suffix && (
        <span className={active ? 'text-gold-light' : 'text-gold'}>{suffix}</span>
      )}
    </button>
  );
}
