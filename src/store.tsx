/**
 * Booking state shared by the clickable flow.
 *
 * The static state screens (額滿 / 候補 / 取消 / 查詢結果 …) read the same store
 * so the numbers on those screens follow whatever the tester picked earlier in
 * the flow instead of drifting from the design's sample data.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { CUSTOM_DRINK_GROUPS, TOPPING_OPTIONS, findItem, type MenuItem } from './data/menu';
import { CONTACT, DEPOSIT, formatSlot } from './data/reservation';

export type DrinkPref = { ice: string; sugar: string; toppings: string[]; note?: string };

export function toppingPrice(ids: string[]): number {
  return ids.reduce((sum, id) => sum + (TOPPING_OPTIONS.find((t) => t.id === id)?.extra ?? 0), 0);
}

export type CartLine = {
  /** Unique per configuration, so one set can appear twice with different content. */
  key: string;
  itemId: string;
  qty: number;
  /** groupId → selected option ids (sets only). */
  selections: Record<string, string[]>;
  /** optionId or item id → ice/sugar/toppings (drinks only). */
  drinkPrefs: Record<string, DrinkPref>;
  note: string;
};

export type PaymentMethod = 'card' | 'bank' | 'online';
export type PaymentStatus = 'unpaid' | 'paid';

export type CustomOrder = {
  eventType: string;
  budget: string;
  privateRoom: '不需要' | '需要';
  addDrinks: '現場需求加購' | '需要加購';
  drinkIds: string[];
};

type Booking = {
  adults: number;
  children: number;
  day: number;
  time: string;
  cart: CartLine[];
  custom: CustomOrder | null;
  contact: { name: string; phone: string; request: string };
  payment: PaymentMethod;
  paymentStatus: PaymentStatus;
};

type Store = Booking & {
  slotLabel: string;
  partyLabel: string;
  itemCount: number;
  subtotal: number;
  deposit: number;
  set: <K extends keyof Booking>(key: K, value: Booking[K]) => void;
  addLine: (line: Omit<CartLine, 'key'> & { key?: string }) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  reset: () => void;
};

const INITIAL: Booking = {
  adults: 2,
  children: 0,
  day: 8,
  time: '18:00',
  // The design ships choose-set/default with two sets already in the summary.
  cart: [
    { key: 'set-duo', itemId: 'set-duo', qty: 1, selections: {}, drinkPrefs: {}, note: '' },
    { key: 'set-lunch', itemId: 'set-lunch', qty: 1, selections: {}, drinkPrefs: {}, note: '' },
  ],
  custom: null,
  contact: { ...CONTACT },
  payment: 'card',
  paymentStatus: 'unpaid',
};

const StoreContext = createContext<Store | null>(null);

/** Unit price of a line: base price plus every upcharge its selections carry. */
export function linePrice(line: CartLine, item = findItem(line.itemId)): number {
  if (!item) return 0;
  let extra = 0;
  for (const group of item.groups ?? []) {
    for (const id of line.selections[group.id] ?? []) {
      extra += group.options.find((o) => o.id === id)?.extra ?? 0;
    }
  }
  for (const pref of Object.values(line.drinkPrefs)) {
    extra += toppingPrice(pref.toppings);
  }
  return item.price + extra;
}

export function lineExtra(line: CartLine, item?: MenuItem): number {
  const resolved = item ?? findItem(line.itemId);
  return resolved ? linePrice(line, resolved) - resolved.price : 0;
}

/**
 * A 客製化 order contributes its per-table budget plus any add-on drinks — the
 * design's 小計 of $12,860 is 1,580 + 480 + 10,800.
 */
export function customTotal(custom: CustomOrder | null): number {
  if (!custom) return 0;
  const budget = Number(custom.budget.replace(/[^\d]/g, '')) || 0;
  const drinks = CUSTOM_DRINK_GROUPS.flatMap((g) => g.options)
    .filter((o) => custom.drinkIds.includes(o.id))
    .reduce((sum, o) => sum + o.extra, 0);
  return budget + drinks;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(INITIAL);

  const value = useMemo<Store>(() => {
    const itemsTotal = booking.cart.reduce((sum, line) => sum + linePrice(line) * line.qty, 0);
    const itemCount = booking.cart.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = itemsTotal + customTotal(booking.custom);

    return {
      ...booking,
      subtotal,
      itemCount,
      deposit: DEPOSIT,
      slotLabel: formatSlot(booking.day, booking.time),
      partyLabel:
        booking.children > 0
          ? `成人 ${booking.adults} 位 ‧ 小孩 ${booking.children} 位`
          : `${booking.adults} 位`,

      set: (key, next) => setBooking((prev) => ({ ...prev, [key]: next })),

      addLine: (line) =>
        setBooking((prev) => {
          const key = line.key ?? `${line.itemId}-${Date.now()}`;
          const existing = prev.cart.find((l) => l.key === key);
          if (existing) {
            return {
              ...prev,
              cart: prev.cart.map((l) => (l.key === key ? { ...l, ...line, key } : l)),
            };
          }
          return { ...prev, cart: [...prev.cart, { ...line, key }] };
        }),

      setQty: (key, qty) =>
        setBooking((prev) => ({
          ...prev,
          cart:
            qty <= 0
              ? prev.cart.filter((l) => l.key !== key)
              : prev.cart.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),

      clearCart: () => setBooking((prev) => ({ ...prev, cart: [], custom: null })),
      reset: () => setBooking(INITIAL),
    };
  }, [booking]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useBooking(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useBooking must be used inside <BookingProvider>');
  return store;
}
