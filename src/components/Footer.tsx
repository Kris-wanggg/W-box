/** Shared footer used across every screen (Figma node 492:58 "SharedFooter"). */
export default function Footer() {
  return (
    <footer className="w-full border-t border-gold-line bg-black/70">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-y-4 px-6 py-5 sm:px-16">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
            Restaurant Booking Entrance
          </p>
          <p className="text-[13px] text-muted">
            © 2026 Restaurant Booking Entrance. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-6 sm:gap-10">
          {['隱私政策', '服務條款', '聯繫我們'].map((label) => (
            <a
              key={label}
              href="#"
              className="rounded-sm p-1 text-base text-cream-dim transition-colors hover:text-gold-light"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
