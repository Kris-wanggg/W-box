/**
 * 客製化料理 — whole-table banquet configurator.
 *
 * Mirrors Figma nodes 500:5282 (custom/default) and 500:4866 (custom/add drink):
 * 活動類型 (single) · 整桌預算 (select) · 是否需要包廂 (single + info) ·
 * 是否加購飲品 (toggle → filtered bottle list with quantities).
 *
 * Choosing a 整桌預算 makes the banquet "active", which is exclusive — the
 * 套餐 / 單品 / 飲品 amounts are paused (handled in computeSubtotal).
 */
import { useState } from 'react';
import {
  BANQUET_BOTTLES,
  BANQUET_FILTERS,
  BUDGET_OPTIONS,
  EVENT_TYPES,
  ROOM_INFO,
  twd,
} from '../data/menu';
import { useBooking, type CustomBanquet as Banquet } from '../state/BookingContext';
import { CheckChip } from './controls';
import { MinusIcon, PlusIcon } from './icons';

export default function CustomBanquet() {
  const { booking, update } = useBooking();
  const c = booking.custom;
  const [filter, setFilter] = useState<string | null>(null);

  const patch = (p: Partial<Banquet>) => update({ custom: { ...c, ...p } });

  const bottles = BANQUET_BOTTLES.filter((b) => !filter || b.cat === filter);
  const chosen = Object.entries(c.bottles).filter(([, q]) => q > 0);
  const bottleKinds = chosen.length;
  const bottleQty = chosen.reduce((s, [, q]) => s + q, 0);
  const bottleSubtotal = chosen.reduce((s, [id, q]) => {
    const b = BANQUET_BOTTLES.find((x) => x.id === id);
    return s + (b ? b.price * q : 0);
  }, 0);

  const setBottleQty = (id: string, q: number) => {
    const next = { ...c.bottles };
    if (q <= 0) delete next[id];
    else next[id] = q;
    patch({ bottles: next });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 活動類型 */}
      <Field title="活動類型" tag="單選" required>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((t) => (
            <CheckChip
              key={t}
              label={t}
              active={c.eventType === t}
              onClick={() => patch({ eventType: c.eventType === t ? null : t })}
            />
          ))}
        </div>
      </Field>

      {/* 整桌預算 */}
      <Field title="整桌預算" tag="單選" required>
        <select
          value={c.budget ?? ''}
          onChange={(e) =>
            patch({ budget: e.target.value ? Number(e.target.value) : null })
          }
          className="w-full rounded-btn border border-gold-faint bg-panel-input px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
        >
          <option value="" className="bg-ink-800">
            請選擇整桌預算
          </option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.value} value={b.value} className="bg-ink-800">
              {b.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-muted">
          可選：6,800 / 8,800 / 10,800 / 13,800 / 15,000 以上；6,800 專案 · 8,800 專案 / 單點
        </p>
      </Field>

      {/* 包廂 */}
      <Field title="是否需要包廂" tag="單選" required>
        <div className="grid grid-cols-2 gap-3">
          <WideRadio
            label="不需要"
            active={c.room === 'none'}
            onClick={() => patch({ room: 'none' })}
          />
          <WideRadio
            label="需要"
            active={c.room === 'need'}
            onClick={() => patch({ room: 'need' })}
          />
        </div>
        <p className="mt-2 rounded-btn border border-gold-faint bg-panel-input px-3 py-2 text-xs text-muted">
          {ROOM_INFO}
        </p>
      </Field>

      {/* 加購飲品 */}
      <Field title="是否加購飲品" tag="選填 · 可複選">
        <div className="grid grid-cols-2 gap-3">
          <WideRadio
            label="不需要"
            active={!c.addDrinks}
            onClick={() => patch({ addDrinks: false })}
          />
          <WideRadio
            label="需要加購"
            active={c.addDrinks}
            onClick={() => patch({ addDrinks: true })}
          />
        </div>

        {c.addDrinks && (
          <div className="mt-3 rounded-card border border-gold-faint bg-panel-soft p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {BANQUET_FILTERS.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFilter(f.cat)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filter === f.cat
                      ? 'bg-gold-gradient font-medium text-ink'
                      : 'border border-gold-faint text-cream-dim hover:bg-gold-soft'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {bottles.map((b) => {
                const q = c.bottles[b.id] ?? 0;
                const on = q > 0;
                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-3 rounded-btn border p-3 transition-colors ${
                      on
                        ? 'border-gold bg-gold-soft/25'
                        : 'border-gold-faint bg-panel-input'
                    }`}
                  >
                    <button
                      onClick={() => setBottleQty(b.id, on ? 0 : 1)}
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border ${
                        on ? 'border-gold bg-gold-gradient' : 'border-gold-faint'
                      }`}
                      aria-label={on ? '取消加購' : '加購'}
                    >
                      {on && <span className="text-[10px] text-ink">✓</span>}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${on ? 'text-cream' : 'text-cream-dim'}`}>
                        {b.name}
                      </p>
                      <p className="text-xs text-muted">{b.desc}</p>
                    </div>
                    <span className="whitespace-nowrap text-sm text-gold-light">
                      {twd(b.price)} / {b.unit}
                    </span>
                    {on ? (
                      <div className="flex items-center gap-1.5 rounded-btn border border-gold-faint bg-panel-input px-1.5 py-1">
                        <button
                          aria-label="減少"
                          onClick={() => setBottleQty(b.id, q - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-gold-light hover:bg-gold-soft"
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className="w-5 text-center text-sm text-cream">{q}</span>
                        <button
                          aria-label="增加"
                          onClick={() => setBottleQty(b.id, q + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-gold-light hover:bg-gold-soft"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="w-[92px] text-right text-xs text-muted">
                        未加購
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gold-faint pt-3 text-sm">
              <span className="text-muted">
                已選 {bottleKinds} 種 · 共 {bottleQty} 件
              </span>
              <span className="text-cream-dim">
                加購小計{' '}
                <span className="font-semibold text-gold-light">
                  {twd(bottleSubtotal)}
                </span>
              </span>
            </div>
          </div>
        )}

        <p className="mt-2 text-xs text-muted">
          整桌加購以套 / 瓶為單位計價；未勾選的品項不計入金額。分類：養身飲品 / 酒 / 熱飲（壺）/ 冷飲。
        </p>
      </Field>
    </div>
  );
}

function Field({
  title,
  tag,
  required,
  children,
}: {
  title: string;
  tag: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-cream">
        {required && <span className="text-gold-light">✳ </span>}
        {title}
        <span className="ml-1 text-xs font-normal text-muted">（{tag}）</span>
      </p>
      {children}
    </div>
  );
}

function WideRadio({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-btn border px-4 py-2.5 text-sm transition-colors ${
        active
          ? 'border-gold bg-gold-soft text-cream'
          : 'border-gold-faint text-cream-dim hover:bg-gold-soft'
      }`}
    >
      <span
        className={`inline-block h-3 w-3 rounded-full ${
          active ? 'bg-gold-light' : 'bg-transparent ring-1 ring-gold-faint'
        }`}
      />
      {label}
    </button>
  );
}
