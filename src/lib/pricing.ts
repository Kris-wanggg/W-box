import { ADD_ON_DRINKS, DRINK_TOPPINGS, MENU } from '../data/menu';
import type { CartLine, CustomOrder, MenuItem, SetSelection } from '../types';

export function findItem(itemId: string): MenuItem | undefined {
  return MENU.find((m) => m.id === itemId);
}

/** Upcharge from the checkboxes ticked inside an editable set. */
export function setUpcharge(item: MenuItem, selection: SetSelection): number {
  if (item.groups === undefined) return 0;
  return item.groups.reduce((sum, group) => {
    const picked = selection.groups[group.id] ?? [];
    return (
      sum +
      group.choices
        .filter((c) => picked.includes(c.name))
        .reduce((s, c) => s + c.upcharge, 0)
    );
  }, 0);
}

/** Upcharge from a drink's 加料 checkboxes. */
export function toppingUpcharge(toppings: string[]): number {
  return DRINK_TOPPINGS.filter((t) => toppings.includes(t.name)).reduce(
    (s, t) => s + t.upcharge,
    0,
  );
}

export function addOnSubtotal(custom: CustomOrder): number {
  return ADD_ON_DRINKS.reduce(
    (sum, d) => sum + d.price * (custom.addOnQty[d.id] ?? 0),
    0,
  );
}

export function addOnCounts(custom: CustomOrder): { kinds: number; units: number } {
  const entries = ADD_ON_DRINKS.map((d) => custom.addOnQty[d.id] ?? 0).filter(
    (q) => q > 0,
  );
  return {
    kinds: entries.length,
    units: entries.reduce((s, q) => s + q, 0),
  };
}

/** Price of one unit of a line, including every option upcharge. */
export function lineUnitPrice(line: CartLine): number {
  if (line.kind === 'custom' && line.custom !== undefined) {
    return (line.custom.pricePerTable ?? 0) + addOnSubtotal(line.custom);
  }

  let price = line.unitPrice;

  if (line.kind === 'set' && line.set !== undefined) {
    const item = findItem(line.itemId);
    if (item !== undefined) price += setUpcharge(item, line.set);
  }

  if (line.kind === 'drink' && line.drink !== undefined) {
    price += toppingUpcharge(line.drink.toppings);
  }

  return price;
}

export function lineTotal(line: CartLine): number {
  return lineUnitPrice(line) * line.qty;
}

/** Just the upcharge portion — the summary shows it as a "└ 內容加價" row. */
export function lineUpcharge(line: CartLine): number {
  return lineUnitPrice(line) - line.unitPrice;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + lineTotal(l), 0);
}

/** A set is only complete once every required group has hit its quota. */
export function isSetComplete(item: MenuItem, selection: SetSelection): boolean {
  if (item.groups === undefined) return true;
  return item.groups.every((group) => {
    if (!group.required) return true;
    const picked = selection.groups[group.id] ?? [];
    if (picked.length !== group.quota) return false;
    // Every chosen 飲料 also needs ice + sugar.
    return group.choices
      .filter((c) => c.isDrink === true && picked.includes(c.name))
      .every((c) => {
        const opts = selection.drinks[c.name];
        return opts?.ice != null && opts?.sugar != null;
      });
  });
}

export function emptySetSelection(): SetSelection {
  return { groups: {}, drinks: {}, note: '' };
}

export function emptyCustomOrder(): CustomOrder {
  return {
    eventType: null,
    pricePerTable: null,
    privateRoom: null,
    drinkAddOn: null,
    addOnQty: {},
  };
}

export function isCustomOrderComplete(custom: CustomOrder): boolean {
  return (
    custom.eventType !== null &&
    custom.pricePerTable !== null &&
    custom.privateRoom !== null &&
    custom.drinkAddOn !== null
  );
}
