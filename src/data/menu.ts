/**
 * Menu catalog for the reservation flow.
 * Categories mirror the Figma tabs: 套餐 / 單品 / 飲品 / 客製化料理.
 *
 * The 套餐 (set) items carry a full customization model — each set has
 * option groups (主餐 / 附餐 / 飲品 / 甜點) with a required pick count,
 * optional up-charges and sold-out states. Drink options additionally carry
 * 冰塊 / 甜度 choices. This mirrors the Figma "編輯套餐" panel (node 497:3658).
 */
export type MenuCategory = 'set' | 'single' | 'drink' | 'custom';

/** One selectable option inside a set-meal group (主餐 / 附餐 / …). */
export type SetOption = {
  id: string;
  name: string;
  /** extra charge in TWD when this option is chosen (0 / undefined = included) */
  upcharge?: number;
  /** sold out — shown greyed out and not selectable */
  soldOut?: boolean;
};

/** A required-choice group within a set meal. */
export type SetGroup = {
  key: string; // main / side / drink / dessert
  label: string; // 主餐 / 附餐 / 飲品 / 甜點
  unit: string; // 項 / 份 / 杯
  choose: number; // how many must be picked (請選 N)
  /** drink groups let each pick set 冰塊 / 甜度 */
  isDrink?: boolean;
  options: SetOption[];
};

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: string;
  desc: string;
  price: number;
  /** tailwind gradient classes for the thumbnail stand-in */
  thumb: string;
  /** present only on 套餐 items — the customizable groups */
  groups?: SetGroup[];
};

export const CATEGORY_TABS: { key: MenuCategory; label: string }[] = [
  { key: 'set', label: '套餐' },
  { key: 'single', label: '單品' },
  { key: 'drink', label: '飲品' },
  { key: 'custom', label: '客製化料理' },
];

export const ICE_OPTIONS = ['正常冰', '少冰', '微冰', '去冰'] as const;
export const SUGAR_OPTIONS = ['正常糖', '少糖', '半糖', '微糖', '無糖'] as const;
export type IceOption = (typeof ICE_OPTIONS)[number];
export type SugarOption = (typeof SUGAR_OPTIONS)[number];

// ── 飲品 (choose-drink) customization ──────────────────────────────
/** drink 冰塊 options include 熱飲 (hot), unlike the set-meal drink groups. */
export const DRINK_ICE_OPTIONS = [
  '正常冰',
  '少冰',
  '微冰',
  '去冰',
  '熱飲',
] as const;

export type DrinkTopping = { id: string; name: string; upcharge: number };
/** 加料 (選填・可複選) shared by every drink. */
export const DRINK_TOPPINGS: DrinkTopping[] = [
  { id: 'tp-pearl', name: '珍珠', upcharge: 10 },
  { id: 'tp-coconut', name: '椰果', upcharge: 10 },
  { id: 'tp-grass', name: '仙草凍', upcharge: 15 },
];

// ── 客製化料理 (custom banquet) ─────────────────────────────────────
export const EVENT_TYPES = [
  '謝師宴',
  '節慶',
  '公司聚餐',
  '家庭聚會',
  '慶生會',
  '尾牙春酒',
  '抓周派對',
  '商務聚餐',
  '其他',
] as const;

export const BUDGET_OPTIONS: { value: number; label: string }[] = [
  { value: 6800, label: '6,800 / 桌' },
  { value: 8800, label: '8,800 / 桌' },
  { value: 10800, label: '10,800 / 桌' },
  { value: 13800, label: '13,800 / 桌' },
  { value: 15000, label: '15,000 以上 / 桌' },
];

export const ROOM_INFO =
  '包廂低消：10 人包廂 $11,000 · 12 人包廂 $12,000 · 15 人包廂 $15,000';

export type BanquetBottle = {
  id: string;
  name: string;
  cat: string; // 養身飲品 / 酒 / 熱飲 / 冷飲
  unit: string; // 壺 / 瓶
  desc: string;
  price: number;
};

/** 整桌加購飲品 (以壺 / 瓶為單位). */
export const BANQUET_BOTTLES: BanquetBottle[] = [
  {
    id: 'bb-guiyuan',
    name: '桂圓紅棗茶（壺）',
    cat: '養身飲品',
    unit: '壺',
    desc: '養身飲品 · 約 6 杯',
    price: 320,
  },
  {
    id: 'bb-oolong',
    name: '台灣高山烏龍（壺）',
    cat: '熱飲',
    unit: '壺',
    desc: '熱飲 · 約 6 杯',
    price: 280,
  },
  {
    id: 'bb-beer',
    name: '金牌台灣啤酒（瓶）',
    cat: '酒',
    unit: '瓶',
    desc: '酒 · 冰鎮供應',
    price: 120,
  },
  {
    id: 'bb-plum',
    name: '冰鎮酸梅湯（壺）',
    cat: '冷飲',
    unit: '壺',
    desc: '冷飲 · 約 6 杯',
    price: 260,
  },
];

/** filter chips for the 加購飲品 list; `cat: null` = 全部. */
export const BANQUET_FILTERS: { label: string; cat: string | null }[] = [
  { label: '全部', cat: null },
  { label: '養身飲品', cat: '養身飲品' },
  { label: '酒', cat: '酒' },
  { label: '熱飲(壺)', cat: '熱飲' },
  { label: '冷飲', cat: '冷飲' },
];

export const MENU: MenuItem[] = [
  // ───────────────────────── 套餐 ─────────────────────────
  {
    id: 'set-couple',
    category: 'set',
    name: '雙人分享套餐',
    desc: '前菜 · 主菜 2 客 · 湯品 · 甜點 ｜ 建議 2 位',
    price: 1580,
    thumb: 'from-[#5a3a1a] to-[#8a5a2a]',
    groups: [
      {
        key: 'main',
        label: '主餐',
        unit: '項',
        choose: 2,
        options: [
          { id: 'm-steak', name: '炙燒牛排' },
          { id: 'm-salmon', name: '香煎鮭魚' },
          { id: 'm-risotto', name: '松露燉飯', soldOut: true },
          { id: 'm-cheek', name: '慢燉牛頰', upcharge: 120 },
        ],
      },
      {
        key: 'side',
        label: '附餐',
        unit: '份',
        choose: 2,
        options: [
          { id: 's-mushroom', name: '松露野菇湯' },
          { id: 's-caesar', name: '凱薩沙拉' },
          { id: 's-soup', name: '今日湯品' },
          { id: 's-fries', name: '松露薯條', upcharge: 60 },
        ],
      },
      {
        key: 'drink',
        label: '飲品',
        unit: '杯',
        choose: 2,
        isDrink: true,
        options: [
          { id: 'd-tea', name: '錫蘭紅茶' },
          { id: 'd-orange', name: '鮮榨柳橙汁', upcharge: 40 },
          { id: 'd-americano', name: '美式咖啡' },
          { id: 'd-soda', name: '氣泡水' },
        ],
      },
      {
        key: 'dessert',
        label: '甜點',
        unit: '份',
        choose: 2,
        options: [
          { id: 'de-pudding', name: '焦糖布丁' },
          { id: 'de-tiramisu', name: '提拉米蘇', upcharge: 60 },
          { id: 'de-fruit', name: '季節水果' },
          { id: 'de-lava', name: '巧克力熔岩', upcharge: 80 },
        ],
      },
    ],
  },
  {
    id: 'set-business',
    category: 'set',
    name: '商務午餐套餐',
    desc: '主餐 · 湯品 · 飲品 ｜ 平日 11:30–14:00 供應',
    price: 480,
    thumb: 'from-[#3a2a5a] to-[#5a3a8a]',
    groups: [
      {
        key: 'main',
        label: '主餐',
        unit: '項',
        choose: 1,
        options: [
          { id: 'bm-risotto', name: '松露燉飯' },
          { id: 'bm-chicken', name: '香煎雞腿排' },
          { id: 'bm-beefrice', name: '牛肉燴飯' },
          { id: 'bm-sirloin', name: '沙朗牛排', upcharge: 150 },
        ],
      },
      {
        key: 'side',
        label: '附餐',
        unit: '份',
        choose: 1,
        options: [
          { id: 'bs-soup', name: '今日例湯' },
          { id: 'bs-salad', name: '田園沙拉' },
          { id: 'bs-veg', name: '季節時蔬' },
          { id: 'bs-fries', name: '松露薯條', upcharge: 60 },
        ],
      },
      {
        key: 'drink',
        label: '飲品',
        unit: '杯',
        choose: 1,
        isDrink: true,
        options: [
          { id: 'bd-tea', name: '錫蘭紅茶' },
          { id: 'bd-americano', name: '美式咖啡' },
          { id: 'bd-orange', name: '鮮榨柳橙汁', upcharge: 40 },
          { id: 'bd-soda', name: '氣泡水' },
        ],
      },
    ],
  },
  {
    id: 'set-family',
    category: 'set',
    name: '四人家庭套餐',
    desc: '8 道主菜 · 湯品 · 甜點 ｜ 建議 4 位',
    price: 2880,
    thumb: 'from-[#7a1a3a] to-[#a83a5a]',
    groups: [
      {
        key: 'main',
        label: '主餐',
        unit: '項',
        choose: 4,
        options: [
          { id: 'fm-steak', name: '炙燒牛排' },
          { id: 'fm-salmon', name: '香煎鮭魚' },
          { id: 'fm-chicken', name: '香煎雞腿排' },
          { id: 'fm-pork', name: '蜜汁豬肋排' },
          { id: 'fm-shrimp', name: '奶油大蝦', upcharge: 180 },
          { id: 'fm-lamb', name: '香草羊排', upcharge: 220 },
        ],
      },
      {
        key: 'side',
        label: '附餐',
        unit: '份',
        choose: 2,
        options: [
          { id: 'fs-soup', name: '今日湯品' },
          { id: 'fs-salad', name: '凱薩沙拉' },
          { id: 'fs-veg', name: '奶油時蔬' },
          { id: 'fs-fries', name: '松露薯條', upcharge: 60 },
        ],
      },
      {
        key: 'drink',
        label: '飲品',
        unit: '杯',
        choose: 4,
        isDrink: true,
        options: [
          { id: 'fd-tea', name: '錫蘭紅茶' },
          { id: 'fd-orange', name: '鮮榨柳橙汁', upcharge: 40 },
          { id: 'fd-americano', name: '美式咖啡' },
          { id: 'fd-soda', name: '氣泡水' },
        ],
      },
      {
        key: 'dessert',
        label: '甜點',
        unit: '份',
        choose: 2,
        options: [
          { id: 'fde-pudding', name: '焦糖布丁' },
          { id: 'fde-tiramisu', name: '提拉米蘇', upcharge: 60 },
          { id: 'fde-fruit', name: '季節水果' },
          { id: 'fde-lava', name: '巧克力熔岩', upcharge: 80 },
        ],
      },
    ],
  },
  {
    id: 'set-veg',
    category: 'set',
    name: '蔬食套餐',
    desc: '全素 · 可調整辣度與分量 ｜ 含附餐、飲料',
    price: 680,
    thumb: 'from-[#1a5a3a] to-[#2a8a5a]',
    groups: [
      {
        key: 'main',
        label: '主餐',
        unit: '項',
        choose: 1,
        options: [
          { id: 'vm-risotto', name: '野菇燉飯' },
          { id: 'vm-curry', name: '蔬食咖哩' },
          { id: 'vm-pasta', name: '青醬義大利麵' },
          { id: 'vm-tofu', name: '鐵板豆腐排' },
        ],
      },
      {
        key: 'side',
        label: '附餐',
        unit: '份',
        choose: 1,
        options: [
          { id: 'vs-soup', name: '今日蔬菜湯' },
          { id: 'vs-salad', name: '田園沙拉' },
          { id: 'vs-veg', name: '溫沙拉', upcharge: 40 },
        ],
      },
      {
        key: 'drink',
        label: '飲品',
        unit: '杯',
        choose: 1,
        isDrink: true,
        options: [
          { id: 'vd-tea', name: '有機花草茶' },
          { id: 'vd-juice', name: '鮮榨蔬果汁', upcharge: 40 },
          { id: 'vd-soda', name: '氣泡水' },
        ],
      },
    ],
  },
  {
    id: 'set-elder',
    category: 'set',
    name: '長輩關懷套餐',
    desc: '低鹽低油 · 軟質好入口 ｜ 建議長輩桌搭配',
    price: 750,
    thumb: 'from-[#5a4a1a] to-[#8a7a2a]',
    groups: [
      {
        key: 'main',
        label: '主餐',
        unit: '項',
        choose: 1,
        options: [
          { id: 'em-fish', name: '清蒸鱈魚' },
          { id: 'em-chicken', name: '香菇雞湯燉飯' },
          { id: 'em-porridge', name: '干貝海鮮粥' },
          { id: 'em-beef', name: '軟嫩牛肉燴飯' },
        ],
      },
      {
        key: 'side',
        label: '附餐',
        unit: '份',
        choose: 1,
        options: [
          { id: 'es-soup', name: '養生例湯' },
          { id: 'es-veg', name: '清燙時蔬' },
          { id: 'es-egg', name: '蒸蛋' },
        ],
      },
      {
        key: 'dessert',
        label: '甜點',
        unit: '份',
        choose: 1,
        options: [
          { id: 'ede-pudding', name: '豆花' },
          { id: 'ede-fruit', name: '季節水果' },
          { id: 'ede-jelly', name: '愛玉檸檬' },
        ],
      },
    ],
  },
  {
    id: 'set-chef',
    category: 'set',
    name: '主廚精選套餐',
    desc: '每日限量 · 依時令食材調整 ｜ 主廚推薦',
    price: 1980,
    thumb: 'from-[#5a2a1a] to-[#8a4a2a]',
    groups: [
      {
        key: 'main',
        label: '主餐',
        unit: '項',
        choose: 2,
        options: [
          { id: 'cm-wagyu', name: '和牛沙朗' },
          { id: 'cm-lobster', name: '奶油龍蝦', upcharge: 200 },
          { id: 'cm-duck', name: '油封鴨腿' },
          { id: 'cm-cod', name: '爐烤鱈魚' },
        ],
      },
      {
        key: 'side',
        label: '附餐',
        unit: '份',
        choose: 2,
        options: [
          { id: 'cs-soup', name: '主廚濃湯' },
          { id: 'cs-salad', name: '主廚沙拉' },
          { id: 'cs-foie', name: '香煎鵝肝', upcharge: 150 },
          { id: 'cs-fries', name: '松露薯條', upcharge: 60 },
        ],
      },
      {
        key: 'drink',
        label: '飲品',
        unit: '杯',
        choose: 2,
        isDrink: true,
        options: [
          { id: 'cd-tea', name: '精品紅茶' },
          { id: 'cd-orange', name: '鮮榨柳橙汁', upcharge: 40 },
          { id: 'cd-coffee', name: '手沖咖啡', upcharge: 60 },
          { id: 'cd-soda', name: '氣泡水' },
        ],
      },
      {
        key: 'dessert',
        label: '甜點',
        unit: '份',
        choose: 2,
        options: [
          { id: 'cde-creme', name: '烤布蕾' },
          { id: 'cde-tiramisu', name: '提拉米蘇', upcharge: 60 },
          { id: 'cde-lava', name: '巧克力熔岩', upcharge: 80 },
          { id: 'cde-fruit', name: '季節水果盤' },
        ],
      },
    ],
  },
  // ───────────────────────── 單品 ─────────────────────────
  {
    id: 'single-steak',
    category: 'single',
    name: '炙烤名爐牛排',
    desc: '21 天熟成 · 主廚特調醬汁',
    price: 880,
    thumb: 'from-[#4a1a1a] to-[#7a2a2a]',
  },
  {
    id: 'single-salmon',
    category: 'single',
    name: '香煎鮭魚排',
    desc: '挪威鮭魚 · 檸檬奶油醬',
    price: 520,
    thumb: 'from-[#7a4a1a] to-[#a86a2a]',
  },
  {
    id: 'single-soup',
    category: 'single',
    name: '主廚每日例湯',
    desc: '依時令食材熬煮',
    price: 120,
    thumb: 'from-[#3a3a1a] to-[#6a6a2a]',
  },
  // ───────────────────────── 飲品 ─────────────────────────
  {
    id: 'drink-orange',
    category: 'drink',
    name: '鮮榨柳橙汁',
    desc: '現榨 · 大杯 700ml · 可加珍珠',
    price: 90,
    thumb: 'from-[#7a4a10] to-[#a86a1a]',
  },
  {
    id: 'drink-ceylon',
    category: 'drink',
    name: '招牌錫蘭紅茶',
    desc: '大杯 700ml · 無糖至全糖可調',
    price: 60,
    thumb: 'from-[#5a1a2a] to-[#8a2a3a]',
  },
  {
    id: 'drink-oolong',
    category: 'drink',
    name: '冷泡烏龍青茶',
    desc: '大杯 700ml · 建議無糖',
    price: 80,
    thumb: 'from-[#1a5a3a] to-[#2a7a4a]',
  },
  {
    id: 'drink-mojito',
    category: 'drink',
    name: '手工特調莫吉托',
    desc: '新鮮薄荷 · 氣泡水 · 萊姆',
    price: 180,
    thumb: 'from-[#1a5a4a] to-[#2a8a6a]',
  },
  {
    id: 'drink-wine',
    category: 'drink',
    name: '私家招牌紅酒',
    desc: '法國波爾多 · 單杯供應',
    price: 320,
    thumb: 'from-[#5a1a2a] to-[#8a2a4a]',
  },
  {
    id: 'drink-sencha',
    category: 'drink',
    name: '煎茶冷泡',
    desc: '日本靜岡煎茶 · 低溫慢萃 12hr',
    price: 120,
    thumb: 'from-[#2a4a1a] to-[#4a7a2a]',
  },
  // ─────────────────────── 客製化料理 ───────────────────────
  {
    id: 'custom-banquet',
    category: 'custom',
    name: '客製宴會桌菜',
    desc: '整桌預算彈性規劃 · 專人協助',
    price: 3600,
    thumb: 'from-[#4a3a1a] to-[#7a6a2a]',
  },
  {
    id: 'custom-diet',
    category: 'custom',
    name: '特殊飲食客製',
    desc: '過敏原調整 · 宗教飲食皆可',
    price: 900,
    thumb: 'from-[#2a4a5a] to-[#3a6a8a]',
  },
];

export const byId = (id: string) => MENU.find((m) => m.id === id);

export const findOption = (set: MenuItem, optId: string): SetOption | undefined =>
  set.groups?.flatMap((g) => g.options).find((o) => o.id === optId);

export const twd = (n: number) => `$${n.toLocaleString('en-US')}`;
