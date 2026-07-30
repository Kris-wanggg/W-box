import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEPOSIT_PER_GUEST } from '../data/menu';
import { cartSubtotal, findItem } from '../lib/pricing';
import { reservationNumber } from '../lib/format';
import type {
  CartLine,
  ContactInfo,
  CustomOrder,
  DrinkOptions,
  PaymentMethod,
  SetSelection,
} from '../types';

interface BookingState {
  adults: number;
  children: number;
  date: string | null;
  time: string | null;
  lines: CartLine[];
  contact: ContactInfo;
  paymentMethod: PaymentMethod;
  bankLast5: string;
  reservationNo: string | null;
  paidAt: number | null;
}

interface BookingApi extends BookingState {
  partySize: number;
  subtotal: number;
  deposit: number;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setDate: (iso: string) => void;
  setTime: (t: string) => void;
  setQty: (itemId: string, qty: number) => void;
  qtyOf: (itemId: string) => number;
  /** Add or replace the customised drink line for an item. */
  upsertDrink: (itemId: string, options: DrinkOptions) => void;
  /** Add or replace the edited-set line for an item. */
  upsertSet: (itemId: string, selection: SetSelection) => void;
  customLine: CartLine | undefined;
  upsertCustom: (custom: CustomOrder) => void;
  clearCustom: () => void;
  setContact: (patch: Partial<ContactInfo>) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  setBankLast5: (v: string) => void;
  confirmBooking: () => void;
  markPaid: () => void;
  reset: () => void;
}

const CUSTOM_LINE_ID = 'line-custom';

const initialState: BookingState = {
  adults: 2,
  children: 0,
  date: null,
  time: null,
  lines: [],
  contact: { name: '', phone: '', request: '' },
  paymentMethod: '線上支付信用卡',
  bankLast5: '',
  reservationNo: null,
  paidAt: null,
};

const BookingContext = createContext<BookingApi | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const patch = useCallback((p: Partial<BookingState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const qtyOf = useCallback(
    (itemId: string) =>
      state.lines.find((l) => l.itemId === itemId)?.qty ?? 0,
    [state.lines],
  );

  const setQty = useCallback((itemId: string, qty: number) => {
    setState((s) => {
      const next = Math.max(0, qty);
      const existing = s.lines.find((l) => l.itemId === itemId);

      if (existing !== undefined) {
        return {
          ...s,
          lines:
            next === 0
              ? s.lines.filter((l) => l.itemId !== itemId)
              : s.lines.map((l) => (l.itemId === itemId ? { ...l, qty: next } : l)),
        };
      }

      if (next === 0) return s;

      const item = findItem(itemId);
      if (item === undefined) return s;

      const line: CartLine = {
        id: `line-${itemId}`,
        kind: item.category === 'custom' ? 'custom' : item.category,
        itemId,
        name: item.name,
        unitPrice: item.price,
        qty: next,
      };
      return { ...s, lines: [...s.lines, line] };
    });
  }, []);

  const upsertDrink = useCallback((itemId: string, options: DrinkOptions) => {
    setState((s) => {
      const item = findItem(itemId);
      if (item === undefined) return s;
      const existing = s.lines.find((l) => l.itemId === itemId);
      if (existing !== undefined) {
        return {
          ...s,
          lines: s.lines.map((l) =>
            l.itemId === itemId
              ? { ...l, drink: options, qty: Math.max(1, l.qty) }
              : l,
          ),
        };
      }
      return {
        ...s,
        lines: [
          ...s.lines,
          {
            id: `line-${itemId}`,
            kind: 'drink',
            itemId,
            name: item.name,
            unitPrice: item.price,
            qty: 1,
            drink: options,
          },
        ],
      };
    });
  }, []);

  const upsertSet = useCallback((itemId: string, selection: SetSelection) => {
    setState((s) => {
      const item = findItem(itemId);
      if (item === undefined) return s;
      const existing = s.lines.find((l) => l.itemId === itemId);
      if (existing !== undefined) {
        return {
          ...s,
          lines: s.lines.map((l) =>
            l.itemId === itemId
              ? { ...l, set: selection, qty: Math.max(1, l.qty) }
              : l,
          ),
        };
      }
      return {
        ...s,
        lines: [
          ...s.lines,
          {
            id: `line-${itemId}`,
            kind: 'set',
            itemId,
            name: item.name,
            unitPrice: item.price,
            qty: 1,
            set: selection,
          },
        ],
      };
    });
  }, []);

  const upsertCustom = useCallback((custom: CustomOrder) => {
    setState((s) => {
      const line: CartLine = {
        id: CUSTOM_LINE_ID,
        kind: 'custom',
        itemId: CUSTOM_LINE_ID,
        name: '客製化點餐',
        unitPrice: 0,
        qty: 1,
        custom,
      };
      const rest = s.lines.filter((l) => l.id !== CUSTOM_LINE_ID);
      return { ...s, lines: [...rest, line] };
    });
  }, []);

  const clearCustom = useCallback(() => {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.id !== CUSTOM_LINE_ID) }));
  }, []);

  const setContact = useCallback((p: Partial<ContactInfo>) => {
    setState((s) => ({ ...s, contact: { ...s.contact, ...p } }));
  }, []);

  const confirmBooking = useCallback(() => {
    setState((s) => ({
      ...s,
      reservationNo:
        s.reservationNo ??
        reservationNumber(s.date, 1 + Math.floor(Math.random() * 199)),
    }));
  }, []);

  const markPaid = useCallback(() => {
    setState((s) => ({ ...s, paidAt: s.paidAt ?? Date.now() }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<BookingApi>(() => {
    const partySize = state.adults + state.children;
    return {
      ...state,
      partySize,
      subtotal: cartSubtotal(state.lines),
      deposit: partySize * DEPOSIT_PER_GUEST,
      setAdults: (n) => patch({ adults: Math.min(8, Math.max(1, n)) }),
      setChildren: (n) => patch({ children: Math.min(8, Math.max(0, n)) }),
      setDate: (iso) => patch({ date: iso, time: null }),
      setTime: (t) => patch({ time: t }),
      setQty,
      qtyOf,
      upsertDrink,
      upsertSet,
      customLine: state.lines.find((l) => l.id === CUSTOM_LINE_ID),
      upsertCustom,
      clearCustom,
      setContact,
      setPaymentMethod: (m) => patch({ paymentMethod: m }),
      setBankLast5: (v) => patch({ bankLast5: v.replace(/\D/g, '').slice(0, 5) }),
      confirmBooking,
      markPaid,
      reset,
    };
  }, [
    state,
    patch,
    setQty,
    qtyOf,
    upsertDrink,
    upsertSet,
    upsertCustom,
    clearCustom,
    setContact,
    confirmBooking,
    markPaid,
    reset,
  ]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingApi {
  const ctx = useContext(BookingContext);
  if (ctx === null) {
    throw new Error('useBooking must be used inside <BookingProvider>');
  }
  return ctx;
}
