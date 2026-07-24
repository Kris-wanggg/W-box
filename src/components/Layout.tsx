import type { ReactNode } from 'react';
import Footer from './Footer';

/**
 * Full-height page shell: dim warm backdrop (stand-in for the Figma hero photo),
 * a scrollable content area, and the shared footer pinned to the bottom.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="hero-backdrop flex min-h-full flex-col">
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
