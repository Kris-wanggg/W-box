import { cn } from '../../lib/cn';

/** Figma: `[Comp] Tab` */
interface TabsProps<T extends string> {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}

export function Tabs<T extends string>({ tabs, value, onChange, ariaLabel }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'h-9 rounded-md border px-3 text-r-label transition-colors',
              active
                ? 'border-brand bg-brand text-brand-contrast hover:bg-brand-hover'
                : 'border-input-border bg-surface text-text-secondary hover:border-brand hover:text-brand active:bg-brand-tint',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
