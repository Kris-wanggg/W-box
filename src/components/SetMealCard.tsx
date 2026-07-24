/**
 * 套餐卡片 + 編輯套餐面板
 *
 * Default (collapsed) view mirrors Figma node 492:3136 (choose-set/default):
 * a thumbnail, name/desc, price and either a「選擇套餐」button or, once chosen,
 * a content-summary line + a「編輯套餐」toggle and a quantity stepper.
 *
 * The expanded editor mirrors node 497:3658 (choose-set/open): required-choice
 * groups (主餐 / 附餐 / 飲品 / 甜點) with up-charges, sold-out states, per-drink
 * 冰塊 / 甜度 options, a note field, a per-set subtotal and 取消 / 更新 actions.
 */
import type { MenuItem, SetGroup, SetOption } from '../data/menu';
import { ICE_OPTIONS, SUGAR_OPTIONS, twd } from '../data/menu';
import {
  setUpcharge,
  type SetSelection,
  type DrinkChoice,
} from '../state/BookingContext';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  UtensilsIcon,
} from './icons';

const NOTE_MAX = 50;

function Thumb({ set, size = 'md' }: { set: MenuItem; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-14 w-14' : 'h-12 w-12';
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-lg bg-gradient-to-br ${set.thumb} ${box}`}
    >
      <UtensilsIcon size={size === 'lg' ? 22 : 20} className="text-cream/85" />
    </div>
  );
}

/** "主餐 炙燒牛排、香煎鮭魚・附餐 2 份・飲品 2 杯・甜點 2 份" */
function contentSummary(set: MenuItem, sel: SetSelection): string {
  return (set.groups ?? [])
    .map((g) => {
      const picks = sel.picks[g.key] ?? [];
      if (g.key === 'main') {
        const names = picks
          .map((id) => g.options.find((o) => o.id === id)?.name)
          .filter(Boolean)
          .join('、');
        return `${g.label} ${names}`;
      }
      return `${g.label} ${picks.length} ${g.unit}`;
    })
    .join('・');
}

export default function SetMealCard({
  set,
  selection,
  editing,
  onSelect,
  onRemove,
  onQty,
  onEdit,
  onChange,
  onCancel,
  onDone,
}: {
  set: MenuItem;
  selection?: SetSelection;
  editing: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onQty: (qty: number) => void;
  onEdit: () => void;
  onChange: (sel: SetSelection) => void;
  onCancel: () => void;
  onDone: () => void;
}) {
  const chosen = !!selection;
  const upcharge = selection ? setUpcharge(set, selection) : 0;

  // ── Editing (expanded) ────────────────────────────────────────────────
  if (editing && selection) {
    const setSubtotal = set.price + upcharge;
    return (
      <div className="rounded-card border border-gold bg-gold-soft/10 p-4">
        {/* header */}
        <div className="flex items-start gap-3">
          <Thumb set={set} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-cream">
                {set.name} <span className="text-muted">×{selection.qty}</span>
              </p>
              <div className="text-right">
                <p className="font-semibold text-gold-light">{twd(set.price)}</p>
                {upcharge > 0 && (
                  <p className="text-xs text-gold">+內容加價 {twd(upcharge)}</p>
                )}
              </div>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              {set.desc.split('｜')[0]}｜編輯內容中
            </p>
          </div>
          <button
            onClick={onDone}
            className="flex shrink-0 items-center gap-1 rounded-btn bg-gold-gradient px-3 py-1.5 text-xs font-medium text-ink"
          >
            編輯套餐 <ChevronUpIcon size={14} />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted">
          每組請依指定份數勾選，額滿後其餘選項暫停選取；飲料勾選後可於下方各自設定冰塊與甜度。
        </p>

        <div className="mt-3 flex flex-col divide-y divide-[rgba(201,146,42,0.15)]">
          {(set.groups ?? []).map((g) => (
            <Group key={g.key} group={g} sel={selection} onChange={onChange} />
          ))}
        </div>

        {/* note */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-cream-dim">整份套餐的其他需求（選填）</span>
            <span className="text-muted">
              {selection.note.length} / {NOTE_MAX}
            </span>
          </div>
          <textarea
            value={selection.note}
            maxLength={NOTE_MAX}
            onChange={(e) => onChange({ ...selection, note: e.target.value })}
            placeholder="例：牛排七分熟、其中一份不加香菜"
            className="h-16 w-full resize-none rounded-btn border border-gold-faint bg-panel-input px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
          />
        </div>

        {/* footer */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-cream-dim">
            此套餐小計
            <span className="ml-2 font-semibold text-gold-light">
              {twd(setSubtotal)}
            </span>
          </span>
          <span className="text-xs text-muted">
            套餐 {twd(set.price)}
            {upcharge > 0 && ` · 內容加價 ${twd(upcharge)}`}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="rounded-btn border border-gold-faint px-4 py-2.5 text-sm font-medium text-cream-dim transition-colors hover:bg-gold-soft"
          >
            取消
          </button>
          <button
            onClick={onDone}
            className="rounded-btn bg-gold-gradient px-4 py-2.5 text-sm font-medium text-ink transition-[filter] hover:brightness-105"
          >
            更新套餐內容
          </button>
        </div>
      </div>
    );
  }

  // ── Default (collapsed) ───────────────────────────────────────────────
  return (
    <div
      className={`rounded-card border p-4 transition-colors ${
        chosen ? 'border-gold bg-gold-soft/25' : 'border-gold-faint bg-panel-soft'
      }`}
    >
      <div className="flex items-start gap-4">
        <Thumb set={set} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-cream">{set.name}</p>
            <p className="whitespace-nowrap font-semibold text-gold-light">
              {twd(set.price)}
            </p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">{set.desc}</p>

          {chosen && selection && (
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-cream-dim">
              <CheckIcon size={14} className="mt-0.5 shrink-0 text-gold-light" />
              <span>{contentSummary(set, selection)}</span>
            </p>
          )}

          <div className="mt-3 flex items-center justify-end gap-2">
            {chosen && selection ? (
              <>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1 rounded-btn border border-gold-faint px-3 py-1.5 text-sm text-cream-dim transition-colors hover:bg-gold-soft"
                >
                  編輯套餐 <ChevronDownIcon size={14} />
                </button>
                <Stepper
                  qty={selection.qty}
                  onDec={() =>
                    selection.qty <= 1 ? onRemove() : onQty(selection.qty - 1)
                  }
                  onInc={() => onQty(selection.qty + 1)}
                />
              </>
            ) : (
              <button
                onClick={onSelect}
                className="rounded-btn border border-[rgba(201,146,42,0.55)] px-4 py-1.5 text-sm font-medium text-gold transition-colors hover:bg-gold-soft"
              >
                選擇套餐
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── sub-components ─────────────────────────

function Stepper({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-btn border border-gold-faint bg-panel-input px-2 py-1">
      <button
        aria-label="減少數量"
        onClick={onDec}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gold-light hover:bg-gold-soft"
      >
        <MinusIcon size={16} />
      </button>
      <span className="w-6 text-center text-sm text-cream">{qty}</span>
      <button
        aria-label="增加數量"
        onClick={onInc}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gold-light hover:bg-gold-soft"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

function togglePick(
  sel: SetSelection,
  group: SetGroup,
  opt: SetOption
): SetSelection {
  const cur = sel.picks[group.key] ?? [];
  const picked = cur.includes(opt.id);
  const next = { ...sel, picks: { ...sel.picks }, drinks: { ...sel.drinks } };

  if (picked) {
    next.picks[group.key] = cur.filter((id) => id !== opt.id);
    if (group.isDrink) delete next.drinks[opt.id];
  } else {
    if (cur.length >= group.choose) return sel; // group full
    next.picks[group.key] = [...cur, opt.id];
    if (group.isDrink)
      next.drinks[opt.id] = { ice: '正常冰', sugar: '正常糖' };
  }
  return next;
}

function Group({
  group,
  sel,
  onChange,
}: {
  group: SetGroup;
  sel: SetSelection;
  onChange: (sel: SetSelection) => void;
}) {
  const picks = sel.picks[group.key] ?? [];
  const full = picks.length >= group.choose;

  return (
    <div className="py-3">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-cream">
          <span className="text-gold-light">✳ </span>
          {group.label}（請選 {group.choose} {group.unit}）
        </span>
        <span className={full ? 'text-gold' : 'text-muted'}>
          已選 {picks.length} / {group.choose}
          {full && '・已額滿，其餘暫停選取'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.options.map((opt) => {
          const picked = picks.includes(opt.id);
          const disabled = opt.soldOut || (full && !picked);
          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => onChange(togglePick(sel, group, opt))}
              className={`flex items-center gap-1.5 rounded-btn border px-3 py-1.5 text-sm transition-colors ${
                picked
                  ? 'border-gold bg-gold-soft text-cream'
                  : disabled
                    ? 'cursor-not-allowed border-gold-faint/60 text-muted/60'
                    : 'border-gold-faint text-cream-dim hover:bg-gold-soft'
              }`}
            >
              {picked && <CheckIcon size={13} className="text-gold-light" />}
              {opt.name}
              {opt.upcharge ? (
                <span className={picked ? 'text-gold-light' : 'text-gold'}>
                  +{twd(opt.upcharge)}
                </span>
              ) : null}
              {opt.soldOut && <span className="text-muted">（售完）</span>}
            </button>
          );
        })}
      </div>

      {/* 冰塊 / 甜度 for each chosen drink */}
      {group.isDrink &&
        picks.map((id) => {
          const opt = group.options.find((o) => o.id === id);
          if (!opt) return null;
          return (
            <DrinkOptions
              key={id}
              opt={opt}
              choice={sel.drinks[id] ?? { ice: '正常冰', sugar: '正常糖' }}
              onChange={(c) =>
                onChange({ ...sel, drinks: { ...sel.drinks, [id]: c } })
              }
            />
          );
        })}
    </div>
  );
}

function DrinkOptions({
  opt,
  choice,
  onChange,
}: {
  opt: SetOption;
  choice: DrinkChoice;
  onChange: (c: DrinkChoice) => void;
}) {
  return (
    <div className="mt-2 rounded-btn border border-gold-faint bg-panel-input p-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-cream">{opt.name}</span>
        <span className="text-xs text-gold">
          {opt.upcharge ? `+${twd(opt.upcharge)}` : twd(0)}
        </span>
      </div>
      <RadioRow
        label="冰塊"
        options={ICE_OPTIONS}
        value={choice.ice}
        onChange={(v) => onChange({ ...choice, ice: v as DrinkChoice['ice'] })}
      />
      <RadioRow
        label="甜度"
        options={SUGAR_OPTIONS}
        value={choice.sugar}
        onChange={(v) =>
          onChange({ ...choice, sugar: v as DrinkChoice['sugar'] })
        }
      />
    </div>
  );
}

function RadioRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
      <span className="w-10 shrink-0 text-muted">{label}</span>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 transition-colors ${
              active
                ? 'border-gold bg-gold-soft text-cream'
                : 'border-gold-faint text-cream-dim hover:bg-gold-soft'
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                active ? 'bg-gold-light' : 'bg-transparent ring-1 ring-gold-faint'
              }`}
            />
            {o}
          </button>
        );
      })}
    </div>
  );
}
