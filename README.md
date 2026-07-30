# 餐廳訂位系統 — 前端測試

把 Figma 設計稿
[Rastaurant Reservation system](https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip/Rastaurant-Reservation-system?node-id=668-1064)
的 section「28 section v2」實作成可在瀏覽器操作的前端，供跨裝置測試。

## 測試網址

部署在 GitHub Pages：**https://kris-wanggg.github.io/w-box/**

> ⚠️ 首次部署需要在 repo 的 **Settings → Pages → Build and deployment → Source**
> 選擇 **GitHub Actions**。設定完成後，每次推送到
> `claude/restaurant-reservation-frontend-test-fscqe9` 或 `main` 都會自動重新部署。

進站後會看到「全部畫面」索引頁，列出 35 個畫面並附上對應的 Figma 連結；
任一畫面右下角都有「全部畫面」浮動按鈕可以跳回索引。

## 本機執行

```bash
npm install
npm run dev        # http://localhost:5173/w-box/
npm run build      # 產生 dist/
npm run preview    # 預覽 production build
npm run typecheck
```

## 涵蓋的 35 個畫面

| 分組 | 畫面 |
| --- | --- |
| ① 訂位與改期 | 訂位首頁、未選擇狀態、改期（未付款／已付款） |
| ② 選擇餐點 | 套餐、空購物車、套餐內容編輯、單品、飲品、飲品客製化（1 杯／2 杯）、客製化料理、客製化加購飲品 |
| ③ 聯絡資訊 | 一般、咖啡廳、公休日、客製化 |
| ④ 訂位結果 | 訂位成立、時段已滿、加入候補、候補釋出、修改成功（未付款／已付款） |
| ⑤ 訂金付款 | 信用卡、匯款、線上轉帳、支付成功 |
| ⑥ 取消訂位 | 取消確認（未付款／已付款）、已取消（未付款／已付款） |
| ⑦ 訂位查詢 | 查詢表單、查詢結果（未付款／已付款） |
| ⑧ 設計提案 | A 案改良對照（A′ 收合 vs A″ 不收合） |

## 可點擊的主流程

```
訂位首頁 → 選擇餐點 → 填寫聯絡資訊 → 訂位成立 → 支付訂金 → 訂金支付成功
```

流程中的人數、日期時段、餐點與聯絡資料都存在共用的 `BookingProvider`，
所以後面每一頁顯示的金額與摘要，都會跟著前面實際選的內容走，而不是寫死的假資料。
狀態頁（候補、取消、查詢結果…）讀的是同一份狀態。

## 技術棧

- React 19 + TypeScript + Vite 7
- Tailwind CSS 3（`tailwind.config.js`，不使用內聯 CSS）
- React Router 7（`HashRouter`，讓 GitHub Pages 不需要 rewrite 規則就能深連結）

## 設計 token 對應

`tailwind.config.js` 的 Restaurant 色階全部來自設計檔，分兩個來源：

**一、`Restaurant/*` 變數集合**

| Figma 變數 | 值 | Tailwind |
| --- | --- | --- |
| `bg/brand`、`border/active`、`text/accent` | `#735C00` | `brand` |
| `text/primary` / `secondary` / `tertiary` | `#1B1C1C` / `#6E6252` / `#4D4635` | `ink` / `ink-secondary` / `ink-tertiary` |
| `border/default`、`bg/divider` | `#D0C5AF` | `line` |
| `border/subtle` / `faint` | `#D0C5AF` @35% / @20% | `line-subtle` / `line-faint` |
| `bg/veil` / `surface` / `footer` / `subtle` | `#FBF9F9`@70% / `#FFF`@84% / @72% / @5% | `veil` / `card` / `footerbg` / `subtle` |
| `bg/muted` | `#EFEDED` | `muted` |

字級同樣對應變數集合：`h2` `h2-loose` `h3` `h4` `h4-strong` `h5` `body-lg` `body`
`body-sm` `label` `label-sm` `label-xs` `cap` `overline` `btn`。

**二、元件有定義、但變數集合未發佈的值**（每一個都在設定檔註明出處元件）

| 來源元件 | 值 | Tailwind |
| --- | --- | --- |
| `[Comp] Radio` / `Checkbox` 選中態 | `#C9922A` | `selected` |
| `[Comp] Button (確認取消訂位)` | `#C21400` | `destructive` |
| pay-success 的「成功」 | `#007722` | `ok` |
| `[Comp] Tag` 三態底色與框線 | rgba × 6 | `tag-*` |
| `[Comp] Checkbox` 額滿鎖定態 | rgba × 4 | `off-*` |
| `[Comp] TimeSlots` 不可選時段 | rgba × 2 | `unavailable-*` |

原本 `tokens.css` 那組登入介面的語意 token 保留未動，兩組並存。

## 按鈕尺寸

`[Comp] Button` 在設計稿裡被放在四種高度上，而每種高度各自搭配固定的字級與左右
留白，所以 `<Button>` 的 `size` 直接對應這四階：

| `size` | 高度 | 字級 | 用在哪裡（節點） |
| --- | --- | --- | --- |
| `cta` | 48px | 16px | 頁面層級主動作：下一步：選擇餐點 (835:663)、`Action Buttons` 成對按鈕 (835:493 / 822:555)、立即付款 (839:1504)、立即查詢 (822:479)、完成 (835:527) |
| `md`（預設） | 44px | 16px（`quiet` 13px） | 卡片內的動作：下一步：填寫聯絡資訊 (835:860)、所選時段已滿？查看候補流程 (840:1603)、自訂套餐／客製化 (791:467 / 835:1580) |
| `compact` | 44px | 14/21 | 成對的編輯列與訂位查詢結果列：更新套餐內容 (835:1173)、取消 (835:1184)、取消訂位 (822:513) |
| `mini` | 28px | 12/18，圓角 6px | 內嵌小鈕：修改訂位 (839:1413)、清除設定 (839:1192) |

28px 這一階的框線與文字顏色也跟著換：修改訂位是 `border/active` 配主文字色，
清除設定是 `border/default` 配次文字色、無底色。活動類型 chip（謝師宴等，
835:2253 / 835:2256）是 36px 的單選色系，與 Radio／Checkbox 共用 `#C9922A`
選取框。

**互動狀態**：Figma 沒有定義 hover／focus。這些狀態只從設計稿既有的顏色推導
（hover 借用 `selected` 的框線、focus ring 借用 `brand`），不引入任何新色相。

## 已知落差

- **Hero 照片**：`reservation-v2` 的首圖是 Figma 上的照片。建置環境的網路政策擋掉
  `www.figma.com`（`403 CONNECT`），無法下載資產，目前以同色系漸層替代；資產可取得時
  換掉 `src/pages/Reserve.tsx` 裡的那個 `div` 即可。
- **圖示**：Figma 圖層名稱是 Lucide 標準圖示（`trash-2`／`plus`／`minus`／
  `chevron-down`／`chevron-left`），且 inset 百分比與 Lucide 幾何吻合，因此在
  `src/components/icons.tsx` 以 inline SVG 依同一組幾何重繪，沒有外連資源。
- **`Search Form Card` 的固定高度**：`668:5215` 被設成 `h-449.828`，比內容多出約
  36px 的空白（推測是拉框後留下的）。前端讓卡片依內容收合，沒有複製這個高度。
- **結果頁的警告框文字**：`822:507`／`822:527` 兩個 `[Comp] Field` 都還是元件的
  預設值 `warning info`。未付款沿用檔案裡的付款期限文案，已付款沿用 `822:546`
  的「如需變更…」文案，都是設計檔既有的字，沒有另外編寫。
- **共用狀態**：從索引頁直接跳到某個變體頁時，會沿用上一頁留下的購物車狀態
  （例如先看過「套餐內容編輯」再看別頁，小計會是 $2,160）。這是可點擊原型的預期行為；
  要看乾淨狀態請重新整理頁面。
