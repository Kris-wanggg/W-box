/**
 * Reservation constants used across the flow, transcribed from the Figma
 * frames (訂位資訊 / 訂位摘要 / 付款 cards).
 */

export const RESTAURANT = '第28區中餐廳';
export const RESTAURANT_ALT = '喀啡人';
export const BOOKING_ID = '#A20260808-018';
export const DEPOSIT = 600;
export const SUPPORT_PHONE = '02-1234-5678';

export const CONTACT = {
  name: '王小姐',
  phone: '0912345678',
  request: '無',
};

export const PAYMENT_DEADLINE = '08/07（五）23:59';

export const BANK = {
  bank: '玉山銀行（銀行代碼 808）',
  branch: '城中分行',
  account: '0123-456-789012',
  holder: '第28區中餐廳有限公司',
};

export const DEPOSIT_RULES = [
  '‧ 三天前訂位：最晚須於用餐前一天完成轉帳',
  '‧ 前一天訂位：最晚須於用餐當天三小時前轉帳成功',
];

/** The three-line version the cancel-confirm screens show inline. */
export const CANCEL_RULES_SHORT = [
  '‧ 用餐日 7 日（含）前取消：全額退還訂金',
  '‧ 用餐日前 3–6 日取消：退還訂金 50%',
  '‧ 用餐日前 2 日內取消或未到店：恕不退還訂金',
];

export const CANCEL_RULES = [
  '‧ 用餐日 7 日（含）前取消：全額退還訂金',
  '‧ 用餐日前 3–6 日取消：退還訂金 50%',
  '‧ 用餐日前 2 日內取消或未到店（No-show）：恕不退還訂金',
  '‧ 因本人或二親等內親屬突發重大傷病、身故等正當事由並檢附證明：全額退還訂金',
];

export const DEPOSIT_LEGAL =
  '＊本訂金為訂位總額之定金，依衛福部「訂席、外燴（辦桌）服務定型化契約應記載及不得記載事項」原則辦理，' +
  '定金不逾預定總消費金額之 20%。';

/* ── Calendar (Restaurant/reservation-v2) ────────────────────────────────── */

export const CALENDAR_YEAR = 2026;
export const CALENDAR_MONTH = 8;
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** Mondays are the restaurant's closed days in the design. */
export const CLOSED_DAYS = [3, 10, 17, 24, 31];

export type CalendarCell = { day: number; outside: boolean; closed: boolean };

/** August 2026 starts on a Saturday, so the grid opens with six July cells. */
export function buildCalendar(): CalendarCell[] {
  const cells: CalendarCell[] = [];
  for (let d = 26; d <= 31; d += 1) cells.push({ day: d, outside: true, closed: false });
  for (let d = 1; d <= 31; d += 1) cells.push({ day: d, outside: false, closed: CLOSED_DAYS.includes(d) });
  for (let d = 1; d <= 5; d += 1) cells.push({ day: d, outside: true, closed: false });
  return cells;
}

/* ── Time slots ──────────────────────────────────────────────────────────── */

export type MealPeriod = '早餐' | '午餐' | '下午茶' | '晚餐';

export const TIME_SLOTS: Record<MealPeriod, Array<{ time: string; full?: boolean }>> = {
  早餐: [
    { time: '08:00' },
    { time: '08:30' },
    { time: '09:00' },
    { time: '09:30' },
    { time: '10:00' },
    { time: '10:30' },
    { time: '11:00' },
    { time: '11:30', full: true },
  ],
  午餐: [
    { time: '11:30' },
    { time: '12:00' },
    { time: '12:30', full: true },
    { time: '13:00' },
    { time: '13:30' },
    { time: '14:00' },
  ],
  下午茶: [{ time: '14:30' }, { time: '15:00' }, { time: '15:30' }, { time: '16:00' }, { time: '16:30' }],
  晚餐: [
    { time: '17:30' },
    { time: '18:00' },
    { time: '18:30' },
    { time: '19:00', full: true },
    { time: '19:30' },
    { time: '20:00' },
  ],
};

export const MEAL_PERIODS: MealPeriod[] = ['早餐', '午餐', '下午茶', '晚餐'];

/** `08/08（六） 18:00` — the label format used on every summary card. */
const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'];

export function formatSlot(day: number, time: string) {
  const weekday = WEEKDAY_ZH[new Date(CALENDAR_YEAR, CALENDAR_MONTH - 1, day).getDay()];
  return `${String(CALENDAR_MONTH).padStart(2, '0')}/${String(day).padStart(2, '0')}（${weekday}） ${time}`;
}
