/**
 * Figma: `Restaurant/choose-set/{default,empty,open}`, `Restaurant/choose-meal`,
 * `Restaurant/choose-drink/{default,open,open-2cups}`,
 * `Restaurant/custom/{default,add drink}`.
 *
 * One screen with four category tabs. The set cards open an inline editor
 * (`choose-set/open`) and the drink cards open an ice/sugar/topping customiser
 * (`choose-drink/open`), which is what the separate frames capture as states.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { OrderSummaryCard } from '../components/blocks';
import { ChevronDownIcon } from '../components/icons';
import { Screen, TwoColumn } from '../components/layout';
import { Button, Card, Divider, Money, Notice, Stepper, Tab, Textarea, Tile, cx } from '../components/ui';
import {
  BUDGETS,
  CATEGORY_TABS,
  CUSTOM_DRINK_GROUPS,
  EVENT_TYPES,
  ICE_OPTIONS,
  MENU,
  ROOM_HINT,
  SUGAR_OPTIONS,
  TOPPING_OPTIONS,
  findItem,
  type Category,
  type MenuItem,
  type OptionGroup,
} from '../data/menu';
import { lineExtra, useBooking, type CartLine, type DrinkPref } from '../store';

const DEFAULT_PREF: DrinkPref = { ice: '正常冰', sugar: '正常糖', toppings: [] };

/** Pre-filled editor content, so a variant route can reproduce its Figma frame. */
export type EditorPreset = {
  selections: Record<string, string[]>;
  drinkPrefs: Record<string, DrinkPref>;
};

export default function Order({
  initialCategory = 'set',
  openEditor,
  openDrink,
  preset,
  empty = false,
}: {
  initialCategory?: Category;
  /** Item id whose set editor is open on load — the `choose-set/open` frame. */
  openEditor?: string;
  /** Item id whose drink customiser is open on load. */
  openDrink?: string;
  preset?: EditorPreset;
  empty?: boolean;
}) {
  const store = useBooking();
  const { cart, addLine, setQty, clearCart } = store;
  const [category, setCategory] = useState<Category>(initialCategory);
  const [editing, setEditing] = useState<string | undefined>(openEditor);
  const [drinkEditing, setDrinkEditing] = useState<string | undefined>(openDrink);

  useEffect(() => {
    if (empty) clearCart();
    if (openEditor && preset) {
      addLine({ key: openEditor, itemId: openEditor, qty: 1, note: '', ...preset });
    }
    // Seeding is a one-off, to put the screen into the state its frame captures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = MENU[category];
  const summaryLabel =
    category === 'custom'
      ? '目前分類：客製化料理'
      : `目前分類：${CATEGORY_TABS.find((t) => t.id === category)?.label} ‧ 共 ${items.length} 項`;

  const qtyOf = (itemId: string) => cart.find((l) => l.key === itemId)?.qty ?? 0;
  const changeQty = (item: MenuItem, next: number) => {
    if (next > 0 && !cart.some((l) => l.key === item.id)) {
      addLine({ key: item.id, itemId: item.id, qty: next, selections: {}, drinkPrefs: {}, note: '' });
    } else {
      setQty(item.id, next);
    }
  };

  return (
    <Screen backLabel="選擇日期" backTo="/" step="步驟 2 / 3">
      <TwoColumn
        main={
          <Card>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold leading-7 text-ink">選擇餐點</h1>
              <p className="pt-[3px] text-sm leading-[21px] text-ink-muted">
                {editing ? `編輯「${findItem(editing)?.name}」的內容：請完成主餐、附餐、飲料與甜點的選擇。` : '可先加入餐點，也可略過直接完成訂位。'}
              </p>
            </div>

            <nav className="flex flex-wrap gap-2" aria-label="餐點分類">
              {CATEGORY_TABS.map((tab) => (
                <Tab
                  key={tab.id}
                  active={tab.id === category}
                  onClick={() => {
                    setCategory(tab.id);
                    setEditing(undefined);
                    setDrinkEditing(undefined);
                  }}
                >
                  {tab.label}
                </Tab>
              ))}
            </nav>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-[21px] text-ink">
                {editing ? '目前分類：套餐 ‧ 編輯套餐內容' : summaryLabel}
              </p>
              {editing ? <span className="text-xs text-ink-muted">＊ 為必選組別</span> : null}
            </div>

            {category === 'drink' && !drinkEditing ? (
              <p className="text-[13px] leading-[19.5px] text-ink-muted">
                飲品可設定冰塊、甜度與加料；冰塊／甜度為必選單選，加料為可複選。
              </p>
            ) : null}

            {category === 'custom' ? (
              <CustomMealForm />
            ) : editing ? (
              <SetEditor itemId={editing} preset={preset} onClose={() => setEditing(undefined)} />
            ) : (
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <MealCard
                      item={item}
                      qty={qtyOf(item.id)}
                      line={cart.find((l) => l.key === item.id)}
                      onQty={(next) => changeQty(item, next)}
                      onCustomise={
                        item.category === 'set'
                          ? () => setEditing(item.id)
                          : item.category === 'drink'
                            ? () => setDrinkEditing(drinkEditing === item.id ? undefined : item.id)
                            : undefined
                      }
                      customiseOpen={drinkEditing === item.id}
                    >
                      {drinkEditing === item.id ? (
                        <DrinkCustomizer
                          item={item}
                          onDone={() => setDrinkEditing(undefined)}
                          cups={Math.max(1, qtyOf(item.id))}
                        />
                      ) : null}
                    </MealCard>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        }
        aside={<OrderSummaryCard editingKey={editing} />}
      />
    </Screen>
  );
}

/* ── Meal card ───────────────────────────────────────────────────────────── */

function MealCard({
  item,
  qty,
  line,
  onQty,
  onCustomise,
  customiseOpen,
  children,
}: {
  item: MenuItem;
  qty: number;
  line?: CartLine;
  onQty: (next: number) => void;
  onCustomise?: () => void;
  customiseOpen?: boolean;
  children?: ReactNode;
}) {
  const extra = line ? lineExtra(line, item) : 0;

  return (
    <Tile muted={qty === 0} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-brand/15 bg-gradient-to-br from-[#DCD6D3] to-[#D8D1D4] text-[20px]"
        >
          {item.glyph}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[15px] font-medium leading-[21px] text-ink">{item.name}</p>
          <p className="text-[13px] leading-[19.5px] text-ink-muted">{item.description}</p>
          {item.detail ? <p className="pt-px text-xs leading-[18px] text-brand-soft">{item.detail}</p> : null}
        </div>

        <div className="shrink-0 pt-0.5 text-right">
          <Money value={item.price} className="text-[15px] font-medium leading-[22.5px] text-ink" />
          {extra > 0 ? <p className="text-xs text-brand-soft">＋內容加價 ${extra}</p> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {onCustomise ? (
          <Button variant="outline" size="md" onClick={onCustomise} aria-expanded={customiseOpen}>
            {item.category === 'set' ? '自訂套餐' : '客製化'}
            <ChevronDownIcon size={20} className={cx('transition-transform', customiseOpen && 'rotate-180')} />
          </Button>
        ) : null}
        <Stepper label={item.name} value={qty} onChange={onQty} />
      </div>

      {children}
    </Tile>
  );
}

/* ── Set editor (`choose-set/open`) ──────────────────────────────────────── */

function SetEditor({ itemId, preset, onClose }: { itemId: string; preset?: EditorPreset; onClose: () => void }) {
  const item = findItem(itemId)!;
  const { cart, addLine } = useBooking();
  const current = cart.find((l) => l.key === itemId);

  const [selections, setSelections] = useState<Record<string, string[]>>(
    preset?.selections ?? current?.selections ?? {},
  );
  const [prefs, setPrefs] = useState<Record<string, DrinkPref>>(preset?.drinkPrefs ?? current?.drinkPrefs ?? {});
  const [note, setNote] = useState(current?.note ?? '');

  const draft: CartLine = { key: itemId, itemId, qty: current?.qty ?? 1, selections, drinkPrefs: prefs, note };
  const extra = lineExtra(draft, item);

  const toggle = (group: OptionGroup, optionId: string) => {
    setSelections((prev) => {
      const picked = prev[group.id] ?? [];
      if (picked.includes(optionId)) {
        return { ...prev, [group.id]: picked.filter((id) => id !== optionId) };
      }
      if (picked.length >= group.pick) return prev;
      return { ...prev, [group.id]: [...picked, optionId] };
    });
    if (group.customisable) {
      setPrefs((prev) => (prev[optionId] ? prev : { ...prev, [optionId]: { ...DEFAULT_PREF } }));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tile className="flex flex-col gap-3">
        <div className="flex gap-3">
          <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-brand/15 bg-gradient-to-br from-[#DCD6D3] to-[#D8D1D4] text-[20px]">
            {item.glyph}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-ink">{item.name} ×{draft.qty}</p>
            <p className="text-[13px] text-ink-muted">{item.description}｜編輯內容中</p>
          </div>
          <div className="shrink-0 text-right">
            <Money value={item.price} className="text-[15px] font-medium text-ink" />
            {extra > 0 ? <p className="text-xs text-brand-soft">＋內容加價 ${extra}</p> : null}
          </div>
        </div>
      </Tile>

      <p className="text-[13px] leading-[19.5px] text-ink-muted">
        每組請依指定份數勾選，額滿後其餘選項會暫停選取；飲料勾選後可於下方各自設定冰塊與甜度。
      </p>

      {item.groups?.map((group, index) => {
        const picked = selections[group.id] ?? [];
        const full = picked.length >= group.pick;
        return (
          <section key={group.id} className="flex flex-col gap-3">
            {index > 0 ? <Divider /> : null}

            <header className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-1 text-sm font-medium text-ink">
                {group.required ? <span className="text-danger">＊</span> : null}
                {group.label}
              </h3>
              <span className={cx('text-xs', full ? 'text-brand' : 'text-ink-muted')}>
                已選 {picked.length} / {group.pick}
                {full ? ` ‧ ${group.customisable ? '勾選後於下方設定冰塊與甜度' : '已額滿，其餘暫停選取'}` : ''}
              </span>
            </header>

            <div className="grid gap-2 sm:grid-cols-2">
              {group.options.map((option) => {
                const checked = picked.includes(option.id);
                const disabled = !checked && full;
                return (
                  <label
                    key={option.id}
                    className={cx(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                      checked ? 'border-brand bg-brand-tint text-ink' : 'border-line text-ink hover:bg-brand-tint',
                      disabled && 'cursor-not-allowed opacity-45 hover:bg-transparent',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-brand"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(group, option.id)}
                    />
                    <span className="flex-1">{option.name}</span>
                    {option.extra ? <span className="text-xs text-brand-soft">+${option.extra}</span> : null}
                  </label>
                );
              })}
            </div>

            {group.customisable
              ? picked.map((optionId) => {
                  const option = group.options.find((o) => o.id === optionId)!;
                  const pref = prefs[optionId] ?? DEFAULT_PREF;
                  return (
                    <Tile key={optionId} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">{option.name}</span>
                        <span className="text-xs text-brand-soft">{option.extra ? `+$${option.extra}` : '$0'}</span>
                      </div>
                      <RadioRow
                        label="冰塊"
                        required
                        options={ICE_OPTIONS}
                        value={pref.ice}
                        onChange={(v) => setPrefs((p) => ({ ...p, [optionId]: { ...pref, ice: v } }))}
                      />
                      <RadioRow
                        label="甜度"
                        required
                        options={SUGAR_OPTIONS}
                        value={pref.sugar}
                        onChange={(v) => setPrefs((p) => ({ ...p, [optionId]: { ...pref, sugar: v } }))}
                      />
                    </Tile>
                  );
                })
              : null}
          </section>
        );
      })}

      <Divider />

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-ink">整份套餐的其他需求（選填）</h3>
          <span className="text-xs text-ink-muted">{note.length} / 50</span>
        </div>
        <Textarea
          maxLength={50}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="例：牛排七分熟、其中一份不加香菜"
        />
      </section>

      <Tile className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-ink">
            此套餐小計 <Money value={item.price + extra} className="text-brand" />
          </span>
          <span className="text-xs text-ink-muted">
            （套餐 ${item.price.toLocaleString('en-US')} ＋ 內容加價 ${extra}）
          </span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="md" onClick={onClose}>
            取消
          </Button>
          <Button
            size="md"
            onClick={() => {
              addLine({ key: itemId, itemId, qty: draft.qty, selections, drinkPrefs: prefs, note });
              onClose();
            }}
          >
            更新套餐內容
          </Button>
        </div>
      </Tile>
    </div>
  );
}

/* ── Drink customiser (`choose-drink/open`, `open-2cups`) ────────────────── */

function DrinkCustomizer({ item, cups, onDone }: { item: MenuItem; cups: number; onDone: () => void }) {
  const { cart, addLine } = useBooking();
  const line = cart.find((l) => l.key === item.id);
  const [prefs, setPrefs] = useState<Record<string, DrinkPref>>(() => {
    const seed: Record<string, DrinkPref> = {};
    for (let i = 0; i < cups; i += 1) seed[`cup-${i}`] = line?.drinkPrefs[`cup-${i}`] ?? { ...DEFAULT_PREF };
    return seed;
  });

  const update = (cup: string, patch: Partial<DrinkPref>) =>
    setPrefs((p) => ({ ...p, [cup]: { ...p[cup], ...patch } }));

  return (
    <div className="flex flex-col gap-3 border-t border-line-soft pt-3">
      {Object.keys(prefs).map((cup, i) => {
        const pref = prefs[cup];
        return (
          <div key={cup} className="flex flex-col gap-3 rounded-sm bg-black/[0.02] p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                {item.name}
                {cups > 1 ? ` ‧ 第 ${i + 1} 杯` : ''}
              </span>
              <span className="text-xs text-brand-soft">
                {pref.toppings.length ? `+$${pref.toppings.length * 20}` : '$0'}
              </span>
            </div>

            <RadioRow label="冰塊" required options={ICE_OPTIONS} value={pref.ice} onChange={(v) => update(cup, { ice: v })} />
            <RadioRow label="甜度" required options={SUGAR_OPTIONS} value={pref.sugar} onChange={(v) => update(cup, { sugar: v })} />

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-ink">加料（可複選）</span>
              <div className="flex flex-wrap gap-2">
                {TOPPING_OPTIONS.map((topping) => {
                  const checked = pref.toppings.includes(topping.id);
                  return (
                    <label
                      key={topping.id}
                      className={cx(
                        'flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition-colors',
                        checked ? 'border-brand bg-brand-tint text-brand' : 'border-line text-ink hover:bg-brand-tint',
                      )}
                    >
                      <input
                        type="checkbox"
                        className="size-3.5 accent-brand"
                        checked={checked}
                        onChange={() =>
                          update(cup, {
                            toppings: checked
                              ? pref.toppings.filter((t) => t !== topping.id)
                              : [...pref.toppings, topping.id],
                          })
                        }
                      />
                      {topping.name} +${topping.extra}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="md" onClick={onDone}>
          取消
        </Button>
        <Button
          size="md"
          onClick={() => {
            addLine({
              key: item.id,
              itemId: item.id,
              qty: Math.max(1, line?.qty ?? 1),
              selections: {},
              drinkPrefs: prefs,
              note: '',
            });
            onDone();
          }}
        >
          更新飲品設定
        </Button>
      </div>
    </div>
  );
}

function RadioRow({
  label,
  options,
  value,
  onChange,
  required,
}: {
  /** Omitted when an enclosing <Fieldset> legend already names the group. */
  label?: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      {label ? (
        <legend className="flex items-center gap-1 pb-1 text-[13px] font-medium text-ink">
          {label}
          {required ? <span className="text-danger">＊</span> : null}
        </legend>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cx(
              'flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition-colors',
              option === value ? 'border-brand bg-brand-tint text-brand' : 'border-line text-ink hover:bg-brand-tint',
            )}
          >
            <input
              type="radio"
              className="size-3.5 accent-brand"
              checked={option === value}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── 客製化料理 (`custom/default`, `custom/add drink`) ────────────────────── */

function CustomMealForm() {
  const { custom, set } = useBooking();
  const [eventType, setEventType] = useState(custom?.eventType ?? '謝師宴');
  const [budget, setBudget] = useState(custom?.budget ?? '10,800');
  const [room, setRoom] = useState<'不需要' | '需要'>(custom?.privateRoom ?? '不需要');
  const [addDrinks, setAddDrinks] = useState<'現場需求加購' | '需要加購'>(custom?.addDrinks ?? '現場需求加購');
  const [drinkIds, setDrinkIds] = useState<string[]>(custom?.drinkIds ?? []);

  const drinkTotal = useMemo(
    () =>
      CUSTOM_DRINK_GROUPS.flatMap((g) => g.options)
        .filter((o) => drinkIds.includes(o.id))
        .reduce((sum, o) => sum + o.extra, 0),
    [drinkIds],
  );

  return (
    <div className="flex flex-col gap-6">
      <Fieldset legend="活動類型（單選）" required>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={type === eventType}
              onClick={() => setEventType(type)}
              className={cx(
                'h-9 rounded-lg border px-3 text-[13px] transition-colors',
                type === eventType
                  ? 'border-brand bg-brand-tint font-medium text-brand'
                  : 'border-line text-ink hover:bg-brand-tint',
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="整桌預算（單選）" required hint={`可選：${BUDGETS.join('／')}`}>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={b === budget}
              onClick={() => setBudget(b)}
              className={cx(
                'h-9 rounded-lg border px-3 text-[13px] transition-colors',
                b === budget ? 'border-brand bg-brand-tint font-medium text-brand' : 'border-line text-ink hover:bg-brand-tint',
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="是否需要包廂（單選）" required hint={ROOM_HINT}>
        <RadioRow options={['不需要', '需要']} value={room} onChange={(v) => setRoom(v as typeof room)} />
      </Fieldset>

      <Fieldset
        legend="是否加購飲品"
        required
        hint="整桌加購以壺／瓶為單位計價；未勾選的品項不計入金額。分類：養身飲品／酒／熱飲（壺）／冷飲。"
      >
        <RadioRow
          options={['現場需求加購', '需要加購']}
          value={addDrinks}
          onChange={(v) => setAddDrinks(v as typeof addDrinks)}
        />

        {addDrinks === '需要加購' ? (
          <div className="mt-3 flex flex-col gap-4">
            {CUSTOM_DRINK_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-ink">{group.label}</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.options.map((option) => {
                    const checked = drinkIds.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={cx(
                          'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                          checked ? 'border-brand bg-brand-tint' : 'border-line hover:bg-brand-tint',
                        )}
                      >
                        <input
                          type="checkbox"
                          className="size-4 accent-brand"
                          checked={checked}
                          onChange={() =>
                            setDrinkIds((prev) =>
                              checked ? prev.filter((id) => id !== option.id) : [...prev, option.id],
                            )
                          }
                        />
                        <span className="flex-1">{option.name}</span>
                        <span className="text-xs text-brand-soft">+${option.extra}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Fieldset>

      <Notice tone="neutral">
        客製化點餐：<span className="font-medium text-brand">${budget} / 桌</span>
        {drinkTotal ? <span className="text-brand-soft">（＋加購飲品 ${drinkTotal}）</span> : null}
        ；金額以現場確認菜色為準。
      </Notice>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setDrinkIds([]);
            setAddDrinks('現場需求加購');
            setRoom('不需要');
            set('custom', null);
          }}
        >
          清除設定
        </Button>
        <Button size="md" onClick={() => set('custom', { eventType, budget, privateRoom: room, addDrinks, drinkIds })}>
          套用客製化設定
        </Button>
      </div>
    </div>
  );
}

function Fieldset({
  legend,
  required,
  hint,
  children,
}: {
  legend: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="flex items-center gap-1 pb-2 text-sm font-medium text-ink">
        {required ? <span className="text-danger">＊</span> : null}
        {legend}
      </legend>
      {children}
      {hint ? <p className="pt-1 text-xs leading-[18px] text-ink-muted">{hint}</p> : null}
    </fieldset>
  );
}
