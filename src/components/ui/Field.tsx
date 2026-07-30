import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const CONTROL =
  'w-full rounded-md border border-input-border bg-input-bg px-4 text-r-body text-text-primary ' +
  'placeholder:text-placeholder transition-colors ' +
  'hover:border-brand/60 focus:border-brand ' +
  'disabled:cursor-not-allowed disabled:bg-background disabled:text-text-muted';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  /** Helper copy under the control, e.g. 用於接收 LINE／簡訊 訂位通知 */
  hint?: string;
}

/** Figma: `[Comp] Field` */
export function Field({ label, required = false, hint, className, ...rest }: FieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      {label !== undefined && (
        <Label htmlFor={id} label={label} required={required} />
      )}
      <input id={id} className={cn(CONTROL, 'h-12', className)} {...rest} />
      {hint !== undefined && <p className="text-r-note text-text-secondary">{hint}</p>}
    </div>
  );
}

interface NoteFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  optionalLabel?: string;
  value: string;
  maxLength: number;
}

/** The "其他自訂需求（選填）" textarea with its 0 / 50 counter. */
export function NoteField({
  label,
  optionalLabel = '（選填）',
  value,
  maxLength,
  className,
  ...rest
}: NoteFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-r-label text-text-primary">
          {label}
          <span className="text-text-secondary">{optionalLabel}</span>
        </label>
        <span className="text-r-note tabular-nums text-text-secondary">
          {value.length} / {maxLength}
        </span>
      </div>
      <textarea
        id={id}
        rows={2}
        value={value}
        maxLength={maxLength}
        className={cn(CONTROL, 'resize-none py-3', className)}
        {...rest}
      />
    </div>
  );
}

export function Label({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-r-label text-text-primary">
      {label}
      {required && (
        <span className="ml-1 text-status-error" aria-hidden="true">
          ＊
        </span>
      )}
      {required && <span className="sr-only">（必填）</span>}
    </label>
  );
}
