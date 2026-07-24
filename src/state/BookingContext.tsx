import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Booking = {
  adults: number;
  children: number;
  date: Date | null;
  time: string | null;
  /** cart: menu item id -> quantity */
  cart: Record<string, number>;
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
  contact: { name: '', phone: '', email: '', note: '' },
  code: null,
};

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
  Object.values(b.cart).reduce((a, n) => a + n, 0);
