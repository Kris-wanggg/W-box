/**
 * Menu catalog for the reservation flow.
 * Categories mirror the Figma tabs: 套餐 / 單品 / 飲品 / 客製化料理.
 */
export type MenuCategory = 'set' | 'single' | 'drink' | 'custom';

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: string;
  desc: string;
  price: number;
  /** tailwind gradient classes for the thumbnail stand-in */
  thumb: string;
};

export const CATEGORY_TABS: { key: MenuCategory; label: string }[] = [
  { key: 'set', label: '套餐' },
  { key: 'single', label: '單品' },
  { key: 'drink', label: '飲品' },
  { key: 'custom', label: '客製化料理' },
];

export const MENU: MenuItem[] = [
  // 套餐
  {
    id: 'set-couple',
    category: 'set',
    name: '雙人分享套餐',
    desc: '前菜 · 主菜 2 · 湯品 · 甜點 ｜ 建議 2 位',
    price: 1580,
    thumb: 'from-[#5a3a1a] to-[#8a5a2a]',
  },
  {
    id: 'set-business',
    category: 'set',
    name: '商務午餐套餐',
    desc: '主餐 · 湯品 · 飲品 ｜ 平日 11:30–14:00 供應',
    price: 480,
    thumb: 'from-[#3a2a5a] to-[#5a3a8a]',
  },
  {
    id: 'set-family',
    category: 'set',
    name: '四人家庭套餐',
    desc: '8 道主菜 · 湯品 · 甜點 ｜ 建議 4 位',
    price: 2880,
    thumb: 'from-[#7a1a3a] to-[#a83a5a]',
  },
  {
    id: 'set-veg',
    category: 'set',
    name: '蔬食套餐',
    desc: '全素 · 可調整辣度與分量 ｜ 含附餐、飲料',
    price: 680,
    thumb: 'from-[#1a5a3a] to-[#2a8a5a]',
  },
  {
    id: 'set-elder',
    category: 'set',
    name: '長輩關懷套餐',
    desc: '低鹽低油 · 軟質好入口 ｜ 建議長輩桌搭配',
    price: 750,
    thumb: 'from-[#5a4a1a] to-[#8a7a2a]',
  },
  {
    id: 'set-chef',
    category: 'set',
    name: '主廚精選套餐',
    desc: '每日限量 · 依時令食材調整 ｜ 主廚推薦',
    price: 1980,
    thumb: 'from-[#5a2a1a] to-[#8a4a2a]',
  },
  // 單品
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
  // 飲品
  {
    id: 'drink-tea',
    category: 'drink',
    name: '招牌手沖茶',
    desc: '高山烏龍 · 無限續杯',
    price: 150,
    thumb: 'from-[#1a5a4a] to-[#2a8a6a]',
  },
  {
    id: 'drink-juice',
    category: 'drink',
    name: '鮮榨果汁',
    desc: '當季水果 · 每日新鮮',
    price: 130,
    thumb: 'from-[#7a5a1a] to-[#a88a2a]',
  },
  {
    id: 'drink-wine',
    category: 'drink',
    name: '單杯紅酒',
    desc: '主廚嚴選 · 佐餐推薦',
    price: 280,
    thumb: 'from-[#5a1a2a] to-[#8a2a4a]',
  },
  // 客製化料理
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

export const twd = (n: number) => `$${n.toLocaleString('en-US')}`;
