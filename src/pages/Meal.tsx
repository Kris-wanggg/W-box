import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import OrderSummary from '../components/OrderSummary';
import SetMealCard from '../components/SetMealCard';
import { Card, PrimaryButton } from '../components/ui';
import { MinusIcon, PlusIcon } from '../components/icons';
import {
  defaultSelection,
  useBooking,
  type SetSelection,
} from '../state/BookingContext';
import {
  CATEGORY_TABS,
  MENU,
  twd,
  type MenuCategory,
  type MenuItem,
} from '../data/menu';

/** Restaurant/choose-set — Figma nodes 492:3136 (default) + 497:3658 (editor). */
export default function Meal() {
  const navigate = useNavigate();
  const { booking, update } = useBooking();
  const [tab, setTab] = useState<MenuCategory>('set');
  const [editingId, setEditingId] = useState<string | null>(null);
  const snapshot = useRef<{ id: string; sel: SetSelection } | null>(null);

  const items = MENU.filter((m) => m.category === tab);

  // ── set-meal (套餐) handlers ────────────────────────────────
  const patchSets = (next: Record<string, SetSelection>) =>
    update({ setSelections: next });

  const selectSet = (set: MenuItem) =>
    patchSets({ ...booking.setSelections, [set.id]: defaultSelection(set) });

  const removeSet = (id: string) => {
    const next = { ...booking.setSelections };
    delete next[id];
    patchSets(next);
    if (editingId === id) setEditingId(null);
  };

  const changeSet = (id: string, sel: SetSelection) =>
    patchSets({ ...booking.setSelections, [id]: sel });

  const openEditor = (id: string) => {
    snapshot.current = { id, sel: booking.setSelections[id] };
    setEditingId(id);
  };

  const cancelEditor = () => {
    if (snapshot.current) {
      changeSet(snapshot.current.id, snapshot.current.sel);
    }
    snapshot.current = null;
    setEditingId(null);
  };

  const closeEditor = () => {
    snapshot.current = null;
    setEditingId(null);
  };

  // ── simple items (單品 / 飲品 / 客製化) handlers ──────────────
  const setQty = (id: string, qty: number) => {
    const cart = { ...booking.cart };
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    update({ cart });
  };

  const editingSet = MENU.find((m) => m.id === editingId);
  const catLabel = CATEGORY_TABS.find((t) => t.key === tab)?.label;

  return (
    <Layout>
      <TopBar backLabel="選擇日期與人數" backTo="/reservation" step="步驟 2 / 3" />

      <div className="mx-auto grid w-full max-w-content gap-6 px-2 py-4 lg:grid-cols-[1fr_380px]">
        {/* Left: menu */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-cream">選擇餐點</h2>
          <p className="mb-4 text-sm text-muted">
            {editingSet
              ? `編輯「${editingSet.name}」的內容：請完成主餐、附餐、飲料與甜點的選擇。`
              : '可先加入餐點，也可略過直接完成訂位。'}
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
              目前分類：{catLabel}
              {tab === 'set' && editingId ? ' · 編輯套餐內容' : `，共 ${items.length} 項`}
            </span>
            {tab === 'set' && !editingId && <span>* 為必選組別</span>}
          </div>

          <div className="flex flex-col gap-3">
            {tab === 'set'
              ? items.map((set) => (
                  <SetMealCard
                    key={set.id}
                    set={set}
                    selection={booking.setSelections[set.id]}
                    editing={editingId === set.id}
                    onSelect={() => selectSet(set)}
                    onRemove={() => removeSet(set.id)}
                    onQty={(qty) =>
                      changeSet(set.id, {
                        ...booking.setSelections[set.id],
                        qty,
                      })
                    }
                    onEdit={() => openEditor(set.id)}
                    onChange={(sel) => changeSet(set.id, sel)}
                    onCancel={cancelEditor}
                    onDone={closeEditor}
                  />
                ))
              : items.map((item) => (
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
            editingSetId={editingId}
            action={
              <PrimaryButton
                onClick={() => navigate('/contact')}
                className="text-base"
              >
                下一步：填寫聯絡資料
              </PrimaryButton>
            }
            footnote="套餐內容可於訂位成立前修改；加價項目以現場出餐為準。"
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
              加入餐點
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
