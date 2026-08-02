import { useEffect, useRef } from 'react';
import { Button } from './Button';

/**
 * Figma: `Dialog - del prompt`
 *
 * Confirmation prompt used before destructive actions (刪除餐點 / 取消訂位).
 */
export interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Dialog({
  open,
  title,
  description,
  confirmLabel = '確認刪除',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
}: DialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-full max-w-[496px] flex-col gap-4 rounded-lg border border-border bg-surface p-6"
      >
        <h2 className="text-heading-h3 text-text-primary">{title}</h2>
        {description && (
          <p className="text-body-small text-text-secondary">{description}</p>
        )}
        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button ref={confirmRef} variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
