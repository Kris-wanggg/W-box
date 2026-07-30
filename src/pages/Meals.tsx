import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENU } from '../data/menu';
import {
  emptyCustomOrder,
  emptySetSelection,
  findItem,
  isCustomOrderComplete,
} from '../lib/pricing';
import { useBooking } from '../store/BookingContext';
import type { MealCategory } from '../types';
import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { MealCard } from '../components/meals/MealCard';
import { OrderSummary } from '../components/meals/OrderSummary';
import { SetEditor } from '../components/meals/SetEditor';
import { CustomOrderForm } from '../components/meals/CustomOrderForm';
import { DrinkCustomizer, emptyDrinkOptions } from '../components/meals/DrinkCustomizer';

const TABS = [
  { id: 'set', label: '套餐' },
  { id: 'single', label: '單品' },
  { id: 'drink', label: '飲品' },
  { id: 'custom', label: '客製化料理' },
] as const;

const CATEGORY_LABEL: Record<MealCategory, string> = {
  set: '套餐',
  single: '單品',
  drink: '飲品',
  custom: '客製化料理',
};

/**
 * Figma: `Restaurant/choose-set|choose-meal|choose-drink|custom` —
 * one screen with four category tabs, 步驟 2 / 3.
 */
export default function Meals() {
  const navigate = useNavigate();
  const booking = useBooking();
  const [category, setCategory] = useState<MealCategory>('set');
  /** itemId of the card whose inline editor is open, if any. */
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Guard: this step needs a date + time from 步驟 1.
  useEffect(() => {
    if (booking.date === null || booking.time === null) navigate('/', { replace: true });
  }, [booking.date, booking.time, navigate]);

  const items = MENU.filter((m) => m.category === category);
  const editing = openItem === null ? undefined : findItem(openItem);
  const customDraft = booking.customLine?.custom ?? emptyCustomOrder();

  const nextDisabled =
    booking.customLine !== undefined && !isCustomOrderComplete(customDraft);

  return (
    <PageShell backLabel="選擇日期" backTo="/" step={2}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-r-h1 text-text-primary">選擇餐點</h1>
            <p className="text-r-note text-text-secondary">
              {editing !== undefined && editing.category === 'set'
                ? `編輯「${editing.name}」的內容：請完成主餐、附餐、飲料與甜點的選擇。`
                : '可先加入餐點，也可略過直接完成訂位。'}
            </p>
          </div>

          <Tabs
            tabs={TABS}
            value={category}
            onChange={(id) => {
              setCategory(id);
              setOpenItem(null);
            }}
            ariaLabel="餐點分類"
          />

          {category === 'custom' ? (
            <CustomOrderForm value={customDraft} onChange={booking.upsertCustom} />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <p className="text-r-note text-text-secondary">
                  目前分類：{CATEGORY_LABEL[category]} ‧ 共 {items.length} 項
                </p>
                {category === 'drink' && (
                  <p className="text-r-note text-text-secondary">
                    飲品可設定冰塊、甜度與加料；冰塊／甜度為必選單選，加料為可複選。
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-3">
                {items.map((item) => {
                  const line = booking.lines.find((l) => l.itemId === item.id);
                  const isOpen = openItem === item.id;
                  const editable = item.groups !== undefined;

                  return (
                    <MealCard
                      key={item.id}
                      item={item}
                      qty={booking.qtyOf(item.id)}
                      onQty={(qty) => booking.setQty(item.id, qty)}
                      customizeLabel={
                        category === 'drink'
                          ? '客製化'
                          : editable
                            ? '自訂套餐'
                            : undefined
                      }
                      onCustomize={
                        category === 'drink' || editable
                          ? () => setOpenItem(isOpen ? null : item.id)
                          : undefined
                      }
                    >
                      {isOpen && category === 'set' && (
                        <SetEditor
                          item={item}
                          initial={line?.set ?? emptySetSelection()}
                          onCancel={() => setOpenItem(null)}
                          onSubmit={(selection) => {
                            booking.upsertSet(item.id, selection);
                            setOpenItem(null);
                          }}
                        />
                      )}

                      {isOpen && category === 'drink' && (
                        <DrinkCustomizer
                          item={item}
                          initial={line?.drink ?? emptyDrinkOptions()}
                          onCancel={() => setOpenItem(null)}
                          onSubmit={(options) => {
                            booking.upsertDrink(item.id, options);
                            setOpenItem(null);
                          }}
                        />
                      )}
                    </MealCard>
                  );
                })}
              </ul>
            </>
          )}
        </Card>

        <div className="lg:w-[420px] lg:shrink-0">
          <OrderSummary
            lines={booking.lines}
            subtotal={booking.subtotal}
            onQty={booking.setQty}
            onClearCustom={booking.clearCustom}
            onNext={() => navigate('/contact')}
            nextDisabled={nextDisabled}
          />
          {nextDisabled && (
            <p className="mt-2 text-r-note text-status-error">
              客製化料理尚有必填項目未完成，請補齊或清除設定後再繼續。
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
