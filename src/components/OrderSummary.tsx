import {
  computeSubtotal,
  setUpcharge,
  upgradeCount,
  useBooking,
  type SetSelection,
} from '../state/BookingContext';
import { byId, twd, type MenuItem } from '../data/menu';
import { Card } from './ui';

const CN_WEEK = ['日', '一', '二', '三', '四', '五', '六'];
function fmtDate(d: Date | null) {
  if (!d) return '—';
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(
    d.getDate()
  ).padStart(2, '0')} (${CN_WEEK[d.getDay()]})`;
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
  /** when set, that set's customized content is expanded in the summary */
  editingSetId?: string | null;
}) {
  const { booking } = useBooking();

  const setLines = Object.entries(booking.setSelections)
    .map(([id, sel]) => ({ set: byId(id), sel }))
    .filter((l): l is { set: MenuItem; sel: SetSelection } => !!l.set);

  const cartLines = Object.entries(booking.cart)
    .map(([id, qty]) => ({ item: byId(id), qty }))
    .filter((l) => l.item && l.qty > 0);

  const itemCount =
    setLines.reduce((n, l) => n + l.sel.qty, 0) +
    cartLines.reduce((n, l) => n + l.qty, 0);

  const subtotal = computeSubtotal(booking);
  const editingSet = editingSetId
    ? setLines.find((l) => l.set.id === editingSetId)
    : undefined;

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

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-cream-dim">已選餐點</span>
        <span className="text-xs text-muted">共 {itemCount} 項</span>
      </div>

      {setLines.length === 0 && cartLines.length === 0 ? (
        <p className="text-sm text-muted">尚未選擇餐點（可略過）</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {setLines.map(({ set, sel }) => {
            const up = setUpcharge(set, sel);
            return (
              <li key={set.id} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-cream">
                    {set.name} <span className="text-muted">×{sel.qty}</span>
                  </span>
                  <span className="text-cream-dim">
                    {twd(set.price * sel.qty)}
                  </span>
                </div>
                {up > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>└ 內容加價（升級 {upgradeCount(set, sel)} 項）</span>
                    <span className="text-gold">+{twd(up * sel.qty)}</span>
                  </div>
                )}
              </li>
            );
          })}
          {cartLines.map((l) => (
            <li key={l.item!.id} className="flex items-center justify-between">
              <span className="text-cream">
                {l.item!.name} <span className="text-muted">×{l.qty}</span>
              </span>
              <span className="text-cream-dim">{twd(l.item!.price * l.qty)}</span>
            </li>
          ))}
        </ul>
      )}

      {editingSet && <SetBreakdown set={editingSet.set} sel={editingSet.sel} />}

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

export { totalGuests } from '../state/BookingContext';
