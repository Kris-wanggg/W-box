import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  byId,
  MENU,
  BANQUET_BOTTLES,
  DRINK_TOPPINGS,
  type IceOption,
  type MenuItem,
  type SugarOption,
} from '../data/menu';

/** 冰塊 / 甜度 chosen for a single drink option inside a set. */
export type DrinkChoice = { ice: IceOption; sugar: SugarOption };

/** A customized, in-cart set meal (mirrors the Figma 編輯套餐 panel). */
export type SetSelection = {
  qty: number;
  /** groupKey -> chosen option ids */
  picks: Record<string, string[]>;
  /** drink option id -> 冰塊 / 甜度 */
  drinks: Record<string, DrinkChoice>;
  note: string;
};

/** A customized drink cup added from the 飲品 tab (choose-drink). */
export type DrinkCartItem = {
  uid: string; // unique per added cup
  drinkId: string; // menu drink id
  ice: string; // includes 熱飲
  sugar: string;
  toppings: string[]; // topping ids
  note: string;
};

/** 客製化料理 — the exclusive whole-table banquet configurator. */
export type CustomBanquet = {
  eventType: string | null;
  budget: number | null; // per-table budget (also the "active" trigger)
  room: 'none' | 'need';
  addDrinks: boolean;
  bottles: Record<string, number>; // bottleId -> qty
};

export type Booking = {
  adults: number;
  children: number;
  date: Date | null;
  time: string | null;
  /** simple items (單品): menu item id -> quantity */
  cart: Record<string, number>;
  /** customized 套餐: set id -> selection */
  setSelections: Record<string, SetSelection>;
  /** customized 飲品 cups */
  drinkCart: DrinkCartItem[];
  /** 客製化料理 banquet (exclusive when active) */
  custom: CustomBanquet;
  contact: {
    name: string;
    phone: string;
    email: string;
    note: string;
  };
  /** confirmation code produced on the success screen */
  code: string | null;
};

export const emptyCustom: CustomBanquet = {
  eventType: null,
  budget: null,
  room: 'none',
  addDrinks: false,
  bottles: {},
};

const defaultBooking: Booking = {
  adults: 2,
  children: 0,
  date: null,
  time: null,
  cart: {},
  setSelections: {},
  drinkCart: [],
  custom: emptyCustom,
  contact: { name: '', phone: '', email: '', note: '' },
  code: null,
};

/** Build the default (auto-filled) selection for a set: pick the first N
 * available options of each group, defaulting drinks to 正常冰 / 正常糖. */
export function defaultSelection(set: MenuItem): SetSelection {
  const picks: Record<string, string[]> = {};
  const drinks: Record<string, DrinkChoice> = {};
  for (const g of set.groups ?? []) {
    const chosen = g.options
      .filter((o) => !o.soldOut)
      .slice(0, g.choose)
      .map((o) => o.id);
    picks[g.key] = chosen;
    if (g.isDrink) {
      for (const id of chosen) drinks[id] = { ice: '正常冰', sugar: '正常糖' };
    }
  }
  return { qty: 1, picks, drinks, note: '' };
}

/** Extra charge (TWD) from up-charged options in a selection. */
export function setUpcharge(set: MenuItem, sel: SetSelection): number {
  let sum = 0;
  for (const g of set.groups ?? []) {
    for (const optId of sel.picks[g.key] ?? []) {
      const opt = g.options.find((o) => o.id === optId);
      if (opt?.upcharge) sum += opt.upcharge;
    }
  }
  return sum;
}

/** Number of up-charged (升級) options picked in a selection. */
export function upgradeCount(set: MenuItem, sel: SetSelection): number {
  let n = 0;
  for (const g of set.groups ?? []) {
    for (const optId of sel.picks[g.key] ?? []) {
      const opt = g.options.find((o) => o.id === optId);
      if (opt?.upcharge) n += 1;
    }
  }
  return n;
}

/** (base + up-charge) × qty for one set line. */
export function setLineTotal(set: MenuItem, sel: SetSelection): number {
  return (set.price + setUpcharge(set, sel)) * sel.qty;
}

/** Price of one customized drink cup: base + topping up-charges. */
export function drinkItemPrice(item: DrinkCartItem): number {
  const base = byId(item.drinkId)?.price ?? 0;
  const extra = item.toppings.reduce((s, id) => {
    const tp = DRINK_TOPPINGS.find((t) => t.id === id);
    return s + (tp?.upcharge ?? 0);
  }, 0);
  return base + extra;
}

/** 客製化料理 is "active" (and therefore exclusive) once a budget is chosen. */
export function isCustomActive(b: Booking): boolean {
  return b.custom.budget != null;
}

/** Whole-table banquet total: budget + any add-on bottles. */
export function customTotal(b: Booking): number {
  let sum = b.custom.budget ?? 0;
  if (b.custom.addDrinks) {
    for (const [id, qty] of Object.entries(b.custom.bottles)) {
      const bottle = BANQUET_BOTTLES.find((x) => x.id === id);
      if (bottle) sum += bottle.price * qty;
    }
  }
  return sum;
}

/** Grand subtotal. When the banquet is active it is exclusive: sets / 單品 /
 * 飲品 amounts are paused and the total is banquet-only. */
export function computeSubtotal(b: Booking): number {
  if (isCustomActive(b)) return customTotal(b);
  let sum = 0;
  for (const [id, sel] of Object.entries(b.setSelections)) {
    const set = byId(id);
    if (set) sum += setLineTotal(set, sel);
  }
  for (const [id, qty] of Object.entries(b.cart)) {
    const item = byId(id);
    if (item) sum += item.price * qty;
  }
  for (const item of b.drinkCart) sum += drinkItemPrice(item);
  return sum;
}

type BookingCtx = {
  booking: Booking;
  update: (patch: Partial<Booking>) => void;
  reset: () => void;
};

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(defaultBooking);

  const value = useMemo<BookingCtx>(
    () => ({
      booking,
      update: (patch) => setBooking((b) => ({ ...b, ...patch })),
      reset: () => setBooking(defaultBooking),
    }),
    [booking]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

export const totalGuests = (b: Booking) => b.adults + b.children;

export const cartCount = (b: Booking) =>
  Object.values(b.cart).reduce((a, n) => a + n, 0) +
  Object.values(b.setSelections).reduce((a, s) => a + s.qty, 0) +
  b.drinkCart.length;

/** Silence unused-import warning while keeping MENU handy for consumers. */
export const ALL_SETS = MENU.filter((m) => m.category === 'set');
