# `Restaurant/reservation-v2` 圖層命名對照表 v2

節點總數 **220** ｜ 改名 **142** ｜ 維持原名 **78**

## 命名規則

1. **用「這是什麼」命名，不用排版術語** — 不再出現 Row / Stack / Box / Inner / Block / Wrap / Margin
2. **英文、空格分隔、每字大寫**（Title Case）— `Booking Form Card`、`Prev Month Button`
3. **階層靠圖層樹表達，名字不加路徑** — 一般 frame 不用 `/`（Figma 的 `/` 是元件資料夾語法，用在 frame 上只是噪音）
4. **父層已交代的就不重複** — `Party Size` 底下的標題就叫 `Heading`，不叫 `Party Size Heading`
5. **同層不得同名** — 三個 `Link` 拆成 `Privacy Link` / `Terms Link` / `Contact Link`
6. **狀態寫在括號裡** — `Day Button (Closed)`、`Day Button (Selected)`
7. **元件實例掛 `[Comp]` 前綴** — 工程師看到就直接 import，不要手刻
8. **不用文案當容器名** — 文案會改，`步驟 1 3`、`2026 年 8月` 這種名字改稿就過期
9. **text 節點維持以文案為名** — Figma 標準，方便在圖層面板搜文案

## 樹狀對照

```
Main   ／不變
  Hero Carousel Section
  └→ Hero Carousel
    Slides   ／不變
      Slide   ／不變
        Image
        └→ Hero Image
        Overlay
        └→ Hero Overlay
        Box
        └→ Slide Content
    Indicator
    └→ Carousel Indicator
  StackWrap
  └→ Booking Form
    Stack
    └→ Booking Form Card
      SectionWrap
      └→ Party Size Column
        Section
        └→ Party Size
          Block
          └→ Party Size Content
            Heading   ／不變
              用餐人數   ／不變
            Row
            └→ Stepper List
              Stepper
              └→ Adult Stepper
                成人
                └→ Adult Label
                  成人   ／不變
                stepper
                └→ [Comp] Stepper (Adult)
              Stepper
              └→ Child Stepper
                小孩 0-7歲
                └→ Child Label
                  小孩 (0-7歲)   ／不變
                stepper
                └→ [Comp] Stepper (Child)
        Background+VerticalBorder
        └→ Party Size Notice
          預約說明： 超過 8 人的團體預約，請直接撥打電話聯繫我們的專屬客服。   ／不變
        Margin
        └→ Column Spacer
      Section
      └→ Date Picker
        Heading   ／不變
          選擇日期   ／不變
        2026 年 8月
        └→ Month Nav
          2026 年 8月
          └→ Month Label
            2026 年 8月   ／不變
          Row
          └→ Month Nav Buttons
            Button - 上個月
            └→ Prev Month Button
              ChevLeft
              └→ Chevron Left
            Button - 下個月
            └→ Next Month Button
              ChevRight
              └→ Chevron Right
        Calendar   ／不變
          Stack
          └→ Weekday Header
            Sun   ／不變
              Sun
              └→ Sun Label
                Sun   ／不變
            Mon   ／不變
              Mon
              └→ Mon Label
                Mon   ／不變
            Tue   ／不變
              Tue
              └→ Tue Label
                Tue   ／不變
            Wed   ／不變
              Wed
              └→ Wed Label
                Wed   ／不變
            Thu   ／不變
              Thu
              └→ Thu Label
                Thu   ／不變
            Fri   ／不變
              Fri
              └→ Fri Label
                Fri   ／不變
            Sat   ／不變
              Sat
              └→ Sat Label
                Sat   ／不變
          Inner
          └→ Day Grid
            Stack
            └→ Day Cells
              26
              └→ Jul 26
                Button
                └→ Day Button (Outside)
                  26   ／不變
              27
              └→ Jul 27
                Button
                └→ Day Button (Outside)
                  27   ／不變
              28
              └→ Jul 28
                Button
                └→ Day Button (Outside)
                  28   ／不變
              29
              └→ Jul 29
                Button
                └→ Day Button (Outside)
                  29   ／不變
              30
              └→ Jul 30
                Button
                └→ Day Button (Outside)
                  30   ／不變
              31
              └→ Jul 31
                Button
                └→ Day Button (Outside)
                  31   ／不變
              1
              └→ Aug 1
                Button - 2026年8月1日
                └→ Day Button
                  1   ／不變
              2
              └→ Aug 2
                Button - 2026年8月2日
                └→ Day Button
                  2   ／不變
              3
              └→ Aug 3
                Button - 2026年8月3日（公休）
                └→ Day Button (Closed)
                  3   ／不變
              4
              └→ Aug 4
                Button - 2026年8月4日
                └→ Day Button
                  4   ／不變
              5
              └→ Aug 5
                Button - 2026年8月5日
                └→ Day Button
                  5   ／不變
              6
              └→ Aug 6
                Button - 2026年8月6日
                └→ Day Button
                  6   ／不變
              7
              └→ Aug 7
                Button - 2026年8月7日
                └→ Day Button
                  7   ／不變
              8
              └→ Aug 8
                Button - 2026年8月8日
                └→ Day Button (Selected)
                  8   ／不變
              9
              └→ Aug 9
                Button - 2026年8月9日
                └→ Day Button
                  9   ／不變
              10
              └→ Aug 10
                Button - 2026年8月10日（公休）
                └→ Day Button (Closed)
                  10   ／不變
              11
              └→ Aug 11
                Button - 2026年8月11日
                └→ Day Button
                  11   ／不變
              12
              └→ Aug 12
                Button - 2026年8月12日
                └→ Day Button
                  12   ／不變
              13
              └→ Aug 13
                Button - 2026年8月13日
                └→ Day Button
                  13   ／不變
              14
              └→ Aug 14
                Button - 2026年8月14日
                └→ Day Button
                  14   ／不變
              15
              └→ Aug 15
                Button - 2026年8月15日
                └→ Day Button
                  15   ／不變
              16
              └→ Aug 16
                Button - 2026年8月16日
                └→ Day Button
                  16   ／不變
              17
              └→ Aug 17
                Button - 2026年8月17日（公休）
                └→ Day Button (Closed)
                  17   ／不變
              18
              └→ Aug 18
                Button - 2026年8月18日
                └→ Day Button
                  18   ／不變
              19
              └→ Aug 19
                Button - 2026年8月19日
                └→ Day Button
                  19   ／不變
              20
              └→ Aug 20
                Button - 2026年8月20日
                └→ Day Button
                  20   ／不變
              21
              └→ Aug 21
                Button - 2026年8月21日
                └→ Day Button
                  21   ／不變
              22
              └→ Aug 22
                Button - 2026年8月22日
                └→ Day Button
                  22   ／不變
              23
              └→ Aug 23
                Button - 2026年8月23日
                └→ Day Button
                  23   ／不變
              24
              └→ Aug 24
                Button - 2026年8月24日（公休）
                └→ Day Button (Closed)
                  24   ／不變
              25
              └→ Aug 25
                Button - 2026年8月25日
                └→ Day Button
                  25   ／不變
              26
              └→ Aug 26
                Button - 2026年8月26日
                └→ Day Button
                  26   ／不變
              27
              └→ Aug 27
                Button - 2026年8月27日
                └→ Day Button
                  27   ／不變
              28
              └→ Aug 28
                Button - 2026年8月28日
                └→ Day Button
                  28   ／不變
              29
              └→ Aug 29
                Button - 2026年8月29日
                └→ Day Button
                  29   ／不變
              30
              └→ Aug 30
                Button - 2026年8月30日
                └→ Day Button
                  30   ／不變
              31
              └→ Aug 31
                Button - 2026年8月31日（公休）
                └→ Day Button (Closed)
                  31   ／不變
              1
              └→ Sep 1
                Button
                └→ Day Button (Outside)
                  1   ／不變
              2
              └→ Sep 2
                Button
                └→ Day Button (Outside)
                  2   ／不變
              3
              └→ Sep 3
                Button
                └→ Day Button (Outside)
                  3   ／不變
              4
              └→ Sep 4
                Button
                └→ Day Button (Outside)
                  4   ／不變
              5
              └→ Sep 5
                Button
                └→ Day Button (Outside)
                  5   ／不變
      BookingPanel
      └→ Time Slot Column
        TimeSlotGroup
        └→ Time Slot
          Row
          └→ Time Slot Header
            Heading   ／不變
              選擇時段   ／不變
          TimeSlots
          └→ [Comp] Time Slots
        Button
        └→ [Comp] Button (Next Step)
Header   ／不變
  Row
  └→ Header Bar
    Button - 返回預約首頁
    └→ Back Button
      ChevLeft
      └→ Chevron Left
      預約首頁
      └→ Back Label
        訂位查詢   ／不變
    步驟 1 3
    └→ Step Badge
      步驟 1 3
      └→ Step Label
        步驟 1 / 3   ／不變
SharedFooter
└→ Shared Footer
  Inner
  └→ Footer Container
    Row
    └→ Footer Content
      Stack
      └→ Footer Brand
        RESTAURANT BOO
        └→ Brand Name
          RESTAURANT BOOKING ENTRANCE   ／不變
        © 2026 Restaur
        └→ Copyright
          © 2026 Restaurant Booking Entrance. All rights res   ／不變
      Navigation - 頁尾導覽
      └→ Footer Nav
        Link
        └→ Privacy Link
          隱私政策   ／不變
        Link
        └→ Terms Link
          服務條款   ／不變
        Link
        └→ Contact Link
          聯繫我們   ／不變
```

## 改名理由（重點層，日曆 42 格已摺疊）

| 現名 | 新名 | 節點 ID | 理由 |
|---|---|---|---|
| `Hero Carousel Section` | `Hero Carousel` | `779:2574` | 原名帶多餘的 Section |
| `Image` | `Hero Image` | `779:2577` | 原名 Image 太泛用 |
| `Overlay` | `Hero Overlay` | `779:2578` | 原名 Overlay 太泛用 |
| `Box` | `Slide Content` | `779:2579` | 原名 Box 看不出用途（目前為空層） |
| `Indicator` | `Carousel Indicator` | `779:2580` | 原名 Indicator 太泛用 |
| `StackWrap` | `Booking Form` | `782:2572` | 原名 StackWrap 是 Figma 排版術語，非畫面語意 |
| `Stack` | `Booking Form Card` | `779:2584` | 原名 Stack；實際是三欄白色卡片 |
| `SectionWrap` | `Party Size Column` | `779:2585` | 原名 SectionWrap |
| `Section` | `Party Size` | `779:2586` | 原名 Section |
| `Block` | `Party Size Content` | `779:2587` | 原名 Block |
| `Row` | `Stepper List` | `779:2590` | ⚠️ 原名 Row 但實際是垂直排列，名字與事實相反 |
| `Stepper` | `Adult Stepper` | `779:2591` | 兩個同名 Stepper 無法分辨 |
| `成人` | `Adult Label` | `779:2592` | 原名為文案「成人」 |
| `stepper` | `[Comp] Stepper (Adult)` | `835:636` | 元件實例 |
| `Stepper` | `Child Stepper` | `779:2601` | 兩個同名 Stepper 無法分辨 |
| `小孩 0-7歲` | `Child Label` | `779:2602` | 原名為文案「小孩 0-7歲」 |
| `stepper` | `[Comp] Stepper (Child)` | `835:646` | 元件實例 |
| `Background+VerticalBorder` | `Party Size Notice` | `779:2611` | 原名 Background+VerticalBorder 描述的是樣式不是用途 |
| `Margin` | `Column Spacer` | `779:2613` | ⚠️ 原名 Margin，340×1px 在欄位最底部。請確認是分隔線還是殘留佔位 |
| `Section` | `Date Picker` | `779:2614` | 原名 Section |
| `2026 年 8月` | `Month Nav` | `779:2617` | 原名為文案「2026 年 8月」，換月後名字就過期 |
| `2026 年 8月` | `Month Label` | `779:2618` | 同上 |
| `Row` | `Month Nav Buttons` | `779:2620` | 原名 Row |
| `Button - 上個月` | `Prev Month Button` | `779:2621` | 統一 Button 命名 |
| `ChevLeft` | `Chevron Left` | `779:2622` | ChevLeft 縮寫改全名 |
| `Button - 下個月` | `Next Month Button` | `779:2624` | 統一 Button 命名 |
| `ChevRight` | `Chevron Right` | `779:2625` | ChevRight 縮寫改全名 |
| `Stack` | `Weekday Header` | `779:2628` | 原名 Stack |
| `Sun` | `Sun Label` | `779:2630` | 內外層同名，內層改為 Label |
| `Mon` | `Mon Label` | `779:2633` | 內外層同名，內層改為 Label |
| `Tue` | `Tue Label` | `779:2636` | 內外層同名，內層改為 Label |
| `Wed` | `Wed Label` | `779:2639` | 內外層同名，內層改為 Label |
| `Thu` | `Thu Label` | `779:2642` | 內外層同名，內層改為 Label |
| `Fri` | `Fri Label` | `779:2645` | 內外層同名，內層改為 Label |
| `Sat` | `Sat Label` | `779:2648` | 內外層同名，內層改為 Label |
| `Inner` | `Day Grid` | `779:2650` | 原名 Inner |
| `Stack` | `Day Cells` | `779:2651` | 原名 Stack |
| `26` | `Jul 26` | `779:2652` | 原名只有數字，跨月會重複（26、1…各出現兩次） |
| `Button` | `Day Button (Outside)` | `779:2653` | 非本月日期 |
| `BookingPanel` | `Time Slot Column` | `779:2778` | 原名 BookingPanel，與另外兩欄命名不一致 |
| `TimeSlotGroup` | `Time Slot` | `779:2779` | 原名 TimeSlotGroup |
| `Row` | `Time Slot Header` | `779:2780` | 原名 Row |
| `TimeSlots` | `[Comp] Time Slots` | `779:2783` | 元件實例 |
| `Button` | `[Comp] Button (Next Step)` | `835:663` | 元件實例：下一步 CTA |
| `Row` | `Header Bar` | `779:2788` | 原名 Row |
| `Button - 返回預約首頁` | `Back Button` | `779:2789` | 原名 Button - 返回預約首頁 |
| `ChevLeft` | `Chevron Left` | `779:2790` | ChevLeft 縮寫改全名 |
| `預約首頁` | `Back Label` | `779:2792` | ⚠️ 原名「預約首頁」但文案是「訂位查詢」，兩者不一致，請確認哪個才對 |
| `步驟 1 3` | `Step Badge` | `779:2794` | 原名為文案「步驟 1 3」，步驟改了名字就過期 |
| `步驟 1 3` | `Step Label` | `779:2795` | 同上 |
| `SharedFooter` | `Shared Footer` | `779:2797` | 加空格，保留 Shared 表示這是共用區塊 |
| `Inner` | `Footer Container` | `779:2798` | 原名 Inner |
| `Row` | `Footer Content` | `779:2799` | 原名 Row |
| `Stack` | `Footer Brand` | `779:2800` | 原名 Stack |
| `RESTAURANT BOO` | `Brand Name` | `779:2801` | 原名為被截斷的文案 RESTAURANT BOO |
| `© 2026 Restaur` | `Copyright` | `779:2803` | 原名為被截斷的文案 © 2026 Restaur |
| `Navigation - 頁尾導覽` | `Footer Nav` | `779:2805` | 原名 Navigation - 頁尾導覽，中英混用 |
| `Link` | `Privacy Link` | `779:2806` | 三個 Link 完全同名 |
| `Link` | `Terms Link` | `779:2808` | 三個 Link 完全同名 |
| `Link` | `Contact Link` | `779:2810` | 三個 Link 完全同名 |
## 命名以外的觀察（不在這次改動範圍，供參考）

- `Header` 與 `Shared Footer` 在整個 section 裡各被複製了 **34 份**，內容完全相同。建議收成元件，之後改一次就能全部同步——目前若要改頁尾連結文字，得手動改 34 個地方。
- `Party Size Content`（原 `Block`）與其父層 `Party Size`（原 `Section`）之間沒有實質差異，是多餘的一層巢狀。同樣情況也出現在 `Sun` → `Sun Label` 這類文字外包一層 frame 的結構。刪除多餘層會讓交付更乾淨，但那屬於結構調整、不是命名，需要另外確認。
