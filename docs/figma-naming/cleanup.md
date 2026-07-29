# 結構整理與後續（第二輪）

## 1. 元件還原後的命名補正

`Restaurant/reservation-v2/empty` 的兩個 stepper 已還原為真正的 Component 實例，命名補上：

- `857:1290` → `[Comp] Stepper (Adult)`
- `857:1308` → `[Comp] Stepper (Child)`

四個預約首頁畫面的 stepper 命名現已一致。

## 2. 保守結構整平（已執行）

判定條件（四項全部成立才刪）：

1. 外層無填色、無邊框、無陰影、無圓角、無 clip
2. 內層尺寸與外層完全相同且位於 (0,0) —— 代表兩層之間沒有 padding
3. 兩層名稱語意相同（其中一個只是多了 Label / Content / Container / Inner / Wrap / Text / Box 這類排版字）
4. 位於 34 個 `Restaurant/` 畫面內

**結果：刪除 13 層，3,162 → 3,149。34 個畫面的幾何完全未變（程式逐一比對子層座標與尺寸，0 個變動），並截圖複驗。**

刪除明細：

| 原本 | 保留 | 數量 |
|---|---|---|
| `Party Size › Party Size Content` | `Party Size` | 4 |
| `Field Value › Field Value` | `Field Value` | 3 |
| `Status Text › Status Title` | `Status Title` | 2 |
| `Meal Editor Intro › Meal Editor Intro Text` | `Meal Editor Intro` | 1 |
| `Edit Set Button › Edit Set Label` | `Edit Set Button` | 1 |
| `Matching Status List › Matching Status Label` | `Matching Status Label` | 1 |
| `Waitlist Info List › Waitlist Info Label` | `Waitlist Info Label` | 1 |

### 為什麼只有 13 層

初估「40〜60 層」是錯的。實際掃描 300 個單子層容器後，546 個被判定**不可刪**：

- **外層有填色** —— 卡片背景在外層、內容在內層，刪掉會失去背景（`Reservation Info Card › Reservation Info Content` 等 34 處以上）
- **兩層之間有 padding** —— 內距掛在外層，刪掉會位移（`Main › Content Stack`、`Footer Container › Footer Content` 等）
- **兩層語意不同** —— `Jul 26 › Day Button (Closed)` 是「日期格 / 按鈕」兩件事，`Header Bar › Back Button` 同理，合併會損失狀態命名

結論：這份設計檔的巢狀結構大多是**有作用的**，不是冗餘。

## 3. 識別後綴修正

48 個名字的括號後綴原本抓到 emoji 或符號，已改為抓第一個有意義的文字：

- `Meal Card (🍽)` → `Meal Card (雙人分享套餐)` / `(商業午餐套餐)` / `(四人家庭套餐)` …
- `Meal Card (🥩)` → `Meal Card (炙燒和牛)` / `(香煎鮭魚佐時蔬)`
- `Selection Details (＊)`、`[Comp] Checkbox (✓)`、`Drink Option (✓)` 同樣改為實際選項名稱

同層重複命名：**0**。

## 4. Header / Footer 元件化步驟（請你自己在 Figma 執行）

1. 任選一個畫面，選取 `Header`，右鍵 → **Create component**（⌥⌘K）。命名 `Header`
2. 同一畫面選取 `Shared Footer`，同樣建立元件，命名 `Shared Footer`
3. 把兩個元件拖到 Assets 面板的 Local components，或移到專門的元件頁
4. 逐一到其餘 33 個畫面：選取該畫面的 `Header` → 刪除 → 從 Assets 拖入 `Header` 實例 → 確認 auto layout 位置正確（應為 Main 之前、寬度 fill）
5. `Shared Footer` 重複步驟 4
6. **返回鍵文字要改成 variant 或 text property**，因為每個畫面的返回目的地不同（見下方第 5 點）

建議先做 Footer —— 34 個畫面的頁尾內容完全相同，沒有例外，風險最低。Header 因為返回文字不同，需要先決定用 text property 還是 variant。

## 5. 仍待你決定的兩件事

**a. 返回鍵文案不一致（設計問題，非命名問題）**

多個畫面的返回鍵文字與流程對不上，例如標題「訂位成立」的畫面顯示「選擇餐點」、`choose-set/default` 顯示「選擇日期」。這會影響 Header 元件化時 text property 的預設值，建議先校對。

**b. `A 案改良 — 拿掉重複資訊與多餘控制項` 比稿板未整理**

`28 section v2` 內除了 34 個 `Restaurant/` 畫面，還有一個比稿用的探索板，圖層仍是 `Stack` / `Row` / `Box` / `Card - A′ 展開(精簡後)` 等原始名稱。因為它是設計探索過程、不是交付畫面，我沒有動它。若也要交付給工程師再告訴我。
