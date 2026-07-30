/** Figma: `Shared Footer` */
const LINKS = ['隱私政策', '服務條款', '聯繫我們'];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-r-label tracking-wide text-text-primary">
            RESTAURANT BOOKING ENTRANCE
          </p>
          <p className="text-r-note text-text-secondary">
            © 2026 Restaurant Booking Entrance. All rights reserved.
          </p>
        </div>

        <nav aria-label="頁尾導覽">
          <ul className="flex flex-wrap gap-2">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="inline-flex h-8 items-center rounded-md px-2 text-r-note text-text-secondary transition-colors hover:bg-brand-tint hover:text-brand active:bg-brand-tint-strong"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
