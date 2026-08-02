import type { MenuItem } from './data/menu';

export type ScreenName =
  | 'reservation'
  | 'choose-set'
  | 'choose-drink'
  | 'contact-info'
  | 'booking-success';

/** Per-drink customisation captured by `Meal Card/drink/active`. */
export interface DrinkOptions {
  ice: string | null;
  sugar: string | null;
  toppings: string[];
  note: string;
}

export interface CartLine {
  /** Unique per cart line so the same menu item can be added twice. */
  lineId: string;
  item: MenuItem;
  quantity: number;
  kind: 'set' | 'drink';
  options?: DrinkOptions;
}

export interface BookingState {
  screen: ScreenName;
  adults: number;
  children: number;
  specialRequest: string;
  date: string | null;
  time: string | null;
  cart: CartLine[];
  contact: { name: string; phone: string; note: string };
  reservationId: string | null;
}

export const initialBooking: BookingState = {
  screen: 'reservation',
  adults: 2,
  children: 0,
  specialRequest: '',
  date: null,
  time: null,
  cart: [],
  contact: { name: '', phone: '', note: '' },
  reservationId: null,
};

export function toppingTotal(options: DrinkOptions | undefined, toppingPrices: Record<string, number>): number {
  if (!options) return 0;
  return options.toppings.reduce((sum, t) => sum + (toppingPrices[t] ?? 0), 0);
}

export function lineTotal(line: CartLine, toppingPrices: Record<string, number> = {}): number {
  return (line.item.price + toppingTotal(line.options, toppingPrices)) * line.quantity;
}

export function cartSubtotal(cart: CartLine[], toppingPrices: Record<string, number> = {}): number {
  return cart.reduce((sum, line) => sum + lineTotal(line, toppingPrices), 0);
}

export function cartItemCount(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.quantity, 0);
}

/** Figma `Restaurant/booking success` — 訂位編號 #A20260808-018 */
export function makeReservationId(date: string | null, seed: number): string {
  const compact = (date ?? '2026-08-08').replace(/-/g, '');
  return `#A${compact}-${String(seed).padStart(3, '0')}`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];

/** Figma `日期時段` — 08/09（日） 18:00 */
export function formatDateTime(date: string | null, time: string | null): string {
  if (!date) return '—';
  const parsed = new Date(`${date}T00:00:00`);
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const weekday = weekdayLabels[parsed.getDay()];
  return `${month}/${day}（${weekday}）${time ? ` ${time}` : ''}`.trim();
}

/** 手機號碼 — 用於接收 LINE／簡訊 訂位通知 */
export function isValidPhone(phone: string): boolean {
  return /^09\d{8}$/.test(phone.trim());
}

export function canSubmitContact(state: BookingState): boolean {
  return state.contact.name.trim().length > 0 && isValidPhone(state.contact.phone);
}

export function canProceedFromReservation(state: BookingState): boolean {
  return state.adults + state.children > 0 && state.date !== null && state.time !== null;
}
