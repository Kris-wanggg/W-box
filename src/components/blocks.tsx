/**
 * Composite blocks that repeat across many frames:
 * `Order Summary Card`, `Reservation Info Card`, `Status Header`,
 * `Deposit Rules Card`.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { findItem, type MenuItem } from '../data/menu';
import {
  BOOKING_ID,
  CANCEL_RULES,
  DEPOSIT_LEGAL,
  DEPOSIT_RULES,
  RESTAURANT,
} from '../data/reservation';
import { lineExtra, linePrice, useBooking, type CartLine } from '../store';
import { InfoIcon } from './icons';
import { Badge, Button, Card, CardTitle, Divider, Money, Stepper, cx } from './ui';

/* ── Order summary (right-hand column of the ordering screens) ───────────── */

export function OrderSummaryCard({
  cta = '下一步：填寫聯絡資訊',
  ctaTo = '/contact',
  editingKey,
  onCta,
}: {
  cta?: string;
  ctaTo?: string;
  /** Line currently open in the set editor — its content is expanded below. */
  editingKey?: string;
  onCta?: () => void;
}) {
  const { cart, itemCount, subtotal, setQty, custom } = useBooking();
  const editing = cart.find((line) => line.key === editingKey);

  return (
    <Card>
      <CardTitle note={`共 ${itemCount} 項`}>已選餐點</CardTitle>

      {cart.length === 0 && !custom ? (
        <p className="rounded-sm border border-dashed border-line py-8 text-center text-[13px] leading-[19.5px] text-ink-muted">
          尚未加入任何餐點
          <br />
          可先完成訂位，到店再點餐。
        </p>
      ) : (
        <ul className="flex flex-col gap-3 pt-3">
          {cart.map((line) => {
            const item = findItem(line.itemId);
            if (!item) return null;
            const extra = lineExtra(line, item);
            return (
              <li key={line.key} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 text-sm leading-[21px] text-ink">{item.name}</span>
                  <Stepper
                    size="sm"
                    label={item.name}
                    value={line.qty}
                    onChange={(next) => setQty(line.key, next)}
                  />
                  <Money value={linePrice(line, item) * line.qty} className="w-[52px] text-right text-sm font-medium text-brand" />
                </div>
                {extra > 0 ? (
                  <div className="flex items-center justify-between text-xs leading-[18px] text-ink-muted">
                    <span>└ 內容加價（升級 {countUpgrades(line, item)} 項）</span>
                    <span>+${extra}</span>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {custom ? (
        <div className="flex items-center justify-between rounded-sm bg-brand-tint px-3 py-2 text-sm text-ink">
          <span>客製化點餐 ‧ {custom.eventType}</span>
          <span className="font-medium text-brand">${custom.budget} / 桌</span>
        </div>
      ) : null}

      {editing ? <EditingBreakdown line={editing} /> : null}

      <Divider />

      <div className="flex items-center justify-between">
        <span className="text-base font-medium leading-6 text-ink">小計</span>
        <Money value={subtotal} className="text-[22px] font-bold leading-[33px] text-brand" />
      </div>

      <div className="pt-1">
        {onCta ? (
          <Button block onClick={onCta}>
            {cta}
          </Button>
        ) : (
          <Link to={ctaTo} className="block">
            <Button block tabIndex={-1}>
              {cta}
            </Button>
          </Link>
        )}
      </div>

      <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-muted">
        <span aria-hidden>ⓘ</span>
        套餐內容可於訂位成立前修改；加價項目以現場出餐為準。
      </p>
    </Card>
  );
}

/** Only the picked options that actually cost extra count as an "升級". */
function countUpgrades(line: CartLine, item: MenuItem): number {
  return (item.groups ?? []).reduce(
    (count, group) =>
      count +
      (line.selections[group.id] ?? []).filter(
        (id) => (group.options.find((o) => o.id === id)?.extra ?? 0) > 0,
      ).length,
    0,
  );
}

/** `Order Item List (… ‧ 內容)` — the per-group breakdown shown while editing. */
function EditingBreakdown({ line }: { line: CartLine }) {
  const item = findItem(line.itemId);
  if (!item?.groups) return null;

  return (
    <>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-ink">{item.name} ‧ 內容</span>
          <Badge tone="brand">編輯中</Badge>
        </div>
        {item.groups.map((group) => {
          const picked = (line.selections[group.id] ?? [])
            .map((id) => {
              const opt = group.options.find((o) => o.id === id);
              if (!opt) return null;
              const pref = line.drinkPrefs[opt.id];
              const label = opt.extra ? `${opt.name} +$${opt.extra}` : opt.name;
              return pref ? `${label}（${pref.ice}／${pref.sugar}）` : label;
            })
            .filter(Boolean)
            .join(' ‧ ');
          return (
            <div key={group.id} className="flex justify-between gap-3 text-xs leading-[18px]">
              <span className="shrink-0 text-ink-muted">{group.label.replace(/（.*/, '')}</span>
              <span className="text-right text-ink">{picked || '—'}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Status header (success / warning / error screens) ───────────────────── */

export function StatusHeader({
  glyph,
  title,
  description,
  tone = 'ok',
}: {
  glyph: string;
  title: string;
  description?: ReactNode;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}) {
  const tones: Record<string, string> = {
    ok: 'bg-ok/10 text-ok',
    warn: 'bg-warn/10 text-warn',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };

  return (
    <header className="flex flex-col items-center gap-3 pt-2 text-center">
      <span className={cx('flex size-16 items-center justify-center rounded-full text-[28px]', tones[tone])}>
        {glyph}
      </span>
      <h1 className="text-[24px] font-bold leading-8 text-ink">{title}</h1>
      {description ? <p className="max-w-[520px] text-sm leading-[21px] text-ink-muted">{description}</p> : null}
    </header>
  );
}

/* ── Reservation info card ───────────────────────────────────────────────── */

export type ReservationStatus = '已確認' | '已取消' | '候補中' | '待付款';

export function ReservationInfoCard({
  status,
  paid,
  onReschedule,
}: {
  status?: ReservationStatus;
  paid?: boolean;
  onReschedule?: string;
}) {
  const { slotLabel, partyLabel, contact, deposit } = useBooking();

  const rows: Array<[string, ReactNode]> = [
    ['訂位編號', BOOKING_ID],
    ['訂位人', contact.name],
    ['聯絡電話', contact.phone],
    ['餐廳名稱', RESTAURANT],
    [
      '日期時段',
      <span className="flex items-center gap-3">
        {slotLabel}
        {onReschedule ? (
          <Link to={onReschedule} className="text-[13px] font-semibold text-brand hover:text-brand-hover">
            修改訂位
          </Link>
        ) : null}
      </span>,
    ],
    ['用餐人數', partyLabel],
  ];

  return (
    <Card>
      <CardTitle>
        <span className="flex items-center gap-3">
          訂位資訊
          {status ? (
            <Badge tone={status === '已取消' ? 'danger' : status === '已確認' ? 'ok' : 'warn'}>{status}</Badge>
          ) : null}
        </span>
      </CardTitle>

      <dl className="flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <dt className="text-sm leading-[21px] text-ink-muted">{label}</dt>
            <dd className="text-right text-sm leading-[21px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <Divider />

      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-muted">訂金金額</span>
        <span className="flex items-center gap-3">
          <Money value={deposit} className="text-base font-medium text-ink" />
          <Badge tone={paid ? 'ok' : 'warn'}>{paid ? '已付款' : '未付款'}</Badge>
        </span>
      </div>
    </Card>
  );
}

/* ── Deposit / cancellation rules ────────────────────────────────────────── */

export function DepositRulesCard() {
  return (
    <Card>
      <h2 className="text-base font-medium leading-6 text-ink">訂金付款規則</h2>
      <ul className="flex flex-col gap-1.5 text-[13px] leading-[19.5px] text-ink-muted">
        {DEPOSIT_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <Divider />

      <h2 className="text-base font-medium leading-6 text-ink">訂位取消規則</h2>
      <ul className="flex flex-col gap-1.5 text-[13px] leading-[19.5px] text-ink-muted">
        {CANCEL_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-muted">
        <InfoIcon size={14} className="mt-0.5 shrink-0" />
        {DEPOSIT_LEGAL}
      </p>
    </Card>
  );
}
