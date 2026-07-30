/**
 * Booking availability. Pure front-end mock — no API, no database.
 *
 * The Figma calendar (frame 779:2572) shows 2026/08 with the 3rd, 10th,
 * 17th, 24th and 31st greyed out as "Day Button (Closed)". Those are all
 * Mondays, so the rule below is 週一公休 rather than a hard-coded list.
 */

export interface TimeSlotGroup {
  label: '早餐' | '午餐' | '晚餐';
  times: string[];
}

export const TIME_SLOT_GROUPS: TimeSlotGroup[] = [
  { label: '早餐', times: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'] },
  { label: '午餐', times: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'] },
  { label: '晚餐', times: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00'] },
];

export const ALL_TIMES = TIME_SLOT_GROUPS.flatMap((g) => g.times);

/** Slots with no table left, keyed by ISO date. */
const FULL_SLOTS: Record<string, string[]> = {
  '2026-08-08': ['12:00', '19:00'],
  '2026-08-15': ['18:00', '18:30', '19:00'],
};

/** Dates where every slot is gone — drives the reservation-v2/empty state. */
const FULLY_BOOKED: string[] = ['2026-08-05'];

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function toISODate(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 週一公休 */
export function isClosed(d: Date): boolean {
  return d.getDay() === 1;
}

export function isPast(d: Date): boolean {
  return d.getTime() < startOfToday().getTime();
}

export function isSelectable(d: Date): boolean {
  return !isClosed(d) && !isPast(d);
}

export function isFullyBooked(iso: string | null): boolean {
  return iso !== null && FULLY_BOOKED.includes(iso);
}

export function isSlotFull(iso: string | null, time: string): boolean {
  if (iso === null) return false;
  if (isFullyBooked(iso)) return true;
  return (FULL_SLOTS[iso] ?? []).includes(time);
}

/**
 * The 42 cells of a month grid (6 weeks × 7 days), starting on the Sunday
 * of the week containing the 1st. Cells outside the month render as
 * "Day Button (Outside)".
 */
export function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
