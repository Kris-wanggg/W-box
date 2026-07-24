import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** Gold gradient primary button (Figma "Button/Primary"). */
export function PrimaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-btn bg-gold-gradient px-5 py-4 text-center text-xl font-medium text-ink transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/** Outlined gold "ghost" button (Figma "Button/Ghost"). */
export function GhostButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-btn border border-[rgba(201,146,42,0.55)] px-5 py-4 text-center text-xl font-medium text-gold transition-colors hover:bg-gold-soft ${className}`}
    >
      {children}
    </button>
  );
}

/** The translucent, gold-bordered content card used on every screen. */
export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full rounded-card border border-gold-soft bg-panel shadow-hero ${className}`}
    >
      {children}
    </div>
  );
}

/** Small gold pill/badge (e.g. "訂位模式：提供客製化點餐"). */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-badge border border-gold bg-gold-soft px-3 py-1.5 text-xs font-medium text-gold-light">
      {children}
    </span>
  );
}

/**
 * Booking-flow step indicator. `current` is 1-based.
 * Steps: 訂位 → 選餐 → 聯絡資訊 → 完成
 */
export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  active
                    ? 'bg-gold-gradient text-ink'
                    : done
                      ? 'bg-gold/30 text-gold-light'
                      : 'border border-gold-faint text-muted'
                }`}
              >
                {n}
              </span>
              <span
                className={`text-sm ${active ? 'text-cream' : 'text-muted'}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="h-px w-6 bg-[rgba(201,146,42,0.3)]" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
