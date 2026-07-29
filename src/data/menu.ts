/**
 * Menu content, transcribed from the Figma frames
 * `Restaurant/choose-set/*`, `Restaurant/choose-meal`,
 * `Restaurant/choose-drink/*` and `Restaurant/custom/*`.
 */

export type Category = 'set' | 'single' | 'drink' | 'custom';

export type Option = {
  id: string;
  name: string;
  /** Upcharge in TWD; 0 for options included in the set price. */
  extra: number;
};

export type OptionGroup = {
  id: string;
  /** e.g. 主餐（請選 2 項） */
  label: string;
  pick: number;
  required: boolean;
  /** Drink groups get an ice/sugar customiser per selected cup. */
  customisable?: boolean;
  hint?: string;
  options: Option[];
};

export type MenuItem = {
  id: string;
  category: Category;
  name: string;
  description: string;
  /** Second description line, shown in brand-tinted text on set cards. */
  detail?: string;
  price: number;
  glyph: string;
  /** Sets open an editor; drinks open the ice/sugar/topping customiser. */
  groups?: OptionGroup[];
};

/** Read off `Restaurant/choose-drink/open`. 熱飲 only exists on the drink page. */
export const ICE_OPTIONS = ['正常冰', '少冰', '微冰', '去冰', '熱飲'];
/** The set editor's inline drink customiser omits 熱飲. */
export const ICE_OPTIONS_COMPACT = ['正常冰', '少冰', '微冰', '去冰'];
export const SUGAR_OPTIONS = ['正常糖', '半糖', '少糖', '微糖', '無糖'];
export const TOPPING_OPTIONS: Option[] = [
  { id: 'pearl', name: '珍珠', extra: 10 },
  { id: 'coconut', name: '椰果', extra: 10 },
  { id: 'grassjelly', name: '仙草凍', extra: 15 },
];

const mainGroup = (pick: number): OptionGroup => ({
  id: 'main',
  label: `主餐（請選 ${pick} 項）`,
  pick,
  required: true,
  options: [
    { id: 'steak', name: '炙燒牛排', extra: 0 },
    { id: 'salmon', name: '香煎鮭魚', extra: 0 },
    { id: 'risotto', name: '松露燉飯', extra: 0 },
    { id: 'cheek', name: '慢燉牛頰', extra: 120 },
  ],
});

const sideGroup = (pick: number): OptionGroup => ({
  id: 'side',
  label: `附餐（請選 ${pick} 份）`,
  pick,
  required: true,
  options: [
    { id: 'mushroom', name: '松露野菇湯', extra: 0 },
    { id: 'caesar', name: '凱薩沙拉', extra: 0 },
    { id: 'soup', name: '今日濃湯', extra: 0 },
    { id: 'fries', name: '松露薯條', extra: 60 },
  ],
});

const drinkGroup = (pick: number): OptionGroup => ({
  id: 'drink',
  label: `飲料（請選 ${pick} 杯）`,
  pick,
  required: true,
  customisable: true,
  hint: '勾選後於下方設定冰塊與甜度',
  options: [
    { id: 'blacktea', name: '錫蘭紅茶', extra: 0 },
    { id: 'orange', name: '鮮榨柳橙汁', extra: 40 },
    { id: 'americano', name: '美式咖啡', extra: 0 },
    { id: 'sparkling', name: '氣泡水', extra: 0 },
  ],
});

const dessertGroup = (pick: number): OptionGroup => ({
  id: 'dessert',
  label: `甜點（請選 ${pick} 份）`,
  pick,
  required: true,
  options: [
    { id: 'pudding', name: '焦糖布丁', extra: 0 },
    { id: 'tiramisu', name: '提拉米蘇', extra: 60 },
    { id: 'fruit', name: '季節水果', extra: 0 },
    { id: 'lava', name: '巧克力熔岩', extra: 80 },
  ],
});

export const SETS: MenuItem[] = [
  {
    id: 'set-duo',
    category: 'set',
    name: '雙人分享套餐',
    description: '前菜 ‧ 主餐 2 客 ‧ 湯品 ‧ 甜點｜建議 2 位',
    detail: '✓ 主餐 炙燒牛排 ×1、香煎鮭魚 ×1 ‧ 附餐 2 份 ‧ 飲料 2 杯 ‧ 甜點 2 份',
    price: 1580,
    glyph: '🍽',
    groups: [mainGroup(2), sideGroup(2), drinkGroup(2), dessertGroup(2)],
  },
  {
    id: 'set-lunch',
    category: 'set',
    name: '商業午餐套餐',
    description: '主餐 ‧ 湯品 ‧ 飲料｜平日 11:30–14:00 供應',
    detail: '✓ 主餐 松露燉飯 ×1 ‧ 附餐 1 份 ‧ 飲料 1 杯（少冰 ‧ 半糖）',
    price: 480,
    glyph: '🍽',
    groups: [mainGroup(1), sideGroup(1), drinkGroup(1)],
  },
  {
    id: 'set-family',
    category: 'set',
    name: '四人家庭套餐',
    description: '6 道主菜 ‧ 湯品 ‧ 甜點｜建議 4 位 含附餐、飲料、甜點可自選',
    price: 2880,
    glyph: '🍽',
    groups: [mainGroup(4), sideGroup(4), drinkGroup(4), dessertGroup(4)],
  },
  {
    id: 'set-veg',
    category: 'set',
    name: '蔬食套餐',
    description: '全素 ‧ 可調整辣度與份量 含附餐、飲料、甜點可自選',
    price: 680,
    glyph: '🍽',
    groups: [mainGroup(1), sideGroup(1), drinkGroup(1), dessertGroup(1)],
  },
  {
    id: 'set-senior',
    category: 'set',
    name: '長輩關懷套餐',
    description: '低鹽低油 ‧ 軟質料理｜建議長輩或術後調養',
    price: 750,
    glyph: '🍽',
    groups: [mainGroup(1), sideGroup(1), drinkGroup(1)],
  },
  {
    id: 'set-chef',
    category: 'set',
    name: '主廚精選套餐',
    description: '每日限量 ‧ 依時令食材調整｜主廚推薦',
    price: 1980,
    glyph: '🍽',
    groups: [mainGroup(1), sideGroup(1), drinkGroup(1), dessertGroup(1)],
  },
];

export const SINGLES: MenuItem[] = [
  {
    id: 'single-wagyu',
    category: 'single',
    name: '炙燒和牛',
    description: 'A5 和牛 150g ‧ 附時蔬與醬料',
    price: 980,
    glyph: '🥩',
  },
  {
    id: 'single-salmon',
    category: 'single',
    name: '香煎鮭魚佐時蔬',
    description: '挪威鮭魚 ‧ 附主廚時蔬',
    price: 480,
    glyph: '🥩',
  },
  {
    id: 'single-risotto',
    category: 'single',
    name: '松露燉飯',
    description: '義大利卡納羅利米 ‧ 黑松露醬',
    price: 380,
    glyph: '🥩',
  },
];

export const DRINKS: MenuItem[] = [
  {
    id: 'drink-orange',
    category: 'drink',
    name: '鮮榨柳橙汁',
    description: '當日現榨 ‧ 無額外加糖',
    price: 90,
    glyph: '🥤',
  },
  {
    id: 'drink-blacktea',
    category: 'drink',
    name: '招牌錫蘭紅茶',
    description: '斯里蘭卡高地茶葉 ‧ 回甘不澀',
    price: 60,
    glyph: '🥤',
  },
  {
    id: 'drink-oolong',
    category: 'drink',
    name: '冷泡烏龍青茶',
    description: '低溫冷泡 8 小時 ‧ 清爽花香',
    price: 80,
    glyph: '🥤',
  },
  {
    id: 'drink-mojito',
    category: 'drink',
    name: '手工特調莫吉托',
    description: '新鮮薄荷與萊姆 ‧ 可調整酒精濃度',
    price: 180,
    glyph: '🍹',
  },
  {
    id: 'drink-wine',
    category: 'drink',
    name: '私家招牌紅酒',
    description: '單杯供應 ‧ 主廚推薦餐搭',
    price: 320,
    glyph: '🍷',
  },
  {
    id: 'drink-sencha',
    category: 'drink',
    name: '煎茶冷泡',
    description: '日本靜岡煎茶 ‧ 不加糖',
    price: 120,
    glyph: '🍵',
  },
];

export const MENU: Record<Category, MenuItem[]> = {
  set: SETS,
  single: SINGLES,
  drink: DRINKS,
  custom: [],
};

export const CATEGORY_TABS: Array<{ id: Category; label: string }> = [
  { id: 'set', label: '套餐' },
  { id: 'single', label: '單品' },
  { id: 'drink', label: '飲品' },
  { id: 'custom', label: '客製化料理' },
];

export function findItem(id: string): MenuItem | undefined {
  return [...SETS, ...SINGLES, ...DRINKS].find((item) => item.id === id);
}

/* ── 客製化料理 (Restaurant/custom/*) ─────────────────────────────────────── */

export const EVENT_TYPES = [
  '謝師宴',
  '節慶',
  '公司聚餐',
  '家庭聚會',
  '慶生會',
  '尾牙春酒',
  '抓週派對',
  '商務聚餐',
  '其他',
];

export const BUDGETS = ['6,800', '8,800', '10,800', '13,800', '15,000 以上'];

export const ROOM_HINT = '包廂低消：10 人包廂 $11,000 ‧ 12 人包廂 $12,000 ‧ 15 人包廂 $15,000';

/**
 * 加購飲品 on `custom/add drink`: a filter row over a list of add-on drinks,
 * each with its own quantity stepper and per-unit price.
 */
export const CUSTOM_DRINK_CATEGORIES = ['全部', '養身飲品', '酒', '熱飲（壺）', '冷飲'] as const;
export type CustomDrinkCategory = (typeof CUSTOM_DRINK_CATEGORIES)[number];

export type CustomDrink = {
  id: string;
  name: string;
  category: Exclude<CustomDrinkCategory, '全部'>;
  /** e.g. 約 6 杯 */
  serves: string;
  price: number;
  unit: string;
};

export const CUSTOM_DRINKS: CustomDrink[] = [
  { id: 'longan', name: '桂圓紅棗茶（壺）', category: '養身飲品', serves: '約 6 杯', price: 320, unit: '壺' },
  { id: 'oolong', name: '台灣高山烏龍（壺）', category: '熱飲（壺）', serves: '約 8 杯', price: 280, unit: '壺' },
  { id: 'beer', name: '金牌台灣啤酒', category: '酒', serves: '冰鎮供應', price: 120, unit: '瓶' },
  { id: 'plum', name: '冰鎮酸梅湯（壺）', category: '冷飲', serves: '約 6 杯', price: 260, unit: '壺' },
];

export function findCustomDrink(id: string) {
  return CUSTOM_DRINKS.find((d) => d.id === id);
}
