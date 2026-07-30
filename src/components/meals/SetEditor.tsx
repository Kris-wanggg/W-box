import { useState } from 'react';
import { NOTE_MAX, SET_ICE_LEVELS, SUGAR_LEVELS } from '../../data/menu';
import { currency } from '../../lib/format';
import { isSetComplete, setUpcharge } from '../../lib/pricing';
import type { IceLevel, MenuItem, SetSelection, SugarLevel } from '../../types';
import { Button } from '../ui/Button';
import { Checkbox, Radio } from '../ui/Choice';
import { NoteField } from '../ui/Field';

/**
 * Figma: `Restaurant/choose-set/open` (668:2551).
 *
 * Each group has a quota. Once the quota is met the remaining choices lock
 * ("已額滿，其餘暫停選取") rather than silently swapping a selection out.
 * Chosen 飲料 gain their own 冰塊／甜度 sub-form below the group.
 */
interface SetEditorProps {
  item: MenuItem;
  initial: SetSelection;
  onCancel: () => void;
  onSubmit: (selection: SetSelection) => void;
}

export function SetEditor({ item, initial, onCancel, onSubmit }: SetEditorProps) {
  const [selection, setSelection] = useState<SetSelection>(initial);
  const groups = item.groups ?? [];
  const upcharge = setUpcharge(item, selection);
  const complete = isSetComplete(item, selection);

  const togglePick = (groupId: string, name: string, quota: number) => {
    setSelection((s) => {
      const picked = s.groups[groupId] ?? [];
      const next = picked.includes(name)
        ? picked.filter((p) => p !== name)
        : picked.length >= quota
          ? picked
          : [...picked, name];
      return { ...s, groups: { ...s.groups, [groupId]: next } };
    });
  };

  const setDrinkOption = (
    name: string,
    key: 'ice' | 'sugar',
    optValue: IceLevel | SugarLevel,
  ) => {
    setSelection((s) => {
      const current = s.drinks[name] ?? { ice: null, sugar: null };
      return {
        ...s,
        drinks: { ...s.drinks, [name]: { ...current, [key]: optValue } },
      };
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-brand/40 bg-brand-tint/40 p-5">
      <div className="flex flex-col gap-1">
        <p className="text-r-h2 text-text-primary">
          {item.emoji} {item.name} ×1
        </p>
        <p className="text-r-note text-text-secondary">{item.description}｜編輯內容中</p>
        <p className="text-r-note text-text-secondary">
          每組請依指定份數勾選，額滿後其餘選項會暫停選取；飲料勾選後可於下方各自設定冰塊與甜度。
        </p>
      </div>

      {groups.map((group) => {
        const picked = selection.groups[group.id] ?? [];
        const atQuota = picked.length >= group.quota;
        const drinkPicks = group.choices.filter(
          (c) => c.isDrink === true && picked.includes(c.name),
        );

        return (
          <fieldset key={group.id} className="flex flex-col gap-2">
            <legend className="flex flex-wrap items-baseline gap-x-2 text-r-label text-text-primary">
              {group.required && (
                <span className="text-status-error" aria-hidden="true">
                  ＊
                </span>
              )}
              {group.label}（請選 {group.quota} 項）
              <span className="text-r-note text-text-secondary">
                已選 {picked.length} / {group.quota}
                {atQuota
                  ? group.hint !== undefined
                    ? ` ‧ ${group.hint}`
                    : ' ‧ 已額滿，其餘暫停選取'
                  : ''}
              </span>
            </legend>

            <div className="flex flex-wrap gap-2">
              {group.choices.map((choice) => {
                const checked = picked.includes(choice.name);
                return (
                  <Checkbox
                    key={choice.name}
                    label={choice.name}
                    suffix={choice.upcharge > 0 ? `+${currency(choice.upcharge)}` : undefined}
                    checked={checked}
                    disabled={!checked && atQuota}
                    onChange={() => togglePick(group.id, choice.name, group.quota)}
                  />
                );
              })}
            </div>

            {drinkPicks.map((drink) => {
              const opts = selection.drinks[drink.name];
              return (
                <div
                  key={drink.name}
                  className="mt-2 flex flex-col gap-3 rounded-md border border-border bg-surface p-4"
                >
                  <p className="flex items-baseline justify-between gap-2 text-r-label text-text-primary">
                    <span>{drink.name}</span>
                    <span className="text-r-note text-text-secondary">
                      {drink.upcharge > 0 ? `+${currency(drink.upcharge)}` : '$0'}
                    </span>
                  </p>

                  <OptionRow label="冰塊">
                    {SET_ICE_LEVELS.map((ice) => (
                      <Radio
                        key={ice}
                        name={`${item.id}-${group.id}-${drink.name}-ice`}
                        label={ice}
                        checked={opts?.ice === ice}
                        onChange={() => setDrinkOption(drink.name, 'ice', ice)}
                      />
                    ))}
                  </OptionRow>

                  <OptionRow label="甜度">
                    {SUGAR_LEVELS.map((sugar) => (
                      <Radio
                        key={sugar}
                        name={`${item.id}-${group.id}-${drink.name}-sugar`}
                        label={sugar}
                        checked={opts?.sugar === sugar}
                        onChange={() => setDrinkOption(drink.name, 'sugar', sugar)}
                      />
                    ))}
                  </OptionRow>
                </div>
              );
            })}
          </fieldset>
        );
      })}

      <NoteField
        label="整份套餐的其他需求"
        value={selection.note}
        maxLength={NOTE_MAX}
        placeholder="例：牛排七分熟、其中一份不加香菜"
        onChange={(e) => setSelection((s) => ({ ...s, note: e.target.value }))}
      />

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-r-label text-text-primary">
            此套餐小計 {currency(item.price + upcharge)}
          </p>
          <p className="text-r-note text-text-secondary">
            （套餐 {currency(item.price)}
            {upcharge > 0 ? ` ＋ 內容加價 ${currency(upcharge)}` : ''}）
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" size="lg" block onClick={onCancel}>
            取消
          </Button>
          <Button
            size="lg"
            block
            disabled={!complete}
            onClick={() => onSubmit(selection)}
          >
            更新套餐內容
          </Button>
        </div>
        {!complete && (
          <p className="text-r-note text-status-error">
            請先完成所有標示 ＊ 的組別（含每杯飲料的冰塊與甜度）。
          </p>
        )}
      </div>
    </div>
  );
}

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-r-note text-text-primary">
        {label}
        <span className="ml-1 text-status-error" aria-hidden="true">
          ＊
        </span>
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
