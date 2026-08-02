/**
 * Figma: `Header` > `Header Bar`
 *
 * Contains the Back Button and the Step Badge ("步驟 2 / 3").
 * Rendered as a real <header>/<nav> pair per CLAUDE.md's semantic-tag rule.
 */
export interface NavbarProps {
  backLabel: string;
  onBack: () => void;
  step?: { current: number; total: number };
  links?: { label: string; onSelect: () => void }[];
}

export function Navbar({ backLabel, onBack, step, links = [] }: NavbarProps) {
  return (
    <header className="border-b border-divider bg-surface">
      <nav
        aria-label="主要導覽"
        className="mx-auto flex w-full max-w-[1180px] flex-col items-start gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6"
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-body-base text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary active:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden="true">‹</span>
          {backLabel}
        </button>

        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={link.onSelect}
              className="rounded-md px-2 py-1 text-heading-h2 text-primary transition-colors hover:bg-surface-alt active:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {link.label}
            </button>
          ))}

          {step && (
            <p className="rounded-sm bg-surface-muted px-[10px] py-[5px] text-label-medium text-text-secondary">
              步驟 {step.current} / {step.total}
            </p>
          )}
        </div>
      </nav>
    </header>
  );
}
