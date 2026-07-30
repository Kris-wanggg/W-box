import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Card({
  children,
  className,
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'aside' | 'div';
}) {
  return (
    <Tag
      className={cn(
        'rounded-lg border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(19,17,30,0.04)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** The ⓘ / ⚠ footnote block that sits under most cards. */
export function Notice({
  icon = 'ⓘ',
  tone = 'info',
  children,
}: {
  icon?: string;
  tone?: 'info' | 'warning';
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 rounded-md px-3 py-2 text-r-note',
        tone === 'warning'
          ? 'bg-status-warning/10 text-text-primary'
          : 'bg-background text-text-secondary',
      )}
    >
      <span aria-hidden="true" className="shrink-0 leading-[19.5px]">
        {icon}
      </span>
      <span>{children}</span>
    </p>
  );
}

/** A label / value row — used by 訂位摘要, 訂位資訊, 訂金狀態. */
export function InfoRow({
  label,
  children,
  action,
}: {
  label: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="shrink-0 text-r-note text-text-secondary">{label}</dt>
      <dd className="flex items-center gap-2 text-right text-r-label text-text-primary">
        {children}
        {action}
      </dd>
    </div>
  );
}
