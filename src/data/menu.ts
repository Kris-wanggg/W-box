import type { AddOnDrink, IceLevel, MenuItem, SugarLevel, Topping } from '../types';

export const RESTAURANT_NAME = '第28區中餐廳';
export const RESTAURANT_LEGAL_NAME = '第28區中餐廳有限公司';

/** Deposit is $300 per guest — reproduces the design's "2 位 → 訂金 $600". */
export const DEPOSIT_PER_GUEST = 300;

export const ICE_LEVELS: IceLevel[] = ['正常冰', '少冰', '微冰', '去冰', '熱飲'];
export const SUGAR_LEVELS: SugarLevel[] = ['正常糖', '半糖', '少糖', '微糖', '無糖'];

/** 套餐 內建飲料只給冰塊／甜度，不含熱飲。 */
export const SET_ICE_LEVELS: IceLevel[] = ['正常冰', '少冰', '微冰', '去冰'];

export const DRINK_TOPPINGS: Topping[] = [
  { name: '珍珠', upcharge: 10 },
  { name: '椰果', upcharge: 10 },
  { name: '仙草凍', upcharge: 15 },
];

export const NOTE_MAX = 50;

const SHARING_SET_GROUPS = [
  {
    id: 'main',
    label: '主餐',
    quota: 2,
    required: true,
    choices: [
      { name: '炙燒牛排', upcharge: 0 },
      { name: '香煎鮭魚', upcharge: 0 },
      { name: '松露燉飯', upcharge: 0 },
      { name: '慢燉牛頰', upcharge: 120 },
    ],
  },
  {
    id: 'side',
    label: '附餐',
    quota: 2,
    required: true,
    choices: [
      { name: '松露野菇湯', upcharge: 0 },
      { name: '凱薩沙拉', upcharge: 0 },
      { name: '今日濃湯', upcharge: 0 },
      { name: '松露薯條', upcharge: 60 },
    ],
  },
  {
    id: 'drink',
    label: '飲料',
    quota: 2,
    required: true,
    hint: '勾選後於下方設定冰塊與甜度',
    choices: [
      { name: '錫蘭紅茶', upcharge: 0, isDrink: true },
      { name: '鮮榨柳橙汁', upcharge: 40, isDrink: true },
      { name: '美式咖啡', upcharge: 0, isDrink: true },
      { name: '氣泡水', upcharge: 0, isDrink: true },
    ],
  },
  {
    id: 'dessert',
    label: '甜點',
    quota: 2,
    required: true,
    choices: [
      { name: '焦糖布丁', upcharge: 0 },
      { name: '提拉米蘇', upcharge: 60 },
      { name: '季節水果', upcharge: 0 },
      { name: '巧克力熔岩', upcharge: 80 },
    ],
  },
];

const LUNCH_SET_GROUPS = [
  {
    id: 'main',
    label: '主餐',
    quota: 1,
    required: true,
    choices: [
      { name: '松露燉飯', upcharge: 0 },
      { name: '炙燒牛排', upcharge: 120 },
      { name: '香煎鮭魚', upcharge: 60 },
    ],
  },
  {
    id: 'side',
    label: '附餐',
    quota: 1,
    required: true,
    choices: [
      { name: '今日濃湯', upcharge: 0 },
      { name: '凱薩沙拉', upcharge: 0 },
      { name: '松露野菇湯', upcharge: 40 },
    ],
  },
  {
    id: 'drink',
    label: '飲料',
    quota: 1,
    required: true,
    hint: '勾選後於下方設定冰塊與甜度',
    choices: [
      { name: '錫蘭紅茶', upcharge: 0, isDrink: true },
      { name: '美式咖啡', upcharge: 0, isDrink: true },
      { name: '鮮榨柳橙汁', upcharge: 40, isDrink: true },
    ],
  },
];

export const MENU: MenuItem[] = [
  // ── 套餐 ────────────────────────────────────────────────────────────
  {
    id: 'set-sharing',
    category: 'set',
    emoji: '🍽',
    name: '雙人分享套餐',
    price: 1580,
    description: '前菜 ‧ 主餐 2 客 ‧ 湯品 ‧ 甜點｜建議 2 位',
    detail: '主餐 炙燒牛排 ×1、香煎鮭魚 ×1 ‧ 附餐 2 份 ‧ 飲料 2 杯 ‧ 甜點 2 份',
    groups: SHARING_SET_GROUPS,
  },
  {
    id: 'set-lunch',
    category: 'set',
    emoji: '🍽',
    name: '商業午餐套餐',
    price: 480,
    description: '主餐 ‧ 湯品 ‧ 飲料｜平日 11:30–14:00 供應',
    detail: '主餐 松露燉飯 ×1 ‧ 附餐 1 份 ‧ 飲料 1 杯（少冰 ‧ 半糖）',
    groups: LUNCH_SET_GROUPS,
  },
  {
    id: 'set-family',
    category: 'set',
    emoji: '🍽',
    name: '四人家庭套餐',
    price: 2880,
    description: '6 道主菜 ‧ 湯品 ‧ 甜點｜建議 4 位 含附餐、飲料、甜點可自選',
  },
  {
    id: 'set-veggie',
    category: 'set',
    emoji: '🍽',
    name: '蔬食套餐',
    price: 680,
    description: '全素 ‧ 可調整辣度與份量 含附餐、飲料、甜點可自選',
  },
  {
    id: 'set-elder',
    category: 'set',
    emoji: '🍽',
    name: '長輩關懷套餐',
    price: 750,
    description: '低鹽低油 ‧ 軟質料理｜建議長輩或術後調養',
  },
  {
    id: 'set-chef',
    category: 'set',
    emoji: '🍽',
    name: '主廚精選套餐',
    price: 1980,
    description: '每日限量 ‧ 依時令食材調整｜主廚推薦',
  },

  // ── 單品 ────────────────────────────────────────────────────────────
  {
    id: 'single-wagyu',
    category: 'single',
    emoji: '🥩',
    name: '炙燒和牛',
    price: 980,
    description: 'A5 和牛 150g ‧ 附時蔬與醬料',
  },
  {
    id: 'single-salmon',
    category: 'single',
    emoji: '🥩',
    name: '香煎鮭魚佐時蔬',
    price: 480,
    description: '挪威鮭魚 ‧ 附主廚時蔬',
  },
  {
    id: 'single-risotto',
    category: 'single',
    emoji: '🥩',
    name: '松露燉飯',
    price: 380,
    description: '義大利卡納羅利米 ‧ 黑松露醬',
  },

  // ── 飲品 ────────────────────────────────────────────────────────────
  // NOTE: the Figma frames left every drink description as the unfilled
  // placeholder "Meal Description". Copy below is a stand-in.
  {
    id: 'drink-orange',
    category: 'drink',
    emoji: '🥤',
    name: '鮮榨柳橙汁',
    price: 90,
    description: '每日現榨 ‧ 無額外加糖',
  },
  {
    id: 'drink-ceylon',
    category: 'drink',
    emoji: '🥤',
    name: '招牌錫蘭紅茶',
    price: 60,
    description: '斯里蘭卡高地茶葉 ‧ 現沖',
  },
  {
    id: 'drink-oolong',
    category: 'drink',
    emoji: '🥤',
    name: '冷泡烏龍青茶',
    price: 80,
    description: '低溫慢萃 8 小時 ‧ 回甘不苦澀',
  },
  {
    id: 'drink-mojito',
    category: 'drink',
    emoji: '🥤',
    name: '手工特調莫吉托',
    price: 180,
    description: '新鮮薄荷 ‧ 青檸 ‧ 可調整酒精濃度',
  },
  {
    id: 'drink-wine',
    category: 'drink',
    emoji: '🥤',
    name: '私家招牌紅酒',
    price: 320,
    description: '單杯供應 ‧ 侍酒師選酒',
  },
  {
    id: 'drink-sencha',
    category: 'drink',
    emoji: '🥤',
    name: '煎茶冷泡',
    price: 120,
    description: '日本靜岡煎茶 ‧ 清爽尾韻',
  },
];

export const ADD_ON_DRINKS: AddOnDrink[] = [
  {
    id: 'addon-longan',
    name: '桂圓紅棗茶（壺）',
    group: '養身飲品',
    unit: '壺',
    yieldNote: '約 6 杯',
    price: 320,
  },
  {
    id: 'addon-oolong',
    name: '台灣高山烏龍（壺）',
    group: '熱飲（壺）',
    unit: '壺',
    yieldNote: '約 8 杯',
    price: 280,
  },
  {
    id: 'addon-beer',
    name: '金牌台灣啤酒',
    group: '酒',
    unit: '瓶',
    yieldNote: '冰鎮供應',
    price: 120,
  },
  {
    id: 'addon-plum',
    name: '冰鎮酸梅湯（壺）',
    group: '冷飲',
    unit: '壺',
    yieldNote: '約 6 杯',
    price: 260,
  },
];

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

export const TABLE_PRICES = [6800, 8800, 10800, 13800, 15000];

export const BANK_ACCOUNT = {
  bank: '玉山銀行（銀行代碼 808）',
  branch: '城中分行',
  account: '0123-456-789012',
  holder: RESTAURANT_LEGAL_NAME,
};

export const DEPOSIT_RULES = [
  '‧ 三天前訂位：最晚須於用餐前一天完成轉帳',
  '‧ 前一天訂位：最晚須於用餐當天三小時前轉帳成功',
];

export const CANCEL_RULES = [
  '‧ 用餐日 7 日（含）前取消：全額退還訂金',
  '‧ 用餐日前 3–6 日取消：退還訂金 50%',
  '‧ 用餐日前 2 日內取消或未到店（No-show）：恕不退還訂金',
  '‧ 因本人或二親等內親屬突發重大傷病、身故等正當事由並檢附證明：全額退還訂金',
];

export const DEPOSIT_LEGAL_NOTE =
  '＊本訂金為訂位總額之定金，依衛福部「訂席、外燴（辦桌）服務定型化契約應記載及不得記載事項」原則辦理。';
