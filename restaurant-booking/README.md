# Restaurant Booking — 前端測試環境

依 Figma「Rastaurant Reservation system」section **28 section v3**
([node 923-1753](https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip/Rastaurant-Reservation-system?node-id=923-1753))
建立的可執行前端，供工程師實際操作與跑測試。

## 指令

```bash
npm install
npm run dev        # 啟動開發伺服器
npm test           # 跑全部測試（Vitest）
npm run test:watch # 監看模式
npm run typecheck  # TypeScript 型別檢查
npm run build      # 產出 production build
```

## 已實作畫面

| Figma Frame | Node ID | 程式碼 |
| --- | --- | --- |
| `Restaurant/reservation-v3` | 923:5151 | `src/screens/ReservationScreen.tsx` |
| `Restaurant/choose-set/empty` | 923:1931 | `src/screens/ChooseSetScreen.tsx` |
| `Restaurant/choose-drink/default` | 923:2482 | `src/screens/ChooseDrinkScreen.tsx` |
| `Restaurant/contact info` | 923:3218 | `src/screens/ContactInfoScreen.tsx` |
| `Restaurant/booking success` | 923:3698 | `src/screens/BookingSuccessScreen.tsx` |
| `Meal Card/*` | 936:4529 等 | `src/components/MealCard.tsx` |
| `Dialog - del prompt` | 740:2573 | `src/components/ui/Dialog.tsx` |
| `Header Bar` / `Shared Footer` | — | `src/components/Navbar.tsx`、`Footer.tsx` |

## 測試分類

- **`design-rules.test.ts`** — 以程式檢查 `CLAUDE.md` 的設計規範：
  禁止硬編碼 `#HEX` 與 `rgb()/hsl()`、禁止內聯 CSS、
  token 需在 `:root` 與 `.dark` 兩模式齊全、
  語意化標籤（`<header>`/`<nav>`/`<main>`/`<footer>`）、
  響應式 `md:` 斷點、互動狀態（hover/active/focus/disabled）。
- **`booking.test.ts`** — 金額計算、日期格式、訂位編號、表單驗證。
- **`screens.test.tsx`** — 各畫面對照 Figma 的文案、狀態與互動。
- **`flow.test.tsx`** — 訂位 → 選套餐 → 選飲品 → 聯絡資料 → 訂位成立的完整流程。

## 設計稿落差備註

實作時發現的兩點，需要設計端確認：

1. **時段與 Figma 不一致** — `reservation-v3` 的時段按鈕只有 08:00–11:00（早餐時段），
   但 `booking success` 的「日期時段」範例是 `08/09（日） 18:00`。
   目前 `src/data/menu.ts` 的 `timeSlots` 忠實照 Figma 只放 08:00–11:00，
   若實際供應晚餐時段需補上。
2. **圖示以文字符號替代** — Figma 匯出的 `Chevron Left/Right`、Hero `Slide` 圖、
   `Vector` 圖示無法在此環境下載（網路政策封鎖 `www.figma.com`），
   目前以 `‹ › ✓ ⚠ 🍽` 等字元暫代，接手時請換回匯出資產。
