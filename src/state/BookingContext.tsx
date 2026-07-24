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

export type Booking = {
  adults: number;
  children: number;
  date: Date | null;
  time: string | null;
  /** simple items (單品 / 飲品 / 客製化): menu item id -> quantity */
  cart: Record<string, number>;
  /** customized 套餐: set id -> selection */
  setSelections: Record<string, SetSelection>;
  contact: {
    name: string;
    phone: string;
    email: string;
    note: string;
  };
  /** confirmation code produced on the success screen */
  code: string | null;
};

const defaultBooking: Booking = {
  adults: 2,
  children: 0,
  date: null,
  time: null,
  cart: {},
  setSelections: {},
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

/** Grand subtotal: all customized sets + all simple cart items. */
export function computeSubtotal(b: Booking): number {
  let sum = 0;
  for (const [id, sel] of Object.entries(b.setSelections)) {
    const set = byId(id);
    if (set) sum += setLineTotal(set, sel);
  }
  for (const [id, qty] of Object.entries(b.cart)) {
    const item = byId(id);
    if (item) sum += item.price * qty;
  }
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
  Object.values(b.setSelections).reduce((a, s) => a + s.qty, 0);

/** Silence unused-import warning while keeping MENU handy for consumers. */
export const ALL_SETS = MENU.filter((m) => m.category === 'set');
