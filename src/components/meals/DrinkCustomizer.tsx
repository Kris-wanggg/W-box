import { useState } from 'react';
import { DRINK_TOPPINGS, ICE_LEVELS, NOTE_MAX, SUGAR_LEVELS } from '../../data/menu';
import { currency } from '../../lib/format';
import { toppingUpcharge } from '../../lib/pricing';
import type { DrinkOptions, IceLevel, MenuItem, SugarLevel } from '../../types';
import { Button } from '../ui/Button';
import { Checkbox, Radio } from '../ui/Choice';
import { NoteField } from '../ui/Field';

/**
 * Figma: `Restaurant/choose-drink/open` (668:3166).
 * 冰塊 and 甜度 are required single-selects; 加料 is an optional multi-select.
 */
interface DrinkCustomizerProps {
  item: MenuItem;
  initial: DrinkOptions;
  onCancel: () => void;
  onSubmit: (options: DrinkOptions) => void;
}

export function emptyDrinkOptions(): DrinkOptions {
  return { ice: null, sugar: null, toppings: [], note: '' };
}

export function DrinkCustomizer({
  item,
  initial,
  onCancel,
  onSubmit,
}: DrinkCustomizerProps) {
  const [options, setOptions] = useState<DrinkOptions>(initial);
  const complete = options.ice !== null && options.sugar !== null;
  const subtotal = item.price + toppingUpcharge(options.toppings);

  const toggleTopping = (name: string) => {
    setOptions((o) => ({
      ...o,
      toppings: o.toppings.includes(name)
        ? o.toppings.filter((t) => t !== name)
        : [...o.toppings, name],
    }));
  };

  return (
    <div className="mt-3 flex flex-col gap-4 rounded-lg border border-brand/40 bg-brand-tint/40 p-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-r-label text-text-primary">
          冰塊
          <span className="ml-1 text-r-note text-status-error">＊必選（單選）</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {ICE_LEVELS.map((ice: IceLevel) => (
            <Radio
              key={ice}
              name={`${item.id}-ice`}
              label={ice}
              checked={options.ice === ice}
              onChange={() => setOptions((o) => ({ ...o, ice }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-r-label text-text-primary">
          甜度
          <span className="ml-1 text-r-note text-status-error">＊必選（單選）</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {SUGAR_LEVELS.map((sugar: SugarLevel) => (
            <Radio
              key={sugar}
              name={`${item.id}-sugar`}
              label={sugar}
              checked={options.sugar === sugar}
              onChange={() => setOptions((o) => ({ ...o, sugar }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-r-label text-text-primary">
          加料
          <span className="ml-1 text-r-note text-text-secondary">（選填 ‧ 可複選）</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {DRINK_TOPPINGS.map((topping) => (
            <Checkbox
              key={topping.name}
              label={topping.name}
              suffix={`+${currency(topping.upcharge)}`}
              checked={options.toppings.includes(topping.name)}
              onChange={() => toggleTopping(topping.name)}
            />
          ))}
        </div>
      </fieldset>

      <NoteField
        label="其他自訂需求"
        value={options.note}
        maxLength={NOTE_MAX}
        placeholder="例：不要吸管、另附冰塊一杯"
        onChange={(e) => setOptions((o) => ({ ...o, note: e.target.value }))}
      />

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <p className="text-r-label text-text-primary">此品項小計 {currency(subtotal)}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" size="lg" block onClick={onCancel}>
            取消
          </Button>
          <Button size="lg" block disabled={!complete} onClick={() => onSubmit(options)}>
            確認
          </Button>
        </div>
        {!complete && (
          <p className="text-r-note text-status-error">冰塊與甜度為必選項目。</p>
        )}
      </div>
    </div>
  );
}
