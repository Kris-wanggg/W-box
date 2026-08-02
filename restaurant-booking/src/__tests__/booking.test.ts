import { describe, it, expect } from 'vitest';
import {
  canProceedFromReservation,
  canSubmitContact,
  cartItemCount,
  cartSubtotal,
  formatCurrency,
  formatDateTime,
  initialBooking,
  isValidPhone,
  lineTotal,
  makeReservationId,
  type CartLine,
} from '../booking';
import { setMenu, drinkMenu, toppingOptions } from '../data/menu';

const toppingPrices = Object.fromEntries(
  toppingOptions.map((t) => [t.label, t.price]),
);

const setLine = (quantity: number): CartLine => ({
  lineId: 'l1',
  item: setMenu[0], // 雙人分享套餐 $790
  quantity,
  kind: 'set',
});

describe('金額計算', () => {
  it('單一套餐的小計 = 單價 × 數量', () => {
    expect(lineTotal(setLine(2))).toBe(1580);
  });

  it('飲品加料會計入小計', () => {
    const line: CartLine = {
      lineId: 'l2',
      item: drinkMenu[0], // 鮮榨柳橙汁 $90
      quantity: 2,
      kind: 'drink',
      options: { ice: '少冰', sugar: '半糖', toppings: ['珍珠', '布丁'], note: '' },
    };
    // (90 + 10 + 20) × 2
    expect(lineTotal(line, toppingPrices)).toBe(240);
  });

  it('購物車小計為各品項加總', () => {
    const cart = [setLine(1), { ...setLine(2), lineId: 'l3', item: setMenu[1] }];
    // 790 + 480×2
    expect(cartSubtotal(cart)).toBe(1750);
  });

  it('空購物車小計為 0，符合 choose-set/empty 的 $0', () => {
    expect(cartSubtotal([])).toBe(0);
    expect(cartItemCount([])).toBe(0);
  });

  it('金額格式帶千分位，符合 Figma 的 $2,880', () => {
    expect(formatCurrency(2880)).toBe('$2,880');
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('日期時段格式', () => {
  it('輸出 Figma 的 08/09（日） 18:00 格式', () => {
    expect(formatDateTime('2026-08-09', '18:00')).toBe('08/09（日） 18:00');
  });

  it('未選日期時顯示破折號', () => {
    expect(formatDateTime(null, null)).toBe('—');
  });
});

describe('訂位編號', () => {
  it('產生 Figma 的 #A20260808-018 格式', () => {
    expect(makeReservationId('2026-08-08', 18)).toBe('#A20260808-018');
  });
});

describe('表單驗證', () => {
  it.each([
    ['0912345678', true],
    ['0912 345 678', false],
    ['091234567', false],
    ['1912345678', false],
    ['', false],
  ])('手機號碼 %s -> %s', (phone, expected) => {
    expect(isValidPhone(phone)).toBe(expected);
  });

  it('姓名與手機都填妥才能送出', () => {
    expect(
      canSubmitContact({
        ...initialBooking,
        contact: { name: '王小姐', phone: '0912345678', note: '' },
      }),
    ).toBe(true);

    expect(
      canSubmitContact({
        ...initialBooking,
        contact: { name: '', phone: '0912345678', note: '' },
      }),
    ).toBe(false);

    expect(
      canSubmitContact({
        ...initialBooking,
        contact: { name: '王小姐', phone: '0912', note: '' },
      }),
    ).toBe(false);
  });
});

describe('訂位第一步的完成條件', () => {
  it('需同時選好人數、日期與時段', () => {
    expect(canProceedFromReservation(initialBooking)).toBe(false);

    expect(
      canProceedFromReservation({
        ...initialBooking,
        date: '2026-08-09',
        time: '18:00',
      }),
    ).toBe(true);
  });

  it('人數為 0 時不可進入下一步', () => {
    expect(
      canProceedFromReservation({
        ...initialBooking,
        adults: 0,
        children: 0,
        date: '2026-08-09',
        time: '18:00',
      }),
    ).toBe(false);
  });
});

describe('選單內容與 Figma 一致', () => {
  it('套餐共 6 項', () => {
    expect(setMenu).toHaveLength(6);
  });

  it('飲品共 6 項', () => {
    expect(drinkMenu).toHaveLength(6);
  });

  it('雙人分享套餐為 $790', () => {
    const duo = setMenu.find((i) => i.name === '雙人分享套餐');
    expect(duo?.price).toBe(790);
    expect(duo?.description).toBe('前菜 ‧ 主餐 2 客 ‧ 湯品 ‧ 甜點｜建議 2 位');
  });
});
