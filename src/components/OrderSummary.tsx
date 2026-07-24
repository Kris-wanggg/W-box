import { totalGuests, useBooking } from '../state/BookingContext';
import { byId, twd } from '../data/menu';
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
}: {
  action?: React.ReactNode;
  footnote?: string;
  totalLabel?: string;
}) {
  const { booking } = useBooking();
  const lines = Object.entries(booking.cart)
    .map(([id, qty]) => ({ item: byId(id), qty }))
    .filter((l) => l.item && l.qty > 0);
  const subtotal = lines.reduce((sum, l) => sum + l.item!.price * l.qty, 0);

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
        <span className="text-xs text-muted">共 {lines.length} 項</span>
      </div>

      {lines.length === 0 ? (
        <p className="text-sm text-muted">尚未選擇餐點（可略過）</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {lines.map((l) => (
            <li key={l.item!.id} className="flex items-center justify-between">
              <span className="text-cream">
                {l.item!.name} <span className="text-muted">×{l.qty}</span>
              </span>
              <span className="text-cream-dim">{twd(l.item!.price * l.qty)}</span>
            </li>
          ))}
        </ul>
      )}

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
  return Object.entries(booking.cart).reduce((sum, [id, qty]) => {
    const item = byId(id);
    return item ? sum + item.price * qty : sum;
  }, 0);
}

export { totalGuests };
