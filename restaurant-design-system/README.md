# 第28區中餐廳訂位系統 — Design System

深色高質感（黑金）風格的餐廳線上訂位系統設計系統。此資料夾為**獨立專案**，與 repo 根目錄的 `tokens.css` / `tailwind.config.js`（另一個登入介面專案）**互不共用、互不覆蓋**。

- **來源**：Figma — Restaurant Reservation system（node `541-2572`，共 32 個畫面）
- **交付物**：
  - `tokens.json` — W3C Design Tokens（primitive + semantic 雙層），可餵 Style Dictionary
  - `design-system.html` — 視覺化文件頁（色彩／字級／間距／元件規範，可直接開瀏覽器看）
  - `README.md` — 命名規則與元件規範（本檔）
- **範圍**：Design Tokens + 核心元件規範
- **暫不含**：RWD 相關 token（斷點 breakpoints、容器最大寬、版位間距）—— 待 RWD 定案再補。目前設計為固定桌機寬 1550px。

---

## 一、命名規則（交付工程師用）

原則：**短、明確、語意優先**。全小寫 kebab-case。

### 分兩層

| 層級 | 用途 | 命名格式 | 範例 | 使用者 |
|------|------|----------|------|--------|
| **Primitive** 原始層 | 原始調色盤，不帶用途 | `{色相}-{明度階}` | `gold-500`、`cream-50` | 只被 semantic 參照 |
| **Semantic** 語意層 | 依用途命名 | `{類別}-{用途}-{變體}` | `bg-surface`、`text-accent`、`border-active` | **工程師實作只用這層** |

> 規則：畫面上一律使用 semantic token；不要直接寫死 hex，也不要直接用 primitive。改色時只需改 primitive → 全站生效。

### 類別前綴（semantic）

| 前綴 | 意義 | 例 |
|------|------|----|
| `bg-` | 背景/填色 | `bg-base`、`bg-surface`、`bg-input` |
| `text-` | 文字色 | `text-primary`、`text-muted`、`text-accent` |
| `border-` | 邊框/分隔線 | `border-default`、`border-active` |
| `brand-` | 品牌色 | `brand-gold` |
| `status-` | 狀態色（成功/危險/提醒） | `status-success-text` |
| `space-` | 間距 | `space-4`（=16px） |
| `radius-` | 圓角 | `radius-md`（=8px） |
| `shadow-` | 陰影 | `shadow-card` |

### 其他規則
- **間距**：以 4px 為基準的量表，`space-{階}`；`space-4` = 16px。小數階以底線表示（`space-1_5` = 6px）。
- **字體樣式**：整組打包成 `typography.{name}`（含 family/weight/size/lineHeight/letterSpacing），命名依用途（`h1`、`body`、`btn`…），engineer 直接套一個 token 即可，不需各自組合。
- **透明度**：帶 alpha 的顏色在 `tokens.json` 以 8 碼 hex 表示（如 `#C9922A2E` = `rgba(201,146,42,0.18)`），`$description` 附原始 rgba 方便對照。

---

## 二、Design Tokens 一覽

### 色彩 — Primitive
| Token | 值 | 說明 |
|-------|-----|------|
| `gold-500` | `#C9922A` | 品牌主色（金） |
| `gold-400` | `#E4A93C` | 亮金／強調 |
| `cream-50` | `#F5F0E8` | 米白，主要文字 |
| `cream-200` | `#C8BFB0` | 米灰，連結文字 |
| `taupe-400` | `#9A8C7E` | 灰褐，輔助文字 |
| `ink-900` | `#0A0A0A` | 近黑，底色 |
| `ink-950` | `#0A0806` | 暖黑，卡片基底 |
| `white` | `#FFFFFF` | 純白 |
| `green-400 / 500 / 800` | `#4ADE80 / #22C55E / #166534` | 成功狀態 |
| `red-600` | `#C03A2B` | 危險／客滿 |

### 色彩 — Semantic
| 類別 | Token | 值 (rgba) |
|------|-------|-----------|
| 背景 | `bg-base` | `#0A0A0A` |
| | `bg-surface` | `rgba(10,8,6,0.84)` 卡片 |
| | `bg-surface-strong` | `rgba(10,8,6,0.88)` 頁首 |
| | `bg-footer` | `rgba(0,0,0,0.72)` |
| | `bg-subtle` | `rgba(255,255,255,0.05)` |
| | `bg-input` | `rgba(255,255,255,0.06)` |
| | `bg-gold-tint` | `rgba(201,146,42,0.15)` chip |
| | `bg-gold-tint-weak` | `rgba(201,146,42,0.08)` notice |
| 文字 | `text-primary` | `#F5F0E8` |
| | `text-secondary` | `rgba(245,240,232,0.75)` |
| | `text-muted` | `#9A8C7E` |
| | `text-link` | `#C8BFB0` |
| | `text-accent` | `#E4A93C` |
| | `text-strong` | `#FFFFFF` |
| | `text-inverse` | `#0A0A0A`（金按鈕上） |
| | `text-placeholder` | `rgba(245,240,232,0.5)` |
| | `text-on-gold` | `#C9922A`（Ghost 按鈕） |
| 邊框 | `border-default` | `rgba(201,146,42,0.18)` |
| | `border-subtle` | `rgba(201,146,42,0.22)` |
| | `border-strong` | `rgba(201,146,42,0.28)` 卡片 |
| | `border-badge` | `rgba(201,146,42,0.4)` |
| | `border-ghost` | `rgba(201,146,42,0.55)` |
| | `border-active` | `#C9922A` 選中/focus |
| 狀態 | `status-success-text/bg/border` | `#4ADE80` / `rgba(22,101,52,0.18)` / `rgba(34,197,94,0.3)` |
| | `status-danger` | `#C03A2B` |
| | `status-warning-text/bg/border` | `#C9922A` / `rgba(201,146,42,0.08)` / `rgba(201,146,42,0.28)` |
| 漸層 | `gradient-gold` | `linear-gradient(170deg, #C9922A 0%, #E4A93C 60%, #C9922A 100%)` |

### 字級（typography）
| Token | Family | Weight | Size / Line-height | 用途 |
|-------|--------|--------|--------------------|------|
| `display` | Serif | 700 | 32 / 44（字距 0.64） | Hero 餐廳名 |
| `h1` | Serif | 700 | 28 / 36 | 頁面主標 |
| `h2` | Serif | 600 | 18 / 27 | 區塊標題 |
| `h3` | Serif | 600 | 16 / 24 | 卡片標題 |
| `body-lg` | Sans | 500 | 16 / 26 | 大內文 |
| `body` | Sans | 400 | 14 / 21 | 預設內文 |
| `body-sm` | Sans | 400 | 13 / 20 | 小內文/說明 |
| `caption` | Sans | 400 | 12 / 18 | 輔助說明 |
| `overline` | Sans | 900 | 12 / 18（字距 2.4、大寫） | 頁尾英文標語 |
| `label` | Sans | 500 | 14 / 21 | 表單欄位標籤 |
| `btn-lg` | Sans | 600 | 20 / 29 | 大按鈕 |
| `btn` | Sans | 600 | 16 / 23 | 按鈕 |
| `btn-sm` | Sans | 600 | 15 / 22 | 小按鈕 |

字體：標題用 **Noto Serif TC**，介面/內文用 **Noto Sans TC**。

### 間距 / 圓角 / 邊框 / 陰影
- **間距** `space-*`：0, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 56, 64（px）
- **圓角** `radius-*`：`xs`=2、`sm`=6、`md`=8、`lg`=12、`full`=9999
- **邊框寬** `borderWidth-*`：1、2
- **陰影** `shadow-*`：`card`=0 8 48 rgba(0,0,0,.6)、`md`=0 4 32 rgba(0,0,0,.5)、`sm`=0 4 24 rgba(0,0,0,.5)

---

## 三、核心元件規範

所有元件皆為**深色底**設計。以下數值皆對應 semantic token。

### Button（按鈕）
| 變體 | 底 | 文字 | 邊框 | 圓角 | 內距 | 字級 |
|------|----|------|------|------|------|------|
| **Primary（GoldButton）** | `gradient-gold` | `text-inverse` | 無 | `radius-md` | `space-5` / `space-4`（20/16） | `btn` / `btn-lg` |
| **Ghost（次要）** | 透明 | `text-on-gold` | `border-ghost` 1px | `radius-md` | 同上 | `btn`/`btn-lg` |
| **Outline（第三）** | 透明 | `text-primary` | `border-default` 1px | `radius-md` | `space-4` | `btn-sm` |
| **Back（返回）** | 透明 | `text-primary` | 無 | `radius-sm` | `space-2`/`space-1`（8/4）| `btn`；左側 ChevLeft 20px |

### Input / Textarea / Phone（輸入元件）
- 底 `bg-input`、邊框 `border-default` 1px、圓角 `radius-md`
- 高度 48px（單行）、Textarea 最小高 112px；內距 左右 15px
- placeholder 用 `text-placeholder`、輸入值 `text-primary`、`body`
- 上方 `Label`：`label` 樣式、`text-primary`；必填標記「＊」；下方 helper 用 `caption` + `text-muted`
- （建議）focus：邊框改 `border-active`

### Card / Panel（卡片）
- 底 `bg-surface`、邊框 `border-strong` 1px、圓角 `radius-lg`、陰影 `shadow-md`（Hero 主卡用 `shadow-card`）
- 內距 24px（`space-6`）

### Badge / Chip（標籤，如「步驟 3/3」「訂位模式」）
- 底 `bg-gold-tint`、邊框 `border-badge` 1px、圓角 `radius-sm`
- 內距 11 / 6、文字 `caption` + `text-accent`

### Divider（分隔線）
- 1px、色 `border-default`

### Stepper（人數加減）
- 外框：`bg-subtle`、`border-default` 1px、`radius-md`、內距 5px
- +/- 按鈕：40×40、`bg-input`、`radius-sm`、符號 `text-primary` 20px/Light
- 數值：`text-primary` 16px/SemiBold；停用態 `opacity: 0.3`

### TimeSlot / 選項按鈕（時段、選擇）
- 未選：`bg-subtle`、`border-default` 1px、`radius-md`、文字 `text-primary`/`body`(Medium)
- 已選：`gradient-gold` 底、`border-active` 1px、文字 `text-inverse`/`body`(Bold)
- 內距：上下 10px

### Header / Footer
- Header：底 `bg-surface-strong`、下邊框 `border-subtle`、內距 40/20
- Footer：底 `bg-footer`、上邊框 `border-subtle`、內距 64/20；連結 `text-link`、英文標語 `overline` + `text-strong`

### Notice / Alert（提示框）
| 類型 | 底 | 邊框 | 圖示/文字 |
|------|----|------|-----------|
| 提醒 warning | `status-warning-bg` | `status-warning-border` | `status-warning-text` ⚠ |
| 成功 success | `status-success-bg` | `status-success-border` | `status-success-text` |
- 圓角 `radius-md`、內距 17 / 15、說明文字 `body-sm` + `text-muted`

### 狀態圖示圓框（如客滿頁 ⟳）
- 68×68、`radius-full`、底 `rgba(201,146,42,0.14)`、邊框 `border-active` 2px、符號 `text-accent`

---

## 四、給工程師：如何使用

1. **只用 semantic token**（`bg-*`、`text-*`…），不要直接寫 hex 或用 primitive。
2. `tokens.json` 為單一真實來源（W3C DTCG）。可用 [Style Dictionary](https://styledictionary.com) 轉出 CSS variables / SCSS / JS / iOS / Android。
   ```bash
   npx style-dictionary build   # 以自訂 config 指向 tokens.json
   ```
3. 字級請整組套 `typography.{name}`，勿各自拼 size/weight。
4. RWD：目前 token 僅涵蓋與版位無關的視覺基礎；斷點與容器寬待 RWD 定案後再新增 `breakpoint-*` / `container-*` 類別。
