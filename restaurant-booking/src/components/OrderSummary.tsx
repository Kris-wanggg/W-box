import { Button } from './ui/Button';
import {
  cartItemCount,
  cartSubtotal,
  formatCurrency,
  lineTotal,
  type CartLine,
} from '../booking';

/**
 * Figma: `Order Summary Column` > `Order Summary Card`
 *
 * Shows 已選餐點 / 共 N 項 / 小計, plus the empty state from
 * `Restaurant/choose-set/empty`.
 */
export interface OrderSummaryProps {
  cart: CartLine[];
  toppingPrices?: Record<string, number>;
  onRemove: (lineId: string) => void;
}

export function OrderSummary({
  cart,
  toppingPrices = {},
  onRemove,
}: OrderSummaryProps) {
  const count = cartItemCount(cart);
  const subtotal = cartSubtotal(cart, toppingPrices);

  return (
    <aside
      aria-label="已選餐點"
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-heading-h3 text-text-primary">已選餐點</h2>
        <p className="text-body-small text-text-secondary">共 {count} 項</p>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col gap-1 rounded-md bg-surface-alt p-4">
          <p className="text-body-base text-text-primary">尚未選擇餐點</p>
          <p className="text-body-small text-text-secondary">
            可先加入餐點，也可略過直接完成訂位。
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {cart.map((line) => (
            <li
              key={line.lineId}
              className="flex flex-col gap-2 border-b border-divider pb-3 last:border-b-0 last:pb-0 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex flex-col gap-1">
                <p className="text-body-base text-text-primary">{line.item.name}</p>
                <p className="text-caption text-text-muted">
                  {formatCurrency(line.item.price)} × {line.quantity}
                </p>
                {line.options && (line.options.ice || line.options.sugar) && (
                  <p className="text-caption text-text-secondary">
                    需求：{[line.options.ice, line.options.sugar, ...line.options.toppings]
                      .filter(Boolean)
                      .join(' ‧ ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-body-base text-text-primary">
                  {formatCurrency(lineTotal(line, toppingPrices))}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`刪除 ${line.item.name}`}
                  onClick={() => onRemove(line.lineId)}
                >
                  刪除
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-baseline justify-between border-t border-divider pt-3">
        <p className="text-body-base text-text-secondary">小計</p>
        <output
          aria-label="小計金額"
          className="text-heading-h3 text-text-primary"
        >
          {formatCurrency(subtotal)}
        </output>
      </div>

      <p className="flex gap-2 text-caption text-text-muted">
        <span aria-hidden="true">ⓘ</span>
        套餐內容可於訂位成立前修改；加價項目以現場出餐為準。
      </p>
    </aside>
  );
}
