import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import OrderSummary from '../components/OrderSummary';
import { Card, PrimaryButton } from '../components/ui';
import { MinusIcon, PlusIcon } from '../components/icons';
import { useBooking } from '../state/BookingContext';
import {
  CATEGORY_TABS,
  MENU,
  twd,
  type MenuCategory,
  type MenuItem,
} from '../data/menu';

/** Restaurant/choose-set — Figma node 492:3136. Menu selection. */
export default function Meal() {
  const navigate = useNavigate();
  const { booking, update } = useBooking();
  const [tab, setTab] = useState<MenuCategory>('set');

  const items = MENU.filter((m) => m.category === tab);

  const setQty = (id: string, qty: number) => {
    const cart = { ...booking.cart };
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    update({ cart });
  };

  return (
    <Layout>
      <TopBar backLabel="選擇日期與人數" backTo="/reservation" step="步驟 2 / 3" />

      <div className="mx-auto grid w-full max-w-content gap-6 px-2 py-4 lg:grid-cols-[1fr_380px]">
        {/* Left: menu */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-cream">選擇餐點</h2>
          <p className="mb-4 text-sm text-muted">
            可先加入餐點，也可略過直接完成訂位。
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {CATEGORY_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  tab === t.key
                    ? 'bg-gold-gradient font-medium text-ink'
                    : 'border border-gold-faint text-cream-dim hover:bg-gold-soft'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between text-xs text-muted">
            <span>
              目前分類：
              {CATEGORY_TABS.find((t) => t.key === tab)?.label}，共 {items.length} 項
            </span>
            <span>可上下捲動</span>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <MealRow
                key={item.id}
                item={item}
                qty={booking.cart[item.id] ?? 0}
                onChange={(q) => setQty(item.id, q)}
              />
            ))}
          </div>
        </Card>

        {/* Right: summary */}
        <div>
          <OrderSummary
            action={
              <PrimaryButton
                onClick={() => navigate('/contact')}
                className="text-base"
              >
                下一步：填寫聯絡資料
              </PrimaryButton>
            }
            footnote="也可略過餐點選擇，直接前往填寫聯絡資料"
          />
        </div>
      </div>
    </Layout>
  );
}

function MealRow({
  item,
  qty,
  onChange,
}: {
  item: MenuItem;
  qty: number;
  onChange: (q: number) => void;
}) {
  const selected = qty > 0;
  return (
    <div
      className={`flex items-start gap-4 rounded-card border p-4 transition-colors ${
        selected
          ? 'border-gold bg-gold-soft/40'
          : 'border-gold-faint bg-panel-soft'
      }`}
    >
      <div
        className={`h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br ${item.thumb}`}
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium text-cream">{item.name}</p>
          <p className="whitespace-nowrap font-semibold text-gold-light">
            {twd(item.price)}
          </p>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted">{item.desc}</p>

        <div className="mt-3 flex justify-end">
          {selected ? (
            <div className="flex items-center gap-2 rounded-btn border border-gold-faint bg-panel-input px-2 py-1">
              <button
                aria-label="減少數量"
                onClick={() => onChange(qty - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gold-light hover:bg-gold-soft"
              >
                <MinusIcon size={16} />
              </button>
              <span className="w-6 text-center text-sm text-cream">{qty}</span>
              <button
                aria-label="增加數量"
                onClick={() => onChange(qty + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gold-light hover:bg-gold-soft"
              >
                <PlusIcon size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onChange(1)}
              className="rounded-btn border border-[rgba(201,146,42,0.55)] px-4 py-1.5 text-sm font-medium text-gold transition-colors hover:bg-gold-soft"
            >
              選擇套餐
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
