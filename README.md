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

Figma 變數與畫面上的實際填色，映射到 `tailwind.config.js` 的 `brand` / `ink` /
`line` / `canvas` 色階：

| Figma | Tailwind |
| --- | --- |
| `Restaurant/bg/brand` `#735C00` | `brand` |
| `Restaurant/text/inverse` `#FFFFFF` | `text-white` |
| 頁面底色 `#FBF9F9` | `canvas` |
| 卡片 `rgba(255,255,255,0.84)` + `0 4px 20px rgba(0,0,0,.05)` | `bg-card shadow-card` |
| 主文字 `#1B1C1C` / 次要 `#6E6252` / 第三層 `#4D4635` | `ink` / `ink-muted` / `ink-soft` |
| 分隔線 `#D0C5AF`（及 35% / 22% 透明度） | `line` / `line-soft` / `line-faint` |

原本 `tokens.css` 那組登入介面的語意 token 保留未動，兩組並存。

## 已知落差

- **Hero 照片**：`reservation-v2` 的首圖是 Figma 上的照片。建置環境的網路政策擋掉
  `www.figma.com`（`403 CONNECT`），無法下載資產，目前以同色系漸層替代；資產可取得時
  換掉 `src/pages/Reserve.tsx` 裡的那個 `div` 即可。
- **圖示**：Figma 圖層名稱是 Lucide 標準圖示（`trash-2`／`plus`／`minus`／
  `chevron-down`／`chevron-left`），且 inset 百分比與 Lucide 幾何吻合，因此在
  `src/components/icons.tsx` 以 inline SVG 依同一組幾何重繪，沒有外連資源。
- **共用狀態**：從索引頁直接跳到某個變體頁時，會沿用上一頁留下的購物車狀態
  （例如先看過「套餐內容編輯」再看別頁，小計會是 $2,160）。這是可點擊原型的預期行為；
  要看乾淨狀態請重新整理頁面。
