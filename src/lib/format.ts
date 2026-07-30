const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'];

export function currency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/** 2026-08-08 → 08/08（六） */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  const day = new Date(`${iso}T00:00:00`).getDay();
  return `${m}/${d}（${WEEKDAY_ZH[day]}）`;
}

/** 2026-08-08 + 18:00 → 08/08（六） 18:00 */
export function dateTimeLabel(iso: string | null, time: string | null): string {
  if (iso === null || time === null) return '—';
  return `${shortDate(iso)} ${time}`;
}

/** 2026 年 8月 */
export function monthLabel(year: number, month: number): string {
  return `${year} 年 ${month + 1}月`;
}

/** Payment deadline = the day before the booking, 23:59. */
export function paymentDeadline(iso: string | null): string {
  if (iso === null) return '—';
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() - 1);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${m}/${day}（${WEEKDAY_ZH[d.getDay()]}）23:59`;
}

/** 7/23（四）10:48 — timestamp shown on the pay-success receipt. */
export function receiptTimestamp(at: number): string {
  const d = new Date(at);
  const hh = `${d.getHours()}`.padStart(2, '0');
  const mm = `${d.getMinutes()}`.padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAY_ZH[d.getDay()]}）${hh}:${mm}`;
}

/** #A20260808-018 */
export function reservationNumber(iso: string | null, seq: number): string {
  const compact = (iso ?? '00000000').replace(/-/g, '');
  return `#A${compact}-${`${seq}`.padStart(3, '0')}`;
}
