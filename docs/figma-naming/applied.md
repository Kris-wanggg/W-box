# Figma 圖層命名 — 已套用結果

對象：`28 section v2`（node `668:1064`），頁面 `hi-fi mock(c端預約入口)`
範圍：34 個畫面、3,168 個可改名圖層（frame / instance / vector）
文字節點：1,616 個，**全部維持以文案為名**（未更動）

## 命名規則

1. 用「這是什麼」命名，不用排版術語 —— 不再出現 Row / Stack / Box / Inner / Block / Wrap / Margin
2. 英文、空格分隔、每字大寫（Title Case）
3. 階層靠圖層樹表達，一般 frame 不用 `/`
4. 父層交代過的不重複 —— `Party Size` 底下就叫 `Heading`
5. 同層不得同名 —— 三個 `Link` 拆成 `Privacy Link` / `Terms Link` / `Contact Link`
6. 狀態寫在括號 —— `Day Button (Closed)` / `(Selected)` / `(Outside)`
7. 元件實例掛 `[Comp]` 前綴，名稱取自元件本身（非圖層舊名）
8. 不拿文案當容器名；清單項目例外，以項目識別入括號 —— `Meal Card (雙人分享套餐)`
9. text 節點維持以文案為名

## 共用區塊（34 個畫面一致）

Header：`Header` › `Header Bar` › `Back Button` › `Chevron Left` / `Back Label`，右側 `Step Badge` › `Step Label`
Footer：`Shared Footer` › `Footer Container` › `Footer Content` › `Footer Brand`（`Brand Name` / `Copyright`）＋ `Footer Nav`（`Privacy Link` / `Terms Link` / `Contact Link`）

## 各家族主要命名

預約首頁（4）：`Hero Carousel`、`Booking Form Card`、`Party Size Column`、`Stepper List`、`Date Picker`、`Month Nav`、`Calendar` › `Weekday Header` / `Day Grid` › `Day Cells` › `Aug 8` › `Day Button (Selected)`、`Time Slot Column`
選餐點（9）：`Meal Picker Card` › `Meal Picker Intro` / `Category Tabs` / `Category Summary` / `Meal List` › `Meal Card (…)` › `Meal Info`（`Meal Icon` / `Meal Text` › `Meal Name`+`Meal Description`+`Meal Detail` / `Meal Price`）＋ `Meal Actions`；右側 `Order Summary Card` › `Order Summary Header` / `Order Item List` / `Order Total` / `Submit Button Wrap` / `Order Note`
客製化（2）：`Custom Meal Form` › `Field Group (…)` › `Field Legend`（`Required Mark`）/ `Option Group` / `Field Hint`
聯絡資訊、成功狀態、訂位查詢（21）：`Status Header`（`Status Icon` / `Status Text`）、`Reservation Info Card` › `Card Header` / `Info Rows` › `Info Row (訂位編號)` › `Field Label` + `Field Value`、`Notice`、`Action Buttons`、`Payment Method`、`Deposit Rules Card`

## 結構變更

刪除 4 個 340.67×1px、無填色無邊框的隱形佔位符（原名 `Margin`）：
`779:2613`、`788:1031`、`778:489`、`778:761`
所在欄位高度 335→302px；卡片高度由最高的「選擇時段」欄（403px）決定且三欄靠上對齊，畫面無任何像素位移（已截圖驗證）。

## 需要你注意的發現

1. **Header 文案與畫面對不上**：多個畫面的返回鍵文字是舊的，例如標題為「訂位成立」的畫面顯示「選擇餐點」、`Restaurant/choose-set/default` 顯示「選擇日期」。新圖層名 `Back Button` / `Back Label` 不綁文案，但文案本身建議校對。
2. **脫離元件的實例**：`Restaurant/reservation-v2/empty` 的兩個 stepper（`788:1012`、`788:1022`）是脫離元件的普通 Frame，不是 Component 實例。已依實情不加 `[Comp]` 前綴。
3. **Header / Shared Footer 各被複製 34 份**，內容完全相同。建議收成元件，改一次即可全部同步。
4. **多餘的巢狀層**：`Party Size` › `Party Size Content`、`Sun` › `Sun Label` 這類「文字外再包一層 frame」的結構普遍存在。刪除可讓交付更乾淨，但屬結構調整，未執行。
