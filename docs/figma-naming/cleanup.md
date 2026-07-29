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

## 5. 返回鍵核對（規則更正）

先前記錄的「返回鍵文案與頁面標題不符」**判斷有誤，已作廢**。返回鍵標示的是
**上一個主要步驟**，本來就不會等於當前頁標題。

依「返回上一步」的規則重新核對 34 個畫面，主流程
（步驟1 選擇日期 → 步驟2 選擇餐點 → 步驟3 填寫聯絡資料）大多正確，
以下 3 處為實際漏改：

| 畫面 | 返回鍵 | 步驟標籤 | 問題 |
|---|---|---|---|
| `contact info/ for coffee` | 選擇日期 | 步驟 2 / 3 | 頁面為步驟3，返回鍵與步驟標籤都停在步驟2；應為「選擇餐點」+ 3/3 |
| `contact info/noworking` | 選擇日期 | 步驟 3 / 3 | 步驟標籤已更新為 3/3，返回鍵漏改；應為「選擇餐點」 |
| `contact info` | 選擇餐點 ✓ | 步驟 ３ / 3 | 「３」為全形字，其餘 33 個畫面皆為半形 |

對照：`contact info/custom` 為「選擇餐點」+ 3/3，正確。

### 待確認

`reservation-v2` 與 `reservation-v2/empty` 為全新訂位的步驟 1，返回鍵指向
「訂位查詢」。但 `search reservation` 自身的返回鍵是「預約首頁」，
表示訂位查詢是預約首頁底下的分支。全新訂位的上一步應為「預約首頁」或
「訂位查詢」，取決於入口設計，尚待確認。

（`reschedule/*` 系列返回「訂位查詢」符合流程，修改訂位本就自查詢頁進入。）

## 6. 不列入整理範圍

`28 section v2` 內的 `A 案改良 — 拿掉重複資訊與多餘控制項` 為設計探索比稿板，
非交付畫面，圖層維持原始命名，**確認不整理**。
