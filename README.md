# 第28區中餐廳 · 線上訂位系統

Figma 設計「[Restaurant Reservation system](https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip/Rastaurant-Reservation-system?node-id=541-2572)」
的 **核心訂位流程** 前端實作，可直接在 Visual Studio Code 中執行與測試。

技術棧：**Vite + React 18 + TypeScript + Tailwind CSS + React Router**。

## 已實作畫面（核心訂位流程）

| 路由 | 畫面 | Figma 節點 |
| --- | --- | --- |
| `/` | 首頁 / 訂位入口 | `492:3` |
| `/reservation` | 選擇日期、時段、人數 | `492:83` |
| `/meal` | 選擇餐點（套餐 / 單品 / 飲品 / 客製化） | `492:3136` |
| `/contact` | 填寫聯絡資料 | `500:5576` |
| `/success` | 訂位成立 | `512:5931` |
| `/search` | 訂位查詢（免登入） | `504:6317` |

整個流程是 **可互動的**：人數、日期、時段、餐點、聯絡資料都會透過 React Context
即時同步到「訂位摘要」，並在最後產生訂位編號與訂金金額。

## 在 VS Code 執行

```bash
npm install      # 安裝相依套件
npm run dev      # 啟動開發伺服器 → http://localhost:5173
```

其他指令：

```bash
npm run build    # TypeScript 型別檢查 + production 打包
npm run preview  # 預覽打包結果
npm run lint     # 只做型別檢查 (tsc --noEmit)
```

> **VS Code 提示**：安裝 *ESLint*、*Tailwind CSS IntelliSense* 擴充套件可獲得最佳體驗。
> 用 `F5` 或內建終端機執行 `npm run dev` 即可。

## 設計對照與取捨

- **主題 / Design tokens**：本設計採用獨立的深色 + 金色主題（`#0A0A0A` 底、
  `#C9922A`/`#E4A93C` 金、米色文字）。相關 token 定義於
  [`tailwind.config.js`](./tailwind.config.js)。
  > 註：repo 內既有的 `tokens.css` 是另一份「登入介面」設計的 token，與本餐廳設計無關，予以保留但未使用。
- **圖示**：Figma 的圖示資產放在 Figma CDN，本建置環境無法下載，因此
  [`src/components/icons.tsx`](./src/components/icons.tsx) 以手繪的 inline SVG
  重現相同的線條風格（時鐘、電話、箭頭、加減、勾選等）。
- **主視覺照片**：首頁 / Banner 的餐廳照片同樣無法從 Figma 取得，改以貼近設計氛圍的
  漸層背景（`.hero-backdrop`）替代。若日後拿到原圖，替換 `src/components/Layout.tsx`
  與 Banner 區塊即可。
- **金流 / 通知**：付款、LINE/簡訊通知為設計稿示意，本原型未串接後端。

## 專案結構

```
src/
  main.tsx                 進入點（BrowserRouter）
  App.tsx                  路由設定
  index.css                Tailwind 與全域樣式
  state/BookingContext.tsx 訂位流程共用狀態
  data/menu.ts             菜單資料（套餐/單品/飲品/客製化）
  components/
    Layout.tsx  Footer.tsx  TopBar.tsx
    ui.tsx      OrderSummary.tsx  icons.tsx
  pages/
    Home.tsx  Reservation.tsx  Meal.tsx
    Contact.tsx  BookingSuccess.tsx  Search.tsx
```

## 尚未實作的畫面

原始 Figma 檔約有 30 個畫面。本次聚焦核心訂位流程；其餘（改期、取消訂單、候補名單、
多種付款方式：信用卡 / 銀行 / 網銀、各式成功狀態等）可依相同模式接續補上。
