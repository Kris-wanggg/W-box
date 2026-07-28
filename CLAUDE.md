# Claude Code 專案設計規範 (UI/UX Designer Profile)

## 🛠 核心技術棧 (Tech Stack)
- 框架: React (Vite) + TypeScript
- 樣式: Tailwind CSS (嚴格不使用原生內聯 CSS)
- 元件庫: 原生自建元件 或 shadcn/ui

## 🎨 設計系統與 Figma MCP 對齊規範
當你透過 Figma MCP 讀取我的設計稿並產生程式碼時，請務必遵守以下「像素級」對齊規則：

1. **色彩 Token 映射**:
   - 只要在 Figma 看到 `#3B82F6` 或 `Primary-500`，程式碼一律使用 Tailwind 的 `text-blue-500` 或 `bg-blue-500`。
   - 嚴禁在程式碼中自行發明 `#HEX` 色碼，必須對齊專案的 `tailwind.config.js`。

2. **間距與排版 (Layout & Spacing)**:
   - 看到 Figma 的 Auto Layout 間距，請自動轉譯為 Tailwind 的 spacing (例如：8px -> `gap-2`, 16px -> `gap-4`, 24px -> `gap-6`)。
   - 所有的卡片與容器必須預設帶有響應式佈局 (`flex flex-col md:flex-row`)。

3. **Figma 圖層名稱「對號入座」**:
   - 如果 Figma 圖層名稱叫做 `[Comp] PrimaryButton` -> 請在程式碼中直接調用 `<Button size="lg" />`。
   - 如果圖層名稱叫做 `[Comp] TopNavbar` -> 請直接 import 專案內的 `<Navbar />` 元件，不要重新手刻。

## 🧪 檢查清單 (Definition of Done)
- 產出的 UI 必須具備豐富的互動狀態（Hover, Active, Focus, Disabled 樣式）。
- 程式碼元件結構必須乾淨，語意化標籤（<nav>, <main>, <header>）必須正確。
