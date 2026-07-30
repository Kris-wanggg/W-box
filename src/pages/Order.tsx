/**
 * Figma: `Restaurant/choose-set/{default,empty,open}`, `Restaurant/choose-meal`,
 * `Restaurant/choose-drink/{default,open,open-2cups}`,
 * `Restaurant/custom/{default,add drink}`.
 *
 * One screen with four category tabs. The set cards open an inline editor
 * (`choose-set/open`) and the drink cards open an ice/sugar/topping customiser
 * (`choose-drink/open`), which is what the separate frames capture as states.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { OrderSummaryCard } from '../components/blocks';
import { ChevronDownIcon } from '../components/icons';
import { Screen, TwoColumn } from '../components/layout';
import {
  Badge,
  Button,
  Card,
  Divider,
  FieldLegend,
  Money,
  OptionChip,
  RadioBox,
  RadioChip,
  Select,
  Stepper,
  Tab,
  Textarea,
  Tile,
  cx,
} from '../components/ui';
import {
  BUDGETS,
  CATEGORY_TABS,
  CUSTOM_DRINKS,
  CUSTOM_DRINK_CATEGORIES,
  EVENT_TYPES,
  ICE_OPTIONS,
  ICE_OPTIONS_COMPACT,
  MENU,
  ROOM_HINT,
  SUGAR_OPTIONS,
  TOPPING_OPTIONS,
  findItem,
  type Category,
  type MenuItem,
  type OptionGroup,
} from '../data/menu';
import { lineExtra, toppingPrice, useBooking, type CartLine, type DrinkPref } from '../store';

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
  cups,
  preset,
  empty = false,
}: {
  initialCategory?: Category;
  /** Item id whose set editor is open on load — the `choose-set/open` frame. */
  openEditor?: string;
  /** Item id whose drink customiser is open on load. */
  openDrink?: string;
  /** Cup count to seed for `openDrink` — the 2-cup frame needs two. */
  cups?: number;
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
    if (openDrink && cups) {
      addLine({ key: openDrink, itemId: openDrink, qty: cups, selections: {}, drinkPrefs: {}, note: '' });
    }
    if (openEditor && preset) {
      addLine({ key: openEditor, itemId: openEditor, qty: 1, note: '', ...preset });
    }
    // The 客製化 frames show the summary already reflecting the form's defaults,
    // so commit them on arrival rather than waiting for the first change.
    if (initialCategory === 'custom' && !store.custom) {
      store.set('custom', {
        eventType: '謝師宴',
        budget: '10,800',
        privateRoom: '不需要',
        addDrinks: openDrink ? '需要加購' : '現場需求加購',
        drinkQty: openDrink ? { longan: 2, oolong: 1 } : {},
      });
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
    <Screen
      backLabel="選擇日期"
      backTo="/"
      step="步驟 2 / 3"
      headerAction={editing ? <Badge>編輯套餐</Badge> : undefined}
    >
      <TwoColumn
        main={
          <Card>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold leading-7 text-ink">選擇餐點</h1>
              <p className="pt-[3px] text-sm leading-[21px] text-ink-secondary">
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
              {editing ? <span className="text-xs text-ink-secondary">＊ 為必選組別</span> : null}
            </div>

            {category === 'drink' && !drinkEditing ? (
              <p className="text-[13px] leading-[19.5px] text-ink-secondary">
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
                        // Keyed by the cup count so the per-cup panels follow
                        // the stepper — including the seeding effect's bump.
                        <DrinkCustomizer
                          key={qtyOf(item.id)}
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
          className="flex size-14 shrink-0 items-center justify-center rounded-control border border-brand/15 bg-gradient-to-br from-[#DCD6D3] to-[#D8D1D4] text-[20px]"
        >
          {item.glyph}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[15px] font-medium leading-[21px] text-ink">{item.name}</p>
          <p className="text-[13px] leading-[19.5px] text-ink-secondary">{item.description}</p>
          {item.detail ? <p className="pt-px text-xs leading-[18px] text-brand-soft">{item.detail}</p> : null}
        </div>

        <div className="shrink-0 pt-0.5 text-right">
          <Money value={item.price} className="text-[15px] font-medium leading-[22.5px] text-ink" />
          {extra > 0 ? <p className="text-xs text-brand-soft">＋內容加價 ${extra}</p> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {onCustomise ? (
          <Button variant="quiet" onClick={onCustomise} aria-expanded={customiseOpen}>
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
          <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-control border border-brand/15 bg-gradient-to-br from-[#DCD6D3] to-[#D8D1D4] text-[20px]">
            {item.glyph}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-ink">{item.name} ×{draft.qty}</p>
            <p className="text-[13px] text-ink-secondary">{item.description}｜編輯內容中</p>
          </div>
          <div className="shrink-0 text-right">
            <Money value={item.price} className="text-[15px] font-medium text-ink" />
            {extra > 0 ? <p className="text-xs text-brand-soft">＋內容加價 ${extra}</p> : null}
          </div>
        </div>
      </Tile>

      <p className="text-[13px] leading-[19.5px] text-ink-secondary">
        每組請依指定份數勾選，額滿後其餘選項會暫停選取；飲料勾選後可於下方各自設定冰塊與甜度。
      </p>

      {item.groups?.map((group, index) => {
        const picked = selections[group.id] ?? [];
        const full = picked.length >= group.pick;
        return (
          <section key={group.id} className="flex flex-col gap-3">
            {index > 0 ? <Divider /> : null}

            {/* The status sits inline after the label, not opposite it. */}
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-sm font-medium text-ink">
                <FieldLegend required={group.required}>{group.label}</FieldLegend>
              </h3>
              <span className={cx('text-xs', full ? 'text-brand-soft' : 'text-ink-secondary')}>
                已選 {picked.length} / {group.pick}
                {full ? ` ‧ ${group.customisable ? '勾選後於下方設定冰塊與甜度' : '已額滿，其餘暫停選取'}` : ''}
              </span>
            </header>

            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const checked = picked.includes(option.id);
                return (
                  <OptionChip
                    key={option.id}
                    label={option.name}
                    extra={option.extra}
                    checked={checked}
                    disabled={!checked && full}
                    onChange={() => toggle(group, option.id)}
                  />
                );
              })}
            </div>

            {group.customisable
              ? picked.map((optionId) => {
                  const option = group.options.find((o) => o.id === optionId)!;
                  const pref = prefs[optionId] ?? DEFAULT_PREF;
                  return (
                    <Tile key={optionId} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-brand">
                          {option.name}
                          {option.extra ? ` +$${option.extra}` : ''}
                        </span>
                        <span className="text-xs text-ink-secondary">{option.extra ? `+$${option.extra}` : '$0'}</span>
                      </div>
                      <InlineRadioRow
                        label="冰塊"
                        name={`ice-${itemId}-${optionId}`}
                        options={ICE_OPTIONS_COMPACT}
                        value={pref.ice}
                        onChange={(v) => setPrefs((p) => ({ ...p, [optionId]: { ...pref, ice: v } }))}
                      />
                      <InlineRadioRow
                        label="甜度"
                        name={`sugar-${itemId}-${optionId}`}
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
          <span className="text-xs text-ink-secondary">{note.length} / 50</span>
        </div>
        <Textarea
          maxLength={50}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="例：牛排七分熟、其中一份不加香菜"
        />
      </section>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink">
          此套餐小計 <Money value={item.price + extra} className="text-brand" />
        </span>
        <span className="text-xs text-ink-secondary">
          （套餐 ${item.price.toLocaleString('en-US')} ＋ 內容加價 ${extra}）
        </span>
      </div>

      {/* Two equal-width actions spanning the card, as in the frame. */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          取消
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            addLine({ key: itemId, itemId, qty: draft.qty, selections, drinkPrefs: prefs, note });
            onClose();
          }}
        >
          更新套餐內容
        </Button>
      </div>
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

  const total = Object.values(prefs).reduce((sum, p) => sum + item.price + toppingPrice(p.toppings), 0);

  return (
    <div className="flex flex-col gap-4 border-t border-line-subtle pt-4">
      {Object.keys(prefs).map((cup, i) => {
        const pref = prefs[cup];
        const note = pref.note ?? '';
        const body = (
          <>
            <StackedRadioRow
              legend="冰塊"
              qualifier="＊必選（單選）"
              name={`ice-${item.id}-${cup}`}
              options={ICE_OPTIONS}
              value={pref.ice}
              onChange={(v) => update(cup, { ice: v })}
            />
            <StackedRadioRow
              legend="甜度"
              qualifier="＊必選（單選）"
              name={`sugar-${item.id}-${cup}`}
              options={SUGAR_OPTIONS}
              value={pref.sugar}
              onChange={(v) => update(cup, { sugar: v })}
            />

            <fieldset className="flex flex-col gap-2">
              <legend className="pb-2">
                <FieldLegend qualifier="（選填 ‧ 可複選）">加料</FieldLegend>
              </legend>
              <div className="flex flex-wrap gap-2">
                {TOPPING_OPTIONS.map((topping) => (
                  <OptionChip
                    key={topping.id}
                    label={topping.name}
                    extra={topping.extra}
                    checked={pref.toppings.includes(topping.id)}
                    onChange={() =>
                      update(cup, {
                        toppings: pref.toppings.includes(topping.id)
                          ? pref.toppings.filter((t) => t !== topping.id)
                          : [...pref.toppings, topping.id],
                      })
                    }
                  />
                ))}
              </div>
            </fieldset>

            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <FieldLegend qualifier="（選填）">其他自訂需求</FieldLegend>
                <span className="text-xs text-ink-secondary">{note.length} / 50</span>
              </div>
              <Textarea
                maxLength={50}
                value={note}
                onChange={(e) => update(cup, { note: e.target.value })}
                placeholder="例：不要吸管、另附冰塊一杯"
              />
            </section>
          </>
        );

        // With more than one cup each gets its own card, headed by a 第 N 杯 chip.
        if (cups === 1) {
          return (
            <div key={cup} className="flex flex-col gap-3">
              {body}
            </div>
          );
        }

        return (
          <Tile key={cup} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="rounded-chip bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                第 {i + 1} 杯
              </span>
              <span className="flex-1 text-xs text-ink-secondary">
                {i === 0 ? '冰塊、甜度、加料皆可單獨設定' : '沿用第 1 杯設定'}
              </span>
              <Money value={item.price + toppingPrice(pref.toppings)} className="text-[13px] text-ink-secondary" />
            </div>
            {body}
          </Tile>
        );
      })}

      <span className="text-sm font-medium text-ink">
        此品項小計 <Money value={total} className="text-brand" />
      </span>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onDone}>
          取消
        </Button>
        <Button
          className="flex-1"
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
          確認
        </Button>
      </div>
    </div>
  );
}

/** Label on its own line above the pills — the drink page's layout. */
function StackedRadioRow({
  legend,
  qualifier,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  qualifier?: string;
  name: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pb-2">
        <FieldLegend qualifier={qualifier}>{legend}</FieldLegend>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <RadioChip
            key={option}
            name={name}
            label={option}
            checked={option === value}
            onChange={() => onChange(option)}
          />
        ))}
      </div>
    </fieldset>
  );
}

/** Label to the left of the pills — the compact set-editor layout. */
function InlineRadioRow({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <legend className="float-left mr-3 w-12">
        <FieldLegend required>{label}</FieldLegend>
      </legend>
      {options.map((option) => (
        <RadioChip
          key={option}
          name={name}
          label={option}
          checked={option === value}
          onChange={() => onChange(option)}
        />
      ))}
    </fieldset>
  );
}

/* ── 客製化料理 (`custom/default`, `custom/add drink`) ────────────────────── */

/**
 * The form writes straight into the store on every change, because in the
 * design the running summary — and the 清除設定 control — live in the
 * order-summary card, not at the bottom of the form.
 */
function CustomMealForm() {
  const { custom, set } = useBooking();
  const value = custom ?? {
    eventType: '謝師宴',
    budget: '10,800',
    privateRoom: '不需要' as const,
    addDrinks: '現場需求加購' as const,
    drinkQty: {} as Record<string, number>,
  };

  const patch = (next: Partial<typeof value>) => set('custom', { ...value, ...next });

  return (
    <div className="flex flex-col gap-6">
      <Fieldset legend="活動類型（單選）" required>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={type === value.eventType}
              onClick={() => patch({ eventType: type })}
              className={cx(
                'h-9 rounded-chip border px-3 text-[13px] transition-colors',
                type === value.eventType
                  ? 'border-brand font-medium text-brand'
                  : 'border-line text-ink hover:border-brand/60',
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="整桌預算（單選）" required hint={`可選：${BUDGETS.join('／')}`}>
        <Select value={value.budget} onChange={(e) => patch({ budget: e.target.value })} aria-label="整桌預算">
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </Fieldset>

      <Fieldset legend="是否需要包廂（單選）" required hint={ROOM_HINT}>
        <div className="flex gap-3">
          {(['不需要', '需要'] as const).map((option) => (
            <RadioBox
              key={option}
              name="private-room"
              label={option}
              checked={value.privateRoom === option}
              onChange={() => patch({ privateRoom: option })}
            />
          ))}
        </div>
      </Fieldset>

      <Fieldset
        legend="是否加購飲品"
        required
        hint="整桌加購以壺／瓶為單位計價；未勾選的品項不計入金額。分類：養身飲品／酒／熱飲（壺）／冷飲。"
      >
        <div className="flex gap-3">
          {(['現場需求加購', '需要加購'] as const).map((option) => (
            <RadioBox
              key={option}
              name="add-drinks"
              label={option}
              checked={value.addDrinks === option}
              onChange={() => patch({ addDrinks: option })}
            />
          ))}
        </div>

        {value.addDrinks === '需要加購' ? (
          <AddOnDrinkPicker qty={value.drinkQty} onChange={(drinkQty) => patch({ drinkQty })} />
        ) : null}
      </Fieldset>
    </div>
  );
}

/**
 * `custom/add drink` — `Drink Add-on Card` (668:3548). A `[Comp] Tab` filter row
 * over `Drink List`, whose rows are the chips themselves: this frame does not
 * use `[Comp] Checkbox` at all, it draws its own 18px `Drink Option Icon`.
 */
function AddOnDrinkPicker({
  qty,
  onChange,
}: {
  qty: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
}) {
  const [filter, setFilter] = useState<(typeof CUSTOM_DRINK_CATEGORIES)[number]>('全部');
  const visible = CUSTOM_DRINKS.filter((d) => filter === '全部' || d.category === filter);

  const picked = CUSTOM_DRINKS.filter((d) => (qty[d.id] ?? 0) > 0);
  const units = picked.reduce((sum, d) => sum + qty[d.id], 0);
  const total = picked.reduce((sum, d) => sum + d.price * qty[d.id], 0);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-control border border-line bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {CUSTOM_DRINK_CATEGORIES.map((category) => (
          <Tab key={category} active={category === filter} onClick={() => setFilter(category)}>
            {category}
          </Tab>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {visible.map((drink) => {
          const count = qty[drink.id] ?? 0;
          const on = count > 0;
          return (
            <li key={drink.id}>
              {/* `Drink Option`. Selected lifts to white with a 2px #C9922A
                  outline; unselected sits on the same 3%-white wash the
                  locked-out checkbox uses. Padding shifts 1px to absorb the
                  border, as in the frame. */}
              <div
                className={cx(
                  'flex flex-wrap items-center justify-end gap-x-3 gap-y-2 rounded-control transition-colors',
                  on
                    ? 'border-2 border-selected bg-white px-[14px] py-[12px]'
                    : 'border border-off-border bg-off-bg px-[13px] py-[11px]',
                )}
              >
                <label className="flex min-w-[140px] flex-1 cursor-pointer items-center gap-3">
                  <span
                    className={cx(
                      'flex size-[18px] shrink-0 items-center justify-center rounded-box border p-px',
                      'text-[11px] font-bold leading-[11px]',
                      on ? 'border-selected bg-white text-ink' : 'border-line text-transparent',
                    )}
                    aria-hidden
                  >
                    ✓
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => onChange({ ...qty, [drink.id]: on ? 0 : 1 })}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[14px] font-medium leading-[18.9px] text-ink">{drink.name}</span>
                    <span className="text-cap text-ink-secondary">
                      {drink.category} ‧ {drink.serves}
                    </span>
                  </span>
                </label>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={cx(
                      'text-[14px] font-medium leading-[21px]',
                      on ? 'text-brand' : 'text-ink-secondary',
                    )}
                  >
                    ${drink.price} / {drink.unit}
                  </span>
                  <Stepper
                    label={drink.name}
                    value={count}
                    onChange={(next) => onChange({ ...qty, [drink.id]: next })}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* `Drink Add-on Footer` */}
      <div className="flex items-center justify-between text-cap">
        <span className="text-ink-secondary">
          已選 {picked.length} 項 ‧ 共 {units} 件
        </span>
        <span className="font-medium text-brand">加購小計 ${total.toLocaleString('en-US')}</span>
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
      <legend className="pb-2">
        <FieldLegend required={required}>{legend}</FieldLegend>
      </legend>
      {children}
      {hint ? <p className="pt-1 text-xs leading-[18px] text-ink-secondary">{hint}</p> : null}
    </fieldset>
  );
}
