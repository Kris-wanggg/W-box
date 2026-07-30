# 第28區中餐廳 — 線上訂位互動原型

從 Figma 設計稿實作的可點擊互動原型（核心訂位 + 付款流程）。

**設計來源**：[Rastaurant Reservation system](https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip/Rastaurant-Reservation-system?node-id=668-1064)
（file `f27j5bQ9NnxC6aiUPxt5Ip`，section `668:1064`）

## 快速開始

```bash
npm install
npm run dev
```

開啟 http://localhost:5173

其他指令：`npm run build`（型別檢查 + 打包）、`npm run typecheck`、`npm run preview`。

## 流程與畫面對應

| 路由 | 畫面 | Figma frame |
|---|---|---|
| `/` | 訂位查詢（人數 / 日期 / 時段）步驟 1 / 3 | `reservation-v2` `779:2572`、`/empty` `788:992` |
| `/meals` | 選擇餐點（套餐 / 單品 / 飲品 / 客製化）步驟 2 / 3 | `choose-set` `668:2179`、`choose-set/open` `668:2551`、`choose-meal` `668:2398`、`choose-drink` `668:2959`、`choose-drink/open` `668:3166`、`custom/default` `668:3754`、`custom/add drink` `668:3458` |
| `/contact` | 聯絡資料 步驟 3 / 3 | `contact info` `668:3955` |
| `/success` | 訂位成立（待付訂金） | `booking success` `668:4365` |
| `/payment` | 支付訂金（信用卡 / 匯款 / 線上轉帳） | `booking success/ credit card` `668:5110`、`/ bank` `668:5456`、`/ on line bank` `668:5574` |
| `/pay-success` | 訂金支付成功 | `pay-success` `668:5692` |

四個 Figma 分類畫面（choose-set / choose-meal / choose-drink / custom）在實作上收斂為 `/meals`
一頁四個分類 tab，因為設計稿裡它們共用同一個 Meal Picker Card 與 Order Summary Card。

## 實作了哪些互動

- **人數**：成人 1–8、小孩 0–8；超過 8 人顯示改撥電話的提示。
- **日曆**：每週一公休（劃線停用）、過去日期停用、跨月切換、上個月不可回到今天之前。
- **時段**：早餐 / 午餐 / 晚餐三組；個別時段可標記為已滿；整日售完時 CTA 換成「時段已滿，是否登記候補流程？」。
- **套餐編輯器**（`choose-set/open` 的核心）：每個組別有指定份數，達額後其餘選項會鎖住而不是靜默替換；被勾選的飲料各自展開冰塊 / 甜度；即時計算「套餐 + 內容加價」。必選未完成時「更新套餐內容」保持 disabled。
- **飲品客製化**：冰塊 / 甜度為必選單選，加料可複選並加價，其他需求 0/50 字數計數。
- **客製化料理**：活動類型、桌菜價位、包廂、加購飲品；加購區有分類 tab 與「已選 N 項 ‧ 共 M 件 / 加購小計」。訂單摘要即時顯示「客製化點餐（進行中）」，可一鍵清除設定。
- **表單驗證**：姓名必填、手機須為 09 開頭 10 碼；信用卡需卡號 16 碼 + 效期 + CVV + 持卡人；匯款 / 轉帳需帳號末 5 碼。
- **訂金**：每位 $300（設計稿的 2 位 → $600 即由此得出）。付款期限為用餐日前一天 23:59。
- **訂位編號**：`#A` + `yyyymmdd` + 3 碼流水號，對齊設計稿的 `#A20260808-018`。

每個可互動元素都有 hover / active / focus-visible / disabled 樣式；版面使用語意標籤
（`<header>` `<main>` `<nav>` `<footer>` `<fieldset>` `<legend>` `<dl>`），並在 375px 起無橫向溢出。

## 設計 token

顏色、圓角、字級全部走 `tailwind.config.js` → CSS 變數（`tokens.css`），元件內不寫死 `#HEX`。

- 品牌色 `--color-brand: #735C00` 取自本 Figma 檔的變數；`-hover` / `-active` / `-tint` 等階層為推導值，已在 `tokens.css` 註明。
- 其餘語意色（background / surface / border / text-* / status-*）沿用 `tokens.css` 既有的 token。
- 新增 `r-h1` / `r-h2` / `r-body` / `r-label` / `r-note` / `r-button` 字級，帶真實 line-height（原有的 preset 皆為 `lineHeight: 1`，中文多行會黏在一起）。

## 資料層

**純前端假資料，沒有後端、沒有資料庫。** 狀態存在 React Context
（`src/store/BookingContext.tsx`），重新整理即歸零。菜單與供應狀況在
`src/data/menu.ts` 與 `src/data/availability.ts`。

## 與設計稿的差異

- **飲品說明文字**：設計稿的 6 個飲品說明都還是未填的 placeholder（`Meal Description`），
  這裡先補上暫代文案，見 `src/data/menu.ts` 的註解。
- **Hero 輪播**：設計稿的 `Hero Carousel` 只有一張 slide、沒有輪播互動規格，
  這裡以單張漸層底 + 靜態指示點代替，尚未接圖片與自動輪播。
- **TimeSlots 內容**：`[Comp] TimeSlots` 在設計稿中是未展開的 component instance，
  無法讀到內部時段清單，時段表為合理推定值。
- **桌菜價位**：設計稿此處標籤仍是 placeholder（`Pricing Note`），依下方說明文字
  「可選：6,800／8,800／10,800／13,800／15,000 以上」命名為「桌菜價位」。
- **訂金法規說明**：設計稿該行文字被 550px 寬度截斷，這裡補完句尾。

## 尚未實作（第二階段）

設計稿另有約 20 個畫面不在本次範圍內：查詢訂位、改期、取消訂單、候補名單登記、
候補釋出通知、訂位已滿等變體。`/success` 上的「取消訂位」目前只是清空狀態回首頁。
