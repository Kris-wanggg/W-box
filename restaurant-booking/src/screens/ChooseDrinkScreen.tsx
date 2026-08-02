import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { OrderSummary } from '../components/OrderSummary';
import { Button } from '../components/ui/Button';
import {
  drinkMenu,
  iceOptions,
  sugarOptions,
  toppingOptions,
  type MenuItem,
} from '../data/menu';
import { formatCurrency, type BookingState, type DrinkOptions } from '../booking';

/** Figma: `Restaurant/choose-drink/default` (923:2482) + `Meal Card/drink/empty` (936:8686) */
export interface ChooseDrinkScreenProps {
  state: BookingState;
  onAdd: (item: MenuItem, options: DrinkOptions) => void;
  onRemove: (lineId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const toppingPrices = Object.fromEntries(
  toppingOptions.map((t) => [t.label, t.price]),
);

function DrinkCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem, options: DrinkOptions) => void;
}) {
  const [ice, setIce] = useState<string | null>(null);
  const [sugar, setSugar] = useState<string | null>(null);
  const [toppings, setToppings] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const canAdd = ice !== null && sugar !== null;
  const extra = toppings.reduce((sum, t) => sum + (toppingPrices[t] ?? 0), 0);

  const chip = (active: boolean) =>
    [
      'h-9 rounded-pill border px-3 text-body-small transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      active
        ? 'border-primary bg-primary text-text-inverse'
        : 'border-border bg-surface text-text-primary hover:bg-surface-alt active:bg-surface-muted',
    ].join(' ');

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-heading-h3 text-text-primary">{item.name}</h3>
          <p className="text-body-small text-text-secondary">{item.description}</p>
        </div>
        <p className="text-heading-h3 text-text-primary">
          {formatCurrency(item.price)}
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-label-medium text-text-primary">
          冰塊 <span className="text-status-error">＊</span>必選（單選）
        </legend>
        <div className="flex flex-wrap gap-2">
          {iceOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={ice === option}
              onClick={() => setIce(option)}
              className={chip(ice === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-label-medium text-text-primary">
          甜度 <span className="text-status-error">＊</span>必選（單選）
        </legend>
        <div className="flex flex-wrap gap-2">
          {sugarOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={sugar === option}
              onClick={() => setSugar(option)}
              className={chip(sugar === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-label-medium text-text-primary">
          加料（選填 ‧ 可複選）
        </legend>
        <div className="flex flex-wrap gap-2">
          {toppingOptions.map((option) => {
            const active = toppings.includes(option.label);
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setToppings((prev) =>
                    active
                      ? prev.filter((t) => t !== option.label)
                      : [...prev, option.label],
                  )
                }
                className={chip(active)}
              >
                {option.label} +{formatCurrency(option.price)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`note-${item.id}`}
          className="text-label-medium text-text-primary"
        >
          其他自訂需求（選填）
        </label>
        <textarea
          id={`note-${item.id}`}
          rows={2}
          maxLength={50}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="rounded-md border border-input-border bg-input-bg p-3 text-body-base text-text-primary placeholder:text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <p className="text-right text-caption text-text-muted">{note.length} / 50</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-body-base text-text-primary">
          此品項小計 {formatCurrency(item.price + extra)}
        </p>
        <Button
          size="sm"
          disabled={!canAdd}
          aria-label={`加入 ${item.name}`}
          onClick={() => {
            onAdd(item, { ice, sugar, toppings, note });
            setIce(null);
            setSugar(null);
            setToppings([]);
            setNote('');
          }}
        >
          加入
        </Button>
      </div>
    </article>
  );
}

export function ChooseDrinkScreen({
  state,
  onAdd,
  onRemove,
  onNext,
  onBack,
}: ChooseDrinkScreenProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar
        backLabel="選擇餐點"
        onBack={onBack}
        step={{ current: 2, total: 3 }}
      />

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <section
            aria-label="選擇飲品"
            className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-heading-h2 text-text-primary">選擇餐點</h1>
              <p className="text-caption text-text-muted">
                目前分類：飲品 ‧ 共 {drinkMenu.length} 項
              </p>
              <p className="text-body-small text-text-secondary">
                飲品可設定冰塊、甜度與加料；冰塊／甜度為必選單選，加料為可複選。
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {drinkMenu.map((item) => (
                <DrinkCard key={item.id} item={item} onAdd={onAdd} />
              ))}
            </div>
          </section>

          <div className="flex w-full flex-col gap-4 md:w-[380px] md:shrink-0">
            <OrderSummary
              cart={state.cart}
              toppingPrices={toppingPrices}
              onRemove={onRemove}
            />
            <Button size="lg" fullWidth onClick={onNext}>
              下一步：填寫聯絡資料
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
