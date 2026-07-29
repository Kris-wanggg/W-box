/**
 * Page chrome shared by every screen in the reservation flow.
 *
 * Figma layers: `Header` (sticky, translucent, back button + step badge),
 * `Content Row` (max 1240px, 40/32 padding, 24px gutter), `Shared Footer`
 * (max 1280px, 64/20 padding). The two-column screens stack under `md` so the
 * same build can be tested on a phone.
 */
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from './icons';
import { cx } from './ui';

export function Header({
  backLabel,
  backTo,
  step,
  action,
}: {
  backLabel: string;
  backTo?: string;
  step?: string;
  action?: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-line-soft bg-canvas/70 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-5">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-brand transition-colors hover:bg-brand-tint active:bg-brand-tint"
        >
          <ChevronLeftIcon size={20} />
          <span className="text-[17px] font-bold leading-6 md:text-[20px]">{backLabel}</span>
        </button>

        <div className="flex items-center gap-3">
          {action}
          {step ? (
            <span className="rounded-md bg-badge px-2.5 py-[5px] text-xs font-medium leading-[18px] text-ink-soft">
              {step}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-line-faint bg-white/70">
      <div className="mx-auto flex max-w-footer flex-col items-start justify-between gap-4 px-5 py-5 md:flex-row md:items-center md:px-16">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-black uppercase leading-[18px] tracking-[2.4px] text-ink">
            Restaurant Booking Entrance
          </p>
          <p className="text-[13px] leading-[19.5px] text-ink-muted">
            © 2026 Restaurant Booking Entrance. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 md:gap-10">
          {['隱私政策', '服務條款', '聯繫我們'].map((label) => (
            <a
              key={label}
              href="#/"
              className="rounded-[2px] p-1 text-base leading-6 text-ink-soft transition-colors hover:text-brand"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/** Full screen frame: header + centred content column + footer. */
export function Screen({
  backLabel,
  backTo,
  step,
  headerAction,
  children,
  width = 'wide',
}: {
  backLabel: string;
  backTo?: string;
  step?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  width?: 'wide' | 'narrow';
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header backLabel={backLabel} backTo={backTo} step={step} action={headerAction} />
      <main className="flex w-full flex-1 justify-center">
        <div
          className={cx(
            'flex w-full flex-col gap-6 px-5 py-6 md:px-10 md:py-8',
            width === 'wide' ? 'max-w-content' : 'max-w-[720px]',
          )}
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** `Content Row`: a 716px main column beside a 420px sticky summary column. */
export function TwoColumn({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <div className="min-w-0 flex-1 md:flex-[716_0_0]">{main}</div>
      <div className="w-full md:sticky md:top-24 md:max-w-aside md:flex-[420_0_0]">{aside}</div>
    </div>
  );
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand transition-colors hover:text-brand-hover"
    >
      <ChevronLeftIcon size={16} />
      {children}
    </Link>
  );
}
