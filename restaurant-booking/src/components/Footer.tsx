/**
 * Figma: `Shared Footer` > `Footer Container`
 */
const footerLinks = ['隱私政策', '服務條款', '聯繫我們'];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-divider bg-surface-alt">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-label-medium tracking-widest text-text-primary">
            RESTAURANT BOOKING ENTRANCE
          </p>
          <p className="text-caption text-text-muted">
            © 2026 Restaurant Booking Entrance. All rights reserved.
          </p>
        </div>
        <nav aria-label="頁尾導覽">
          <ul className="flex flex-col gap-2 md:flex-row md:gap-6">
            {footerLinks.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="rounded-sm text-body-small text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
