import {
  computeSubtotal,
  customTotal,
  drinkItemPrice,
  isCustomActive,
  setUpcharge,
  upgradeCount,
  useBooking,
  type DrinkCartItem,
  type SetSelection,
} from '../state/BookingContext';
import {
  BANQUET_BOTTLES,
  BUDGET_OPTIONS,
  DRINK_TOPPINGS,
  byId,
  twd,
  type MenuItem,
} from '../data/menu';
import { Card } from './ui';

const CN_WEEK = ['日', '一', '二', '三', '四', '五', '六'];
function fmtDate(d: Date | null) {
  if (!d) return '—';
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(
    d.getDate()
  ).padStart(2, '0')} (${CN_WEEK[d.getDay()]})`;
}

function drinkDetail(item: DrinkCartItem): string {
  const tops = item.toppings
    .map((id) => DRINK_TOPPINGS.find((t) => t.id === id)?.name)
    .filter(Boolean);
  return [item.ice, item.sugar, ...tops].join(' · ');
}

/** 訂位摘要 — reused on the meal and contact screens. */
export default function OrderSummary({
  action,
  footnote,
  totalLabel = '小計',
  editingSetId = null,
}: {
  action?: React.ReactNode;
  footnote?: string;
  totalLabel?: string;
  editingSetId?: string | null;
}) {
  const { booking } = useBooking();
  const custom = isCustomActive(booking);

  const setLines = Object.entries(booking.setSelections)
    .map(([id, sel]) => ({ set: byId(id), sel }))
    .filter((l): l is { set: MenuItem; sel: SetSelection } => !!l.set);
  const cartLines = Object.entries(booking.cart)
    .map(([id, qty]) => ({ item: byId(id), qty }))
    .filter((l) => l.item && l.qty > 0);
  const drinkLines = booking.drinkCart;

  const pausedCount =
    setLines.reduce((n, l) => n + l.sel.qty, 0) +
    cartLines.reduce((n, l) => n + l.qty, 0) +
    drinkLines.length;

  const subtotal = computeSubtotal(booking);
  const editingSet = editingSetId
    ? setLines.find((l) => l.set.id === editingSetId)
    : undefined;
  const hasStd = setLines.length || cartLines.length || drinkLines.length;

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-cream">訂位摘要</h2>

      <dl className="flex flex-col gap-2.5 text-sm">
        <Row label="品牌餐廳" value="第28區中餐廳" />
        <Row label="用餐日期" value={fmtDate(booking.date)} />
        <Row label="用餐時段" value={booking.time ?? '—'} />
        <Row
          label="用餐人數"
          value={`成人 ${booking.adults} 位 · 小孩 ${booking.children} 位`}
        />
      </dl>

      <div className="my-4 h-px bg-[rgba(201,146,42,0.2)]" />

      {/* standard items (paused & greyed while a banquet is active) */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-cream-dim">
          已選餐點{custom && '（已暫停）'}
        </span>
        <span className="text-xs text-muted">
          {custom ? `暫停 ${pausedCount} 項` : `共 ${pausedCount} 項`}
        </span>
      </div>

      {!hasStd ? (
        <p className="text-sm text-muted">尚未選擇餐點（可略過）</p>
      ) : (
        <ul
          className={`flex flex-col gap-2 text-sm ${custom ? 'opacity-45' : ''}`}
        >
          {setLines.map(({ set, sel }) => {
            const up = setUpcharge(set, sel);
            return (
              <li key={set.id} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className={custom ? 'text-cream-dim line-through' : 'text-cream'}>
                    {set.name} <span className="text-muted">×{sel.qty}</span>
                  </span>
                  <span className={`text-cream-dim ${custom ? 'line-through' : ''}`}>
                    {twd(set.price * sel.qty)}
                  </span>
                </div>
                {up > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>└ 內容加價（升級 {upgradeCount(set, sel)} 項）</span>
                    <span className={custom ? '' : 'text-gold'}>+{twd(up * sel.qty)}</span>
                  </div>
                )}
              </li>
            );
          })}
          {drinkLines.map((d) => (
            <li key={d.uid} className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className={custom ? 'text-cream-dim line-through' : 'text-cream'}>
                  {byId(d.drinkId)?.name} <span className="text-muted">×1</span>
                </span>
                <span className={`text-cream-dim ${custom ? 'line-through' : ''}`}>
                  {twd(drinkItemPrice(d))}
                </span>
              </div>
              <div className="text-xs text-muted">└ {drinkDetail(d)}</div>
            </li>
          ))}
          {cartLines.map((l) => (
            <li key={l.item!.id} className="flex items-center justify-between">
              <span className={custom ? 'text-cream-dim line-through' : 'text-cream'}>
                {l.item!.name} <span className="text-muted">×{l.qty}</span>
              </span>
              <span className={`text-cream-dim ${custom ? 'line-through' : ''}`}>
                {twd(l.item!.price * l.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {custom && (
        <p className="mt-2 text-xs text-muted">
          切換「套餐 / 單品 / 飲品」分類，剛剛的餐點會暫停計算，金額會以客製為準。
        </p>
      )}

      {editingSet && !custom && (
        <SetBreakdown set={editingSet.set} sel={editingSet.sel} />
      )}

      {custom && <BanquetSummary booking={booking} />}

      <div className="my-4 h-px bg-[rgba(201,146,42,0.2)]" />

      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-cream">{totalLabel}</span>
        <span className="text-xl font-bold text-gold-light">{twd(subtotal)}</span>
      </div>

      {action && <div className="mt-5">{action}</div>}
      {footnote && (
        <p className="mt-3 text-center text-xs text-muted">{footnote}</p>
      )}
    </Card>
  );
}

/** 客製化貼餐（進行中）summary block. */
function BanquetSummary({ booking }: { booking: ReturnType<typeof useBooking>['booking'] }) {
  const c = booking.custom;
  const budgetLabel =
    BUDGET_OPTIONS.find((b) => b.value === c.budget)?.label ??
    (c.budget ? `${twd(c.budget)} / 桌` : '—');
  const bottles = Object.entries(c.bottles)
    .map(([id, q]) => ({ b: BANQUET_BOTTLES.find((x) => x.id === id), q }))
    .filter((x) => x.b && x.q > 0);
  const bottleSum = bottles.reduce((s, x) => s + x.b!.price * x.q, 0);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-cream-dim">客製化貼餐（進行中）</span>
        <span className="text-xs text-gold">整桌預訂</span>
      </div>
      <dl className="flex flex-col gap-1.5 text-sm">
        <Row label="活動類型" value={c.eventType ?? '—'} />
        <Row label="整桌預算" value={budgetLabel} />
        <Row label="是否需要包廂" value={c.room === 'need' ? '需要' : '不需要'} />
        <Row label="加購飲品" value={c.addDrinks ? '需要加購' : '不需要'} />
      </dl>
      {c.addDrinks && bottles.length > 0 && (
        <ul className="mt-1.5 flex flex-col gap-1 text-xs">
          {bottles.map(({ b, q }) => (
            <li key={b!.id} className="flex items-center justify-between text-muted">
              <span>
                └ {b!.name} ×{q}
              </span>
              <span className="text-cream-dim">{twd(b!.price * q)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between pt-0.5">
            <span className="text-cream-dim">加購飲品小計</span>
            <span className="text-cream-dim">{twd(bottleSum)}</span>
          </li>
        </ul>
      )}
    </div>
  );
}

/** Expanded 內容 block for the set currently being edited. */
function SetBreakdown({ set, sel }: { set: MenuItem; sel: SetSelection }) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-cream-dim">{set.name} · 內容</span>
        <span className="text-gold">編輯中</span>
      </div>
      <div className="flex flex-col gap-1.5 rounded-btn border border-gold-faint bg-panel-input p-3 text-xs">
        {(set.groups ?? []).map((g) => {
          const picks = sel.picks[g.key] ?? [];
          const parts = picks.map((id) => {
            const opt = g.options.find((o) => o.id === id);
            if (!opt) return '';
            let s = opt.name;
            if (opt.upcharge) s += ` +${twd(opt.upcharge)}`;
            if (g.isDrink) {
              const d = sel.drinks[id];
              if (d) s += `（${d.ice}／${d.sugar}）`;
            }
            return s;
          });
          return (
            <div key={g.key} className="flex gap-2">
              <span className="w-8 shrink-0 text-muted">{g.label}</span>
              <span className="text-cream-dim">{parts.join('、') || '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-cream-dim">{label}</dt>
      <dd className="font-medium text-cream">{value}</dd>
    </div>
  );
}

export function useSubtotal() {
  const { booking } = useBooking();
  return computeSubtotal(booking);
}

export { customTotal };
export { totalGuests } from '../state/BookingContext';
