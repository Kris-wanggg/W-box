import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '../../lib/cn';

interface PageShellProps {
  backLabel: string;
  backTo: string;
  step?: 1 | 2 | 3;
  headerActions?: ReactNode;
  children: ReactNode;
  /** Narrow, centred column — used by the confirmation / payment screens. */
  narrow?: boolean;
}

export function PageShell({
  backLabel,
  backTo,
  step,
  headerActions,
  children,
  narrow = false,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header backLabel={backLabel} backTo={backTo} step={step} actions={headerActions} />
      <main className="flex-1 px-5 py-8">
        <div
          className={cn(
            'mx-auto w-full',
            narrow ? 'max-w-[640px]' : 'max-w-content',
          )}
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
