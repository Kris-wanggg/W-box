import { currency } from '../../lib/format';
import {
  addOnCounts,
  addOnSubtotal,
  findItem,
  lineTotal,
  lineUpcharge,
} from '../../lib/pricing';
import type { CartLine } from '../../types';
import { Button } from '../ui/Button';
import { Card, Notice } from '../ui/Card';
import { Stepper } from '../ui/Stepper';

/** Figma: `Order Summary Card` — shared by every choose-* frame. */
interface OrderSummaryProps {
  lines: CartLine[];
  subtotal: number;
  onQty: (itemId: string, qty: number) => void;
  onClearCustom: () => void;
  onNext: () => void;
  nextDisabled: boolean;
}

export function OrderSummary({
  lines,
  subtotal,
  onQty,
  onClearCustom,
  onNext,
  nextDisabled,
}: OrderSummaryProps) {
  const itemLines = lines.filter((l) => l.kind !== 'custom');
  const customLine = lines.find((l) => l.kind === 'custom');

  return (
    <Card as="aside" className="flex flex-col gap-4 lg:sticky lg:top-[96px]">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-r-h1 text-text-primary">已選餐點</h2>
        <span className="text-r-note text-text-secondary">共 {itemLines.length} 項</span>
      </div>

      {itemLines.length === 0 && customLine === undefined ? (
        <p className="rounded-md border border-dashed border-input-border bg-background px-4 py-6 text-center text-r-note text-text-secondary">
          尚未選擇餐點。您可以先加入餐點，也可以略過直接完成訂位。
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-divider">
          {itemLines.map((line) => (
            <LineRow key={line.id} line={line} onQty={onQty} />
          ))}
          {customLine !== undefined && (
            <CustomRow line={customLine} onClear={onClearCustom} />
          )}
        </ul>
      )}

      <div className="flex items-baseline justify-between gap-2 border-t border-border pt-4">
        <span className="text-r-label text-text-secondary">小計</span>
        <span className="text-r-h1 tabular-nums text-text-primary">
          {currency(subtotal)}
        </span>
      </div>

      <Button size="lg" block disabled={nextDisabled} onClick={onNext}>
        下一步：填寫聯絡資訊
      </Button>

      <Notice>套餐內容可於訂位成立前修改；加價項目以現場出餐為準。</Notice>
    </Card>
  );
}

function LineRow({
  line,
  onQty,
}: {
  line: CartLine;
  onQty: (itemId: string, qty: number) => void;
}) {
  const upcharge = lineUpcharge(line);
  const item = findItem(line.itemId);

  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-r-label text-text-primary">{line.name}</p>
        <Stepper
          size="sm"
          value={line.qty}
          itemLabel={line.name}
          onChange={(next) => onQty(line.itemId, next)}
        />
        <span className="w-[68px] shrink-0 text-right text-r-label tabular-nums text-text-primary">
          {currency(lineTotal(line))}
        </span>
      </div>

      {upcharge > 0 && (
        <p className="flex items-baseline justify-between gap-2 text-r-note text-text-secondary">
          <span>└ 內容加價</span>
          <span className="tabular-nums">+{currency(upcharge * line.qty)}</span>
        </p>
      )}

      {line.set !== undefined && item?.groups !== undefined && (
        <dl className="flex flex-col gap-1 rounded-md bg-background px-3 py-2">
          {item.groups.map((group) => {
            const picked = line.set?.groups[group.id] ?? [];
            if (picked.length === 0) return null;
            return (
              <div key={group.id} className="flex gap-2 text-r-note">
                <dt className="w-10 shrink-0 text-text-secondary">{group.label}</dt>
                <dd className="min-w-0 flex-1 text-text-primary">
                  {picked
                    .map((name) => {
                      const opts = line.set?.drinks[name];
                      if (opts?.ice != null && opts?.sugar != null) {
                        return `${name}（${opts.ice}／${opts.sugar}）`;
                      }
                      return name;
                    })
                    .join(' ‧ ')}
                </dd>
              </div>
            );
          })}
          {line.set.note.length > 0 && (
            <div className="flex gap-2 text-r-note">
              <dt className="w-10 shrink-0 text-text-secondary">備註</dt>
              <dd className="min-w-0 flex-1 text-text-primary">{line.set.note}</dd>
            </div>
          )}
        </dl>
      )}

      {line.drink !== undefined && (
        <dl className="flex flex-col gap-1 rounded-md bg-background px-3 py-2">
          <DrinkRow label="冰塊" value={line.drink.ice ?? '未設定'} />
          <DrinkRow label="甜度" value={line.drink.sugar ?? '未設定'} />
          <DrinkRow
            label="加料"
            value={line.drink.toppings.length > 0 ? line.drink.toppings.join(' ‧ ') : '無'}
          />
          <DrinkRow
            label="其他需求"
            value={line.drink.note.length > 0 ? line.drink.note : '無'}
          />
        </dl>
      )}
    </li>
  );
}

function DrinkRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-r-note">
      <dt className="w-16 shrink-0 text-text-secondary">{label}</dt>
      <dd className="min-w-0 flex-1 text-text-primary">{value}</dd>
    </div>
  );
}

function CustomRow({ line, onClear }: { line: CartLine; onClear: () => void }) {
  const custom = line.custom;
  if (custom === undefined) return null;
  const counts = addOnCounts(custom);
  const addOn = addOnSubtotal(custom);

  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-r-label text-text-primary">客製化點餐（進行中）</p>
        <span className="rounded-pill bg-brand-tint px-2 py-0.5 text-r-note text-brand">
          整桌預訂
        </span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          清除設定
        </Button>
      </div>

      <dl className="flex flex-col gap-1 rounded-md bg-background px-3 py-2">
        <CustomDetail label="活動類型" value={custom.eventType ?? '未選擇'} />
        <CustomDetail
          label="桌菜價位"
          value={
            custom.pricePerTable === null
              ? '未選擇'
              : `${currency(custom.pricePerTable)} / 桌`
          }
        />
        <CustomDetail label="是否需要包廂" value={custom.privateRoom ?? '未選擇'} />
        <CustomDetail
          label="加購飲品"
          value={
            custom.drinkAddOn === '需要加購'
              ? `${counts.kinds} 項 ‧ 共 ${counts.units} 件（${currency(addOn)}）`
              : (custom.drinkAddOn ?? '未選擇')
          }
        />
      </dl>

      <p className="flex items-baseline justify-between gap-2 text-r-label text-text-primary">
        <span className="text-text-secondary">客製化小計</span>
        <span className="tabular-nums">{currency(lineTotal(line))}</span>
      </p>
    </li>
  );
}

function CustomDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-r-note">
      <dt className="w-24 shrink-0 text-text-secondary">{label}</dt>
      <dd className="min-w-0 flex-1 text-text-primary">{value}</dd>
    </div>
  );
}
