/**
 * The screen registry: one entry per Figma frame in the
 * "Rastaurant Reservation system" section `28 section v2` (node 668:1064).
 *
 * The index page renders straight from this list, and App.tsx builds the
 * routes from it, so a screen can never exist in one place but not the other.
 */
import type { ReactElement } from 'react';
import Contact from './pages/Contact';
import Order, { type EditorPreset } from './pages/Order';
import Payment from './pages/Payment';
import ProposalA from './pages/ProposalA';
import Reserve from './pages/Reserve';
import Search from './pages/Search';
import {
  BookingFull,
  BookingSuccess,
  CancelConfirm,
  CancelDone,
  PaySuccess,
  RescheduleDone,
  WaitlistJoined,
  WaitlistReleased,
} from './pages/Status';

export type ScreenGroup =
  | '① 訂位與改期'
  | '② 選擇餐點'
  | '③ 聯絡資訊'
  | '④ 訂位結果'
  | '⑤ 訂金付款'
  | '⑥ 取消訂位'
  | '⑦ 訂位查詢'
  | '⑧ 設計提案';

export type ScreenDef = {
  path: string;
  /** Figma frame name, kept verbatim so screens can be diffed against the file. */
  figma: string;
  /** Figma node id, for jumping back to the design. */
  node: string;
  title: string;
  note: string;
  group: ScreenGroup;
  element: ReactElement;
};

/**
 * `choose-set/open` captures the 雙人分享套餐 editor with every group already
 * full and two upgrades picked (鮮榨柳橙汁 +$40、提拉米蘇 +$60 = 內容加價 $100),
 * which is what makes that frame's subtotal $2,160 instead of $2,060.
 */
const SET_OPEN_PRESET: EditorPreset = {
  selections: {
    main: ['steak', 'salmon'],
    side: ['mushroom', 'caesar'],
    drink: ['blacktea', 'orange'],
    dessert: ['pudding', 'tiramisu'],
  },
  drinkPrefs: {
    blacktea: { ice: '少冰', sugar: '半糖', toppings: [] },
    orange: { ice: '去冰', sugar: '無糖', toppings: [] },
  },
};

export const SCREENS: ScreenDef[] = [
  /* ── ① 訂位與改期 ─────────────────────────────────────────────────────── */
  {
    path: '/',
    figma: 'Restaurant/reservation-v2',
    node: '779:2572',
    title: '訂位首頁',
    note: '人數 ‧ 日曆 ‧ 時段，已選 8/8 18:00',
    group: '① 訂位與改期',
    element: <Reserve />,
  },
  {
    path: '/reserve-empty',
    figma: 'Restaurant/reservation-v2/empty',
    node: '788:992',
    title: '訂位首頁 — 未選擇',
    note: '尚未選日期時段，下一步為停用狀態',
    group: '① 訂位與改期',
    element: <Reserve empty />,
  },
  {
    path: '/reschedule',
    figma: 'Restaurant/reschedule/success-wait to pay',
    node: '778:450',
    title: '改期 — 未付款',
    note: '同訂位介面，底部改為儲存變更／取消',
    group: '① 訂位與改期',
    element: <Reserve mode="reschedule" />,
  },
  {
    path: '/reschedule-paid',
    figma: 'Restaurant/reschedule/success-paid',
    node: '778:722',
    title: '改期 — 已付款',
    note: '已付訂金的訂位改期',
    group: '① 訂位與改期',
    element: <Reserve mode="reschedule" paid />,
  },

  /* ── ② 選擇餐點 ───────────────────────────────────────────────────────── */
  {
    path: '/order',
    figma: 'Restaurant/choose-set/default',
    node: '668:2179',
    title: '選擇餐點 — 套餐',
    note: '6 款套餐，右欄已選 2 項',
    group: '② 選擇餐點',
    element: <Order />,
  },
  {
    path: '/order-empty',
    figma: 'Restaurant/choose-set/empty',
    node: '743:3789',
    title: '選擇餐點 — 空購物車',
    note: '尚未加入任何餐點',
    group: '② 選擇餐點',
    element: <Order empty />,
  },
  {
    path: '/order-set-open',
    figma: 'Restaurant/choose-set/open',
    node: '668:2551',
    title: '套餐內容編輯',
    note: '主餐／附餐／飲料／甜點勾選 + 冰塊甜度',
    group: '② 選擇餐點',
    element: <Order openEditor="set-duo" preset={SET_OPEN_PRESET} />,
  },
  {
    path: '/order-single',
    figma: 'Restaurant/choose-meal',
    node: '668:2398',
    title: '選擇餐點 — 單品',
    note: '3 款單點主餐',
    group: '② 選擇餐點',
    element: <Order initialCategory="single" />,
  },
  {
    path: '/order-drink',
    figma: 'Restaurant/choose-drink/default',
    node: '668:2959',
    title: '選擇餐點 — 飲品',
    note: '6 款飲品，每項可客製化',
    group: '② 選擇餐點',
    element: <Order initialCategory="drink" />,
  },
  {
    path: '/order-drink-open',
    figma: 'Restaurant/choose-drink/open',
    node: '668:3166',
    title: '飲品客製化 — 1 杯',
    note: '冰塊／甜度單選、加料複選',
    group: '② 選擇餐點',
    element: <Order initialCategory="drink" openDrink="drink-orange" />,
  },
  {
    path: '/order-drink-2cups',
    figma: 'Restaurant/choose-drink/open-2cups',
    node: '728:2572',
    title: '飲品客製化 — 2 杯',
    note: '每杯各自設定冰塊與甜度',
    group: '② 選擇餐點',
    element: <Order initialCategory="drink" openDrink="drink-blacktea" />,
  },
  {
    path: '/order-custom',
    figma: 'Restaurant/custom/default',
    node: '668:3754',
    title: '客製化料理',
    note: '活動類型 ‧ 整桌預算 ‧ 包廂 ‧ 加購飲品',
    group: '② 選擇餐點',
    element: <Order initialCategory="custom" />,
  },
  {
    path: '/order-custom-drink',
    figma: 'Restaurant/custom/add drink',
    node: '668:3458',
    title: '客製化料理 — 加購飲品',
    note: '養身飲品／酒／熱飲／冷飲分組複選',
    group: '② 選擇餐點',
    element: <Order initialCategory="custom" />,
  },

  /* ── ③ 聯絡資訊 ───────────────────────────────────────────────────────── */
  {
    path: '/contact',
    figma: 'Restaurant/contact info',
    node: '668:3955',
    title: '填寫聯絡資訊',
    note: '姓名／手機必填，右欄訂位摘要含餐點',
    group: '③ 聯絡資訊',
    element: <Contact />,
  },
  {
    path: '/contact-coffee',
    figma: 'Restaurant/contact info/ for coffee',
    node: '714:327',
    title: '聯絡資訊 — 咖啡廳',
    note: '無餐點，摘要改列訂位人資料',
    group: '③ 聯絡資訊',
    element: <Contact variant="coffee" />,
  },
  {
    path: '/contact-closed',
    figma: 'Restaurant/contact info/noworking',
    node: '668:4062',
    title: '聯絡資訊 — 公休日',
    note: '所選日期為公休，送出鍵停用',
    group: '③ 聯絡資訊',
    element: <Contact variant="noworking" />,
  },
  {
    path: '/contact-custom',
    figma: 'Restaurant/contact info/custom',
    node: '668:4170',
    title: '聯絡資訊 — 客製化',
    note: '摘要列出客製化點餐設定',
    group: '③ 聯絡資訊',
    element: <Contact variant="custom" />,
  },

  /* ── ④ 訂位結果 ───────────────────────────────────────────────────────── */
  {
    path: '/booking-success',
    figma: 'Restaurant/booking success',
    node: '668:4365',
    title: '訂位成立',
    note: '待付訂金，含付款期限提示',
    group: '④ 訂位結果',
    element: <BookingSuccess />,
  },
  {
    path: '/booking-full',
    figma: 'Restaurant/booking/full',
    node: '668:4458',
    title: '時段已滿 — 自動配對中',
    note: '轉人工或加入候補',
    group: '④ 訂位結果',
    element: <BookingFull />,
  },
  {
    path: '/waitlist',
    figma: 'Restaurant/booking/add 候補名單',
    node: '668:4509',
    title: '已加入候補名單',
    note: '候補順位第 3 位',
    group: '④ 訂位結果',
    element: <WaitlistJoined />,
  },
  {
    path: '/waitlist-released',
    figma: 'Restaurant/booking/候補釋出通知',
    node: '668:4559',
    title: '候補釋出通知',
    note: '座位釋出，限時完成付款',
    group: '④ 訂位結果',
    element: <WaitlistReleased />,
  },
  {
    path: '/reschedule-done',
    figma: 'Restaurant/reschedule/success-wait to pay/success',
    node: '668:4273',
    title: '修改訂位成功 — 未付款',
    note: '改期後仍待付訂金',
    group: '④ 訂位結果',
    element: <RescheduleDone />,
  },
  {
    path: '/reschedule-paid-done',
    figma: 'Restaurant/reschedule/success-paid',
    node: '668:4652',
    title: '修改訂位成功 — 已付款',
    note: '訂金已付，改期完成',
    group: '④ 訂位結果',
    element: <RescheduleDone paid />,
  },

  /* ── ⑤ 訂金付款 ───────────────────────────────────────────────────────── */
  {
    path: '/payment',
    figma: 'Restaurant/booking success/ credit card',
    node: '668:5110',
    title: '支付訂金 — 信用卡',
    note: '卡號／效期／CVV，含訂金規則',
    group: '⑤ 訂金付款',
    element: <Payment initialMethod="card" />,
  },
  {
    path: '/payment-bank',
    figma: 'Restaurant/booking success/ bank',
    node: '668:5456',
    title: '支付訂金 — 匯款',
    note: '收款帳戶與後五碼對帳',
    group: '⑤ 訂金付款',
    element: <Payment initialMethod="bank" />,
  },
  {
    path: '/payment-online',
    figma: 'Restaurant/booking success/ on line bank',
    node: '668:5574',
    title: '支付訂金 — 線上轉帳',
    note: '導向網銀完成轉帳',
    group: '⑤ 訂金付款',
    element: <Payment initialMethod="online" />,
  },
  {
    path: '/pay-success',
    figma: 'Restaurant/ pay-success',
    node: '668:5692',
    title: '訂金支付成功',
    note: '含通知訊息與訂金狀態',
    group: '⑤ 訂金付款',
    element: <PaySuccess />,
  },

  /* ── ⑥ 取消訂位 ───────────────────────────────────────────────────────── */
  {
    path: '/cancel',
    figma: 'Restaurant/success-wait to pay/cancel-order',
    node: '668:4844',
    title: '取消確認 — 未付款',
    note: '二次確認，不可復原',
    group: '⑥ 取消訂位',
    element: <CancelConfirm />,
  },
  {
    path: '/cancel-paid',
    figma: 'Restaurant/success-paid/cancel-order',
    node: '668:4744',
    title: '取消確認 — 已付款',
    note: '附退款規則說明',
    group: '⑥ 取消訂位',
    element: <CancelConfirm paid />,
  },
  {
    path: '/cancel-done',
    figma: 'Restaurant/cancel-order/success-wait to pay/cancel-order/success',
    node: '668:4937',
    title: '訂位已取消 — 未付款',
    note: '訂位狀態轉為已取消',
    group: '⑥ 取消訂位',
    element: <CancelDone />,
  },
  {
    path: '/cancel-paid-done',
    figma: 'Restaurant/cancel-order/success-wait to pay/cancel-order/success',
    node: '668:5021',
    title: '訂位已取消 — 已付款',
    note: '訂金依退款規則處理',
    group: '⑥ 取消訂位',
    element: <CancelDone paid />,
  },

  /* ── ⑦ 訂位查詢 ───────────────────────────────────────────────────────── */
  {
    path: '/search',
    figma: 'Restaurant/ search reservation',
    node: '668:5213',
    title: '查詢我的訂位',
    note: '訂位編號或手機號碼查詢',
    group: '⑦ 訂位查詢',
    element: <Search />,
  },
  {
    path: '/search-unpaid',
    figma: 'Restaurant/ search-reservation/success-wait to pay',
    node: '668:5260',
    title: '查詢結果 — 未付款',
    note: '可前往付款或取消',
    group: '⑦ 訂位查詢',
    element: <Search result="unpaid" />,
  },
  {
    path: '/search-paid',
    figma: 'Restaurant/ search-reservation/success-paid',
    node: '668:5359',
    title: '查詢結果 — 已付款',
    note: '訂金已付，可改期或取消',
    group: '⑦ 訂位查詢',
    element: <Search result="paid" />,
  },

  /* ── ⑧ 設計提案 ───────────────────────────────────────────────────────── */
  {
    path: '/proposal-a',
    figma: 'A 案改良 — 拿掉重複資訊與多餘控制項',
    node: '755:2572',
    title: 'A 案改良對照',
    note: 'A′ 收合 vs A″ 不收合的已選餐點卡',
    group: '⑧ 設計提案',
    element: <ProposalA />,
  },
];

export const GROUPS = [...new Set(SCREENS.map((s) => s.group))];

export const FIGMA_FILE = 'https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip/Rastaurant-Reservation-system';

export function figmaLink(node: string) {
  return `${FIGMA_FILE}?node-id=${node.replace(':', '-')}`;
}
