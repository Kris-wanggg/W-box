/**
 * Composite blocks that repeat across many frames:
 * `Order Summary Card`, `Reservation Info Card`, `Status Header`,
 * `Deposit Rules Card`.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CUSTOM_DRINKS, findItem, type MenuItem } from '../data/menu';
import {
  BOOKING_ID,
  CANCEL_RULES,
  DEPOSIT_LEGAL,
  DEPOSIT_RULES,
  RESTAURANT,
} from '../data/reservation';
import { customDrinkTotal, lineExtra, linePrice, useBooking, type CartLine } from '../store';
import { InfoIcon } from './icons';
import { Badge, Button, Card, CardTitle, Divider, Money, Stepper } from './ui';

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
        <p className="rounded-tile border border-dashed border-line py-8 text-center text-[13px] leading-[19.5px] text-ink-secondary">
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
                  <div className="flex items-center justify-between text-xs leading-[18px] text-ink-secondary">
                    <span>└ 內容加價（升級 {countUpgrades(line, item)} 項）</span>
                    <span>+${extra}</span>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {custom ? <CustomOrderBlock /> : null}

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

      <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-secondary">
        <span aria-hidden>ⓘ</span>
        套餐內容可於訂位成立前修改；加價項目以現場出餐為準。
      </p>
    </Card>
  );
}

/**
 * `客製化點餐（進行中）` — the design keeps this readout, and its 清除設定
 * control, in the summary column rather than at the foot of the form.
 */
function CustomOrderBlock() {
  const { custom, set } = useBooking();
  if (!custom) return null;

  const drinks = CUSTOM_DRINKS.filter((d) => (custom.drinkQty[d.id] ?? 0) > 0);
  const drinkTotal = customDrinkTotal(custom);

  return (
    <>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-ink">客製化點餐（進行中）</span>
          <span className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-brand">整桌預訂</span>
            {/* `[Comp] Button (清除設定)` 839:1192 — 28px, border/default, 12/18. */}
            <Button size="mini" variant="quiet" onClick={() => set('custom', null)}>
              清除設定
            </Button>
          </span>
        </div>

        <dl className="flex flex-col gap-1.5 text-xs leading-[18px]">
          {(
            [
              ['活動類型', custom.eventType],
              ['整桌預算', `$${custom.budget} / 桌`],
              ['是否需要包廂', custom.privateRoom],
              ['加購飲品', custom.addDrinks === '需要加購' ? '需要加購' : '不需要'],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt className="text-ink-secondary">{label}</dt>
              <dd className="text-right text-ink">{value}</dd>
            </div>
          ))}

          {drinks.map((drink) => (
            <div key={drink.id} className="flex justify-between gap-3">
              <dt className="text-ink-secondary">
                └ {drink.name} ×{custom.drinkQty[drink.id]}
              </dt>
              <dd className="text-right text-brand">${drink.price * custom.drinkQty[drink.id]}</dd>
            </div>
          ))}

          {drinkTotal ? (
            <div className="flex justify-between gap-3 pt-1">
              <dt className="text-ink-secondary">加購飲品小計</dt>
              <dd className="text-right font-medium text-ink">${drinkTotal.toLocaleString('en-US')}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </>
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
          <Badge tone="confirm">編輯中</Badge>
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
              <span className="shrink-0 text-ink-secondary">{group.label.replace(/（.*/, '')}</span>
              <span className="text-right text-ink">{picked || '—'}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Status header (success / warning / error screens) ───────────────────── */

/**
 * `Status Header`. Every state — success, waiting, cancel-confirm — uses the
 * same brand-olive ring with a brand glyph inside; the design does not switch
 * the mark to a semantic colour, and the circle is an outline, not a fill.
 */
export function StatusHeader({
  glyph,
  title,
  description,
}: {
  glyph: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="flex flex-col items-center gap-3 pt-6 text-center">
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-brand text-[18px] text-brand"
      >
        {glyph}
      </span>
      <h1 className="text-[22px] font-bold leading-8 text-ink">{title}</h1>
      {description ? <p className="max-w-[520px] text-[13px] leading-[19.5px] text-ink-secondary">{description}</p> : null}
    </header>
  );
}

/**
 * `Action Buttons`: two equal-width controls spanning the content column.
 *
 * `flex-1` is scoped to the row breakpoint on purpose. In the stacked column
 * it would land on the main axis, where `flex-basis: 0` overrides the button's
 * own height — collapsing a 48px CTA to its text height on a phone.
 */
export function ActionRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:[&>*]:flex-1">{children}</div>;
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
        {/* `[Comp] Button (修改訂位)` 839:1413 — 28px, border/active, 12/18. */}
        {onReschedule ? (
          <Link to={onReschedule}>
            <Button size="mini" variant="outline" tabIndex={-1}>
              修改訂位
            </Button>
          </Link>
        ) : null}
      </span>,
    ],
    ['用餐人數', partyLabel],
  ];

  return (
    <Card>
      <CardTitle
        size="sm"
        note={status ? <Badge tone={status === '已取消' ? 'warning' : 'confirm'}>{status}</Badge> : undefined}
      >
        訂位資訊
      </CardTitle>

      <dl className="flex flex-col gap-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-[13px] leading-[19.5px] text-ink-secondary">{label}</dt>
            <dd className="text-right text-[13px] leading-[19.5px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <Divider />

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-secondary">訂金金額</span>
        <span className="flex items-center gap-2">
          <Money value={deposit} className="text-sm font-semibold text-brand" />
          <Badge tone={paid ? 'success' : 'warning'}>{paid ? '已付款' : '未付款'}</Badge>
        </span>
      </div>
    </Card>
  );
}

/* ── Deposit / cancellation rules ────────────────────────────────────────── */

export function DepositRulesCard() {
  return (
    <Card>
      <h2 className="text-sm font-semibold leading-5 text-ink">訂金付款規則</h2>
      <ul className="flex flex-col gap-1.5 text-[13px] leading-[19.5px] text-ink-secondary">
        {DEPOSIT_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <Divider />

      <h2 className="text-sm font-semibold leading-5 text-ink">訂位取消規則</h2>
      <ul className="flex flex-col gap-1.5 text-[13px] leading-[19.5px] text-ink-secondary">
        {CANCEL_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-secondary">
        <InfoIcon size={14} className="mt-0.5 shrink-0" />
        {DEPOSIT_LEGAL}
      </p>
    </Card>
  );
}
