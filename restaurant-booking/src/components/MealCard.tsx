import { Button } from './ui/Button';
import { formatCurrency } from '../booking';
import type { MenuItem } from '../data/menu';

/**
 * Figma: `Meal Card/default` and `Meal Card/choose`
 *
 * Responsive layout per CLAUDE.md: `flex flex-col md:flex-row`.
 */
export interface MealCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  selectedCount?: number;
}

export function MealCard({ item, onAdd, selectedCount = 0 }: MealCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary md:flex-row md:items-center">
      <div
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-md bg-surface-alt text-heading-h1"
      >
        {item.icon}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-heading-h3 text-text-primary">{item.name}</h3>
        <p className="text-body-small text-text-secondary">{item.description}</p>
        {selectedCount > 0 && (
          <p className="text-caption text-primary">已選 {selectedCount} 項</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
        <p className="text-heading-h3 text-text-primary">
          {formatCurrency(item.price)}
        </p>
        <Button size="sm" onClick={() => onAdd(item)}>
          加入
        </Button>
      </div>
    </article>
  );
}
