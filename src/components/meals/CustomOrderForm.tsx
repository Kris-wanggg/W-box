import { useState } from 'react';
import { ADD_ON_DRINKS, EVENT_TYPES, TABLE_PRICES } from '../../data/menu';
import { currency } from '../../lib/format';
import { addOnCounts, addOnSubtotal } from '../../lib/pricing';
import type { AddOnDrink, CustomOrder } from '../../types';
import { Chip, Radio } from '../ui/Choice';
import { Stepper } from '../ui/Stepper';
import { Tabs } from '../ui/Tabs';

/**
 * Figma: `Restaurant/custom/default` (668:3754) and
 * `Restaurant/custom/add drink` (668:3458).
 *
 * Edits are pushed up on every change — the summary card mirrors them live
 * as "客製化點餐（進行中）".
 */
interface CustomOrderFormProps {
  value: CustomOrder;
  onChange: (next: CustomOrder) => void;
}

const ADD_ON_TABS = [
  { id: 'all', label: '全部' },
  { id: '養身飲品', label: '養身飲品' },
  { id: '酒', label: '酒' },
  { id: '熱飲（壺）', label: '熱飲(壺)' },
  { id: '冷飲', label: '冷飲' },
] as const;

type AddOnTab = (typeof ADD_ON_TABS)[number]['id'];

export function CustomOrderForm({ value, onChange }: CustomOrderFormProps) {
  const [tab, setTab] = useState<AddOnTab>('all');

  const patch = (p: Partial<CustomOrder>) => onChange({ ...value, ...p });

  const visible: AddOnDrink[] =
    tab === 'all' ? ADD_ON_DRINKS : ADD_ON_DRINKS.filter((d) => d.group === tab);

  const counts = addOnCounts(value);
  const addOnTotal = addOnSubtotal(value);

  return (
    <div className="flex flex-col gap-6">
      <Group label="活動類型（單選）" required>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              checked={value.eventType === type}
              onChange={() => patch({ eventType: type })}
            />
          ))}
        </div>
      </Group>

      <Group
        label="桌菜價位（單選）"
        required
        note="可選：6,800／8,800／10,800／13,800／15,000 以上"
      >
        <div className="flex flex-wrap gap-2">
          {TABLE_PRICES.map((price) => (
            <Chip
              key={price}
              label={`${price.toLocaleString('en-US')}${price === 15000 ? ' 以上' : ''}`}
              checked={value.pricePerTable === price}
              onChange={() => patch({ pricePerTable: price })}
            />
          ))}
        </div>
      </Group>

      <Group
        label="是否需要包廂（單選）"
        required
        note="包廂低消：10 人包廂 $11,000 ‧ 12 人包廂 $12,000 ‧ 15 人包廂 $15,000"
      >
        <div className="flex flex-col gap-2 md:flex-row">
          {(['不需要', '需要'] as const).map((opt) => (
            <Radio
              key={opt}
              name="private-room"
              label={opt}
              checked={value.privateRoom === opt}
              onChange={() => patch({ privateRoom: opt })}
            />
          ))}
        </div>
      </Group>

      <Group
        label="是否加購飲品"
        required
        note="整桌加購以壺／瓶為單位計價；未勾選的品項不計入金額。分類：養身飲品／酒／熱飲（壺）／冷飲。"
      >
        <div className="flex flex-col gap-2 md:flex-row">
          {(['現場需求加購', '需要加購'] as const).map((opt) => (
            <Radio
              key={opt}
              name="drink-addon"
              label={opt}
              checked={value.drinkAddOn === opt}
              onChange={() =>
                patch({ drinkAddOn: opt, addOnQty: opt === '現場需求加購' ? {} : value.addOnQty })
              }
            />
          ))}
        </div>

        {value.drinkAddOn === '需要加購' && (
          <div className="mt-3 flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
            <Tabs tabs={ADD_ON_TABS} value={tab} onChange={setTab} ariaLabel="加購飲品分類" />

            <ul className="flex flex-col gap-2">
              {visible.map((drink) => {
                const qty = value.addOnQty[drink.id] ?? 0;
                return (
                  <li
                    key={drink.id}
                    className="flex flex-col gap-3 rounded-md border border-border bg-surface p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="flex items-center gap-1.5 text-r-label text-text-primary">
                        {qty > 0 && (
                          <span aria-hidden="true" className="text-brand">
                            ✓
                          </span>
                        )}
                        {drink.name}
                      </p>
                      <p className="text-r-note text-text-secondary">
                        {drink.group} ‧ {drink.yieldNote}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <span className="text-r-label tabular-nums text-text-primary">
                        {currency(drink.price)} / {drink.unit}
                      </span>
                      <Stepper
                        value={qty}
                        itemLabel={drink.name}
                        onChange={(next) =>
                          patch({ addOnQty: { ...value.addOnQty, [drink.id]: next } })
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-baseline justify-between gap-2 border-t border-border pt-3">
              <span className="text-r-note text-text-secondary">
                已選 {counts.kinds} 項 ‧ 共 {counts.units} 件
              </span>
              <span className="text-r-label text-text-primary">
                加購小計 {currency(addOnTotal)}
              </span>
            </div>
          </div>
        )}
      </Group>
    </div>
  );
}

function Group({
  label,
  required = false,
  note,
  children,
}: {
  label: string;
  required?: boolean;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-r-label text-text-primary">
        {required && (
          <span className="mr-1 text-status-error" aria-hidden="true">
            ＊
          </span>
        )}
        {label}
      </legend>
      {children}
      {note !== undefined && <p className="text-r-note text-text-secondary">{note}</p>}
    </fieldset>
  );
}
