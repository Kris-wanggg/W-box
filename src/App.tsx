import { cloneElement } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import { SCREENS } from './screens';
import { BookingProvider } from './store';

export default function App() {
  return (
    <BookingProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/index" element={<Index />} />
        {/* Several screens are variants of the same component (Order, Reserve,
            …). Keying by path forces a remount on navigation so each variant
            starts from its own initial state instead of inheriting the last
            one's — otherwise e.g. /order-set-open would render as /order. */}
        {SCREENS.map((screen) => (
          <Route key={screen.path} path={screen.path} element={cloneElement(screen.element, { key: screen.path })} />
        ))}
        <Route path="*" element={<Navigate to="/index" replace />} />
      </Routes>
      <ScreenIndexLauncher />
    </BookingProvider>
  );
}

/** Every screen is a separate page in the test build; start each at the top. */
function ScrollToTop() {
  const { pathname } = useLocation();
  if (typeof window !== 'undefined') {
    queueMicrotask(() => window.scrollTo(0, 0));
  }
  return <span hidden data-path={pathname} />;
}

/** Always-available jump back to the screen index while testing on a device. */
function ScreenIndexLauncher() {
  const { pathname } = useLocation();
  if (pathname === '/index') return null;

  return (
    <Link
      to="/index"
      className="fixed bottom-5 right-5 z-30 inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-4 text-[13px] font-medium text-white shadow-pop transition-colors hover:bg-brand"
    >
      全部畫面
    </Link>
  );
}
