import { currency } from '../../lib/format';
import type { MenuItem } from '../../types';
import { Button } from '../ui/Button';
import { Stepper } from '../ui/Stepper';

/** Figma: `Meal Card` inside every choose-* frame. */
interface MealCardProps {
  item: MenuItem;
  qty: number;
  onQty: (qty: number) => void;
  /** 套餐 → 自訂套餐, 飲品 → 客製化. Omitted for 單品. */
  customizeLabel?: string;
  onCustomize?: () => void;
  /** Rendered under the card — the inline editor / customiser panel. */
  children?: React.ReactNode;
}

export function MealCard({
  item,
  qty,
  onQty,
  customizeLabel,
  onCustomize,
  children,
}: MealCardProps) {
  return (
    <li className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand/40">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-[20px] leading-7">
            {item.emoji}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="text-r-h2 text-text-primary">{item.name}</h3>
            <p className="text-r-note text-text-secondary">{item.description}</p>
            {item.detail !== undefined && (
              <p className="text-r-note text-text-secondary">
                <span aria-hidden="true" className="mr-1 text-brand">
                  ✓
                </span>
                {item.detail}
              </p>
            )}
          </div>
          <span className="shrink-0 text-r-label tabular-nums text-text-primary">
            {currency(item.price)}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {customizeLabel !== undefined && onCustomize !== undefined && (
            <Button variant="secondary" size="md" onClick={onCustomize}>
              {customizeLabel}
            </Button>
          )}
          <Stepper value={qty} itemLabel={item.name} onChange={onQty} />
        </div>
      </div>

      {children}
    </li>
  );
}
