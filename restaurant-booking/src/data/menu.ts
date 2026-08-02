/**
 * Menu content transcribed from the Figma section "28 section v3"
 * (frames `Restaurant/choose-set/empty` and `Restaurant/choose-drink/default`).
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

/** Figma: 目前分類：套餐 ‧ 共 6 項 */
export const setMenu: MenuItem[] = [
  {
    id: 'set-duo',
    name: '雙人分享套餐',
    description: '前菜 ‧ 主餐 2 客 ‧ 湯品 ‧ 甜點｜建議 2 位',
    price: 790,
    icon: '🍽',
  },
  {
    id: 'set-lunch',
    name: '商業午餐套餐',
    description: '主餐 ‧ 湯品 ‧ 飲料｜平日 11:30-14:00 供應',
    price: 480,
    icon: '🍽',
  },
  {
    id: 'set-family',
    name: '四人家庭套餐',
    description: '6 道主菜 ‧ 湯品 ‧ 甜點｜建議 4 位 含附餐、飲料、甜點可自選',
    price: 2880,
    icon: '🍽',
  },
  {
    id: 'set-veggie',
    name: '蔬食套餐',
    description: '全素 ‧ 可調整辣度與份量 含附餐、飲料、甜點可自選',
    price: 680,
    icon: '🍽',
  },
  {
    id: 'set-senior',
    name: '長輩關懷套餐',
    description: '低鹽低油 ‧ 軟質料理｜建議長輩或術後調養',
    price: 750,
    icon: '🍽',
  },
  {
    id: 'set-chef',
    name: '主廚精選套餐',
    description: '每日限量 ‧ 依時令食材調整｜主廚推薦',
    price: 1980,
    icon: '🍽',
  },
];

/** Figma: 目前分類：飲品 ‧ 共 6 項 */
export const drinkMenu: MenuItem[] = [
  {
    id: 'drink-orange',
    name: '鮮榨柳橙汁',
    description: '現榨 ‧ 大杯 700ml ‧ 可加購其他配料',
    price: 90,
    icon: '🥤',
  },
  {
    id: 'drink-ceylon',
    name: '招牌錫蘭紅茶',
    description: '大杯 700ml ‧ 無糖至全糖可調',
    price: 60,
    icon: '🥤',
  },
  {
    id: 'drink-oolong',
    name: '冷泡烏龍青茶',
    description: '大杯 700ml ‧ 建議無糖',
    price: 80,
    icon: '🥤',
  },
  {
    id: 'drink-mojito',
    name: '手工特調莫吉托',
    description: '新鮮薄荷 ‧ 氣泡水 ‧ 萊姆',
    price: 180,
    icon: '🥤',
  },
  {
    id: 'drink-wine',
    name: '私家招牌紅酒',
    description: '法國波爾多 ‧ 單杯供應',
    price: 320,
    icon: '🍷',
  },
  {
    id: 'drink-sencha',
    name: '煎茶冷泡',
    description: '日本靜岡煎茶 ‧ 低溫慢萃 12hr',
    price: 120,
    icon: '🥤',
  },
];

/** Figma: `Meal Card/drink/empty` — 冰塊 ＊必選（單選） */
export const iceOptions = ['正常冰', '少冰', '微冰', '去冰', '常溫', '熱'];

/** Figma: `Meal Card/drink/empty` — 甜度 ＊必選（單選） */
export const sugarOptions = ['全糖', '八分糖', '半糖', '三分糖', '一分糖', '無糖'];

/** Figma: `Meal Card/drink/empty` — 加料（選填 ‧ 可複選） */
export const toppingOptions: { label: string; price: number }[] = [
  { label: '珍珠', price: 10 },
  { label: '椰果', price: 10 },
  { label: '仙草凍', price: 15 },
  { label: '布丁', price: 20 },
];

/** Figma: `Restaurant/reservation-v3` — 選擇時段 */
export const timeSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
];

export const restaurantName = '第28區中餐廳';
export const depositPerGuest = 300;
