import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

/** Figma: `Header` → `Header Bar` (Back Button + optional Step Badge). */
interface HeaderProps {
  backLabel: string;
  backTo: string;
  step?: 1 | 2 | 3;
  /** Extra controls to the left of the step badge (e.g. 編輯套餐). */
  actions?: ReactNode;
}

export function Header({ backLabel, backTo, step, actions }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between gap-4 px-5">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="inline-flex items-center gap-1 rounded-md py-1 pr-2 text-r-label text-text-secondary transition-colors hover:text-brand active:text-brand-active"
        >
          <ChevronLeft />
          {backLabel}
        </button>

        <div className="flex items-center gap-3">
          {actions}
          {step !== undefined && (
            <span className="rounded-pill bg-brand-tint px-3 py-1 text-r-note text-brand">
              步驟 {step} / 3
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M12.5 15.5 7 10l5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
