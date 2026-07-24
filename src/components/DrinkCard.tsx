/**
 * 飲品卡片 + 客製化編輯器
 *
 * Default row mirrors Figma node 497:4207 (choose-drink/default); the expanded
 * editor mirrors 497:4480 (choose-drink/open): 冰塊 (single) / 甜度 (single) /
 * 加料 (multi, up-charge) / note / 此品項小計 / 加入購物車.
 */
import { useEffect, useState } from 'react';
import {
  DRINK_ICE_OPTIONS,
  DRINK_TOPPINGS,
  SUGAR_OPTIONS,
  twd,
  type MenuItem,
} from '../data/menu';
import { RadioPill, CheckChip } from './controls';
import { UtensilsIcon, PlusIcon, MinusIcon } from './icons';

export type DrinkDraft = {
  ice: string;
  sugar: string;
  toppings: string[];
  note: string;
};

const NOTE_MAX = 50;
const freshDraft = (): DrinkDraft => ({
  ice: '正常冰',
  sugar: '正常糖',
  toppings: [],
  note: '',
});

function Thumb({ drink }: { drink: MenuItem }) {
  return (
    <div
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${drink.thumb}`}
    >
      <UtensilsIcon size={20} className="text-cream/85" />
    </div>
  );
}

export default function DrinkCard({
  drink,
  open,
  onOpen,
  onClose,
  onAdd,
}: {
  drink: MenuItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onAdd: (draft: DrinkDraft) => void;
}) {
  const [draft, setDraft] = useState<DrinkDraft>(freshDraft);

  // reset the draft each time this card is opened
  useEffect(() => {
    if (open) setDraft(freshDraft());
  }, [open]);

  const extra = draft.toppings.reduce((s, id) => {
    const tp = DRINK_TOPPINGS.find((t) => t.id === id);
    return s + (tp?.upcharge ?? 0);
  }, 0);
  const lineTotal = drink.price + extra;

  const toggleTopping = (id: string) =>
    setDraft((d) => ({
      ...d,
      toppings: d.toppings.includes(id)
        ? d.toppings.filter((x) => x !== id)
        : [...d.toppings, id],
    }));

  if (!open) {
    return (
      <div className="flex items-center gap-4 rounded-card border border-gold-faint bg-panel-soft p-4">
        <Thumb drink={drink} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-cream">{drink.name}</p>
          <p className="mt-0.5 text-xs text-muted">{drink.desc}</p>
        </div>
        <span className="whitespace-nowrap font-semibold text-gold-light">
          {twd(drink.price)}
        </span>
        <button
          onClick={onOpen}
          className="flex shrink-0 items-center gap-1 rounded-btn border border-[rgba(201,146,42,0.55)] px-3 py-1.5 text-sm font-medium text-gold transition-colors hover:bg-gold-soft"
        >
          <PlusIcon size={14} /> 客製化
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-gold bg-gold-soft/10 p-4">
      <div className="flex items-center gap-4">
        <Thumb drink={drink} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-cream">{drink.name}</p>
          <p className="mt-0.5 text-xs text-muted">現榨 · 客製化設定中</p>
        </div>
        <span className="whitespace-nowrap font-semibold text-gold-light">
          {twd(drink.price)}
        </span>
        <button
          onClick={onClose}
          className="flex shrink-0 items-center gap-1 rounded-btn bg-gold-gradient px-3 py-1.5 text-sm font-medium text-ink"
        >
          <MinusIcon size={14} /> 客製化
        </button>
      </div>

      {/* 冰塊 */}
      <Section title="冰塊" required tag="必選（單選）">
        <div className="flex flex-wrap gap-2">
          {DRINK_ICE_OPTIONS.map((o) => (
            <RadioPill
              key={o}
              label={o}
              active={draft.ice === o}
              onClick={() => setDraft((d) => ({ ...d, ice: o }))}
            />
          ))}
        </div>
      </Section>

      {/* 甜度 */}
      <Section title="甜度" required tag="必選（單選）">
        <div className="flex flex-wrap gap-2">
          {SUGAR_OPTIONS.map((o) => (
            <RadioPill
              key={o}
              label={o}
              active={draft.sugar === o}
              onClick={() => setDraft((d) => ({ ...d, sugar: o }))}
            />
          ))}
        </div>
      </Section>

      {/* 加料 */}
      <Section title="加料" tag="選填 · 可複選">
        <div className="flex flex-wrap gap-2">
          {DRINK_TOPPINGS.map((t) => (
            <CheckChip
              key={t.id}
              label={t.name}
              suffix={`+${twd(t.upcharge)}`}
              active={draft.toppings.includes(t.id)}
              onClick={() => toggleTopping(t.id)}
            />
          ))}
        </div>
      </Section>

      {/* note */}
      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-cream-dim">其他自訂需求（選填）</span>
          <span className="text-muted">
            {draft.note.length} / {NOTE_MAX}
          </span>
        </div>
        <textarea
          value={draft.note}
          maxLength={NOTE_MAX}
          onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
          placeholder="例：不要吸管、另附冰塊一杯"
          className="h-14 w-full resize-none rounded-btn border border-gold-faint bg-panel-input px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-cream-dim">
          此品項小計
          <span className="ml-2 font-semibold text-gold-light">
            {twd(lineTotal)}
          </span>
        </span>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded-btn border border-gold-faint px-4 py-2 text-sm font-medium text-cream-dim transition-colors hover:bg-gold-soft"
          >
            取消
          </button>
          <button
            onClick={() => onAdd(draft)}
            className="rounded-btn bg-gold-gradient px-4 py-2 text-sm font-medium text-ink transition-[filter] hover:brightness-105"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  required,
  tag,
  children,
}: {
  title: string;
  required?: boolean;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-medium text-cream">
        {required && <span className="text-gold-light">✳ </span>}
        {title}
        <span className="ml-1 font-normal text-muted">{tag}</span>
      </p>
      {children}
    </div>
  );
}
