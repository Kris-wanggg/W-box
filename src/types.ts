export type IceLevel = '正常冰' | '少冰' | '微冰' | '去冰' | '熱飲';
export type SugarLevel = '正常糖' | '半糖' | '少糖' | '微糖' | '無糖';

export type MealCategory = 'set' | 'single' | 'drink' | 'custom';

export interface Topping {
  name: string;
  upcharge: number;
}

/** One selectable option inside a set's group (e.g. 主餐 → 炙燒牛排). */
export interface SetChoice {
  name: string;
  upcharge: number;
  /** 飲料 choices carry their own ice/sugar sub-form. */
  isDrink?: boolean;
}

/** A quota-based group inside an editable set (e.g. "主餐（請選 2 項）"). */
export interface SetGroup {
  id: string;
  label: string;
  /** How many choices the guest must pick. Full → remaining options lock. */
  quota: number;
  required: boolean;
  choices: SetChoice[];
  /** Shown under the header, e.g. 勾選後於下方設定冰塊與甜度 */
  hint?: string;
}

export interface MenuItem {
  id: string;
  category: MealCategory;
  emoji: string;
  name: string;
  price: number;
  description: string;
  /** Second description line — only 套餐 carry it. */
  detail?: string;
  /** Present → the card shows a 自訂套餐 button and opens the set editor. */
  groups?: SetGroup[];
}

/** 客製化料理 → 加購飲品 catalogue entry. */
export interface AddOnDrink {
  id: string;
  name: string;
  group: '養身飲品' | '酒' | '熱飲（壺）' | '冷飲';
  unit: '壺' | '瓶';
  yieldNote: string;
  price: number;
}

export interface DrinkOptions {
  ice: IceLevel | null;
  sugar: SugarLevel | null;
  toppings: string[];
  note: string;
}

export interface SetSelection {
  /** groupId → chosen choice names */
  groups: Record<string, string[]>;
  /** choice name → ice/sugar, for choices flagged isDrink */
  drinks: Record<string, { ice: IceLevel | null; sugar: SugarLevel | null }>;
  note: string;
}

export interface CustomOrder {
  eventType: string | null;
  pricePerTable: number | null;
  privateRoom: '不需要' | '需要' | null;
  drinkAddOn: '現場需求加購' | '需要加購' | null;
  /** addOnDrink id → quantity */
  addOnQty: Record<string, number>;
}

export type CartLineKind = 'set' | 'single' | 'drink' | 'custom';

export interface CartLine {
  /** Stable per-line id — a set edited twice stays the same line. */
  id: string;
  kind: CartLineKind;
  itemId: string;
  name: string;
  unitPrice: number;
  qty: number;
  drink?: DrinkOptions;
  set?: SetSelection;
  custom?: CustomOrder;
}

export type PaymentMethod = '線上支付信用卡' | '匯款' | '線上轉帳';

export interface ContactInfo {
  name: string;
  phone: string;
  request: string;
}
