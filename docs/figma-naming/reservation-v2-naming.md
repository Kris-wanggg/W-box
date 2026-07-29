# `Restaurant/reservation-v2` 圖層命名對照表

節點總數 **220** ｜ 改名 **156** ｜ 維持原名 **64**

- 命名規範：斜線分層 `類別/角色`
- `[Comp]` 前綴 = 已存在的元件實例，工程師請直接 import，勿手刻
- text 節點一律維持以文案為名（Figma 標準，方便在圖層面板搜文案）

## 樹狀對照（縮排 = 圖層階層）

```
Main   ／不變
  Hero Carousel Section
  └→ Section/HeroCarousel   (779:2574)
    Slides
    └→ Carousel/Slides   (779:2575)
      Slide
      └→ Carousel/Slide   (779:2576)
        Image
        └→ Media/HeroImage   (779:2577)
        Overlay
        └→ Media/HeroOverlay   (779:2578)
        Box
        └→ Carousel/SlideContent   (779:2579)
    Indicator
    └→ Carousel/Indicator   (779:2580)
  StackWrap
  └→ Section/BookingForm   (782:2572)
    Stack
    └→ Card/BookingForm   (779:2584)
      SectionWrap
      └→ Column/PartySize   (779:2585)
        Section
        └→ Section/PartySize   (779:2586)
          Block
          └→ Stack/PartySizeBody   (779:2587)
            Heading
            └→ Heading/PartySize   (779:2588)
              用餐人數   ／不變
            Row
            └→ Stack/StepperGroup   (779:2590)
              Stepper
              └→ Field/PartySizeAdult   (779:2591)
                成人
                └→ Label/Adult   (779:2592)
                  成人   ／不變
                stepper
                └→ [Comp] Stepper/Adult   (835:636)
              Stepper
              └→ Field/PartySizeChild   (779:2601)
                小孩 0-7歲
                └→ Label/Child   (779:2602)
                  小孩 (0-7歲)   ／不變
                stepper
                └→ [Comp] Stepper/Child   (835:646)
        Background+VerticalBorder
        └→ Notice/PartySizeLimit   (779:2611)
          預約說明： 超過 8 人的團體預約，請直接撥打電話聯繫我們的專屬客服。   ／不變
        Margin
        └→ Spacer/PartySizeBottom   (779:2613)
      Section
      └→ Section/DatePicker   (779:2614)
        Heading
        └→ Heading/DatePicker   (779:2615)
          選擇日期   ／不變
        2026 年 8月
        └→ Row/MonthNav   (779:2617)
          2026 年 8月
          └→ Label/CurrentMonth   (779:2618)
            2026 年 8月   ／不變
          Row
          └→ Row/MonthNavButtons   (779:2620)
            Button - 上個月
            └→ Button/PrevMonth   (779:2621)
              ChevLeft
              └→ Icon/ChevronLeft   (779:2622)
            Button - 下個月
            └→ Button/NextMonth   (779:2624)
              ChevRight
              └→ Icon/ChevronRight   (779:2625)
        Calendar
        └→ Calendar/Grid   (779:2627)
          Stack
          └→ Calendar/WeekdayHeader   (779:2628)
            Sun
            └→ Calendar/Weekday-Sun   (779:2629)
              Sun
              └→ Label/Sun   (779:2630)
                Sun   ／不變
            Mon
            └→ Calendar/Weekday-Mon   (779:2632)
              Mon
              └→ Label/Mon   (779:2633)
                Mon   ／不變
            Tue
            └→ Calendar/Weekday-Tue   (779:2635)
              Tue
              └→ Label/Tue   (779:2636)
                Tue   ／不變
            Wed
            └→ Calendar/Weekday-Wed   (779:2638)
              Wed
              └→ Label/Wed   (779:2639)
                Wed   ／不變
            Thu
            └→ Calendar/Weekday-Thu   (779:2641)
              Thu
              └→ Label/Thu   (779:2642)
                Thu   ／不變
            Fri
            └→ Calendar/Weekday-Fri   (779:2644)
              Fri
              └→ Label/Fri   (779:2645)
                Fri   ／不變
            Sat
            └→ Calendar/Weekday-Sat   (779:2647)
              Sat
              └→ Label/Sat   (779:2648)
                Sat   ／不變
          Inner
          └→ Calendar/DayGridWrap   (779:2650)
            Stack
            └→ Calendar/DayGrid   (779:2651)
              26
              └→ Calendar/DayCell-2026-07-26   (779:2652)
                Button
                └→ Button/Day-2026-07-26 [outside]   (779:2653)
                  26   ／不變
              27
              └→ Calendar/DayCell-2026-07-27   (779:2655)
                Button
                └→ Button/Day-2026-07-27 [outside]   (779:2656)
                  27   ／不變
              28
              └→ Calendar/DayCell-2026-07-28   (779:2658)
                Button
                └→ Button/Day-2026-07-28 [outside]   (779:2659)
                  28   ／不變
              29
              └→ Calendar/DayCell-2026-07-29   (779:2661)
                Button
                └→ Button/Day-2026-07-29 [outside]   (779:2662)
                  29   ／不變
              30
              └→ Calendar/DayCell-2026-07-30   (779:2664)
                Button
                └→ Button/Day-2026-07-30 [outside]   (779:2665)
                  30   ／不變
              31
              └→ Calendar/DayCell-2026-07-31   (779:2667)
                Button
                └→ Button/Day-2026-07-31 [outside]   (779:2668)
                  31   ／不變
              1
              └→ Calendar/DayCell-2026-08-01   (779:2670)
                Button - 2026年8月1日
                └→ Button/Day-2026-08-01   (779:2671)
                  1   ／不變
              2
              └→ Calendar/DayCell-2026-08-02   (779:2673)
                Button - 2026年8月2日
                └→ Button/Day-2026-08-02   (779:2674)
                  2   ／不變
              3
              └→ Calendar/DayCell-2026-08-03   (779:2676)
                Button - 2026年8月3日（公休）
                └→ Button/Day-2026-08-03 [closed]   (779:2677)
                  3   ／不變
              4
              └→ Calendar/DayCell-2026-08-04   (779:2679)
                Button - 2026年8月4日
                └→ Button/Day-2026-08-04   (779:2680)
                  4   ／不變
              5
              └→ Calendar/DayCell-2026-08-05   (779:2682)
                Button - 2026年8月5日
                └→ Button/Day-2026-08-05   (779:2683)
                  5   ／不變
              6
              └→ Calendar/DayCell-2026-08-06   (779:2685)
                Button - 2026年8月6日
                └→ Button/Day-2026-08-06   (779:2686)
                  6   ／不變
              7
              └→ Calendar/DayCell-2026-08-07   (779:2688)
                Button - 2026年8月7日
                └→ Button/Day-2026-08-07   (779:2689)
                  7   ／不變
              8
              └→ Calendar/DayCell-2026-08-08   (779:2691)
                Button - 2026年8月8日
                └→ Button/Day-2026-08-08 [selected]   (779:2692)
                  8   ／不變
              9
              └→ Calendar/DayCell-2026-08-09   (779:2694)
                Button - 2026年8月9日
                └→ Button/Day-2026-08-09   (779:2695)
                  9   ／不變
              10
              └→ Calendar/DayCell-2026-08-10   (779:2697)
                Button - 2026年8月10日（公休）
                └→ Button/Day-2026-08-10 [closed]   (779:2698)
                  10   ／不變
              11
              └→ Calendar/DayCell-2026-08-11   (779:2700)
                Button - 2026年8月11日
                └→ Button/Day-2026-08-11   (779:2701)
                  11   ／不變
              12
              └→ Calendar/DayCell-2026-08-12   (779:2703)
                Button - 2026年8月12日
                └→ Button/Day-2026-08-12   (779:2704)
                  12   ／不變
              13
              └→ Calendar/DayCell-2026-08-13   (779:2706)
                Button - 2026年8月13日
                └→ Button/Day-2026-08-13   (779:2707)
                  13   ／不變
              14
              └→ Calendar/DayCell-2026-08-14   (779:2709)
                Button - 2026年8月14日
                └→ Button/Day-2026-08-14   (779:2710)
                  14   ／不變
              15
              └→ Calendar/DayCell-2026-08-15   (779:2712)
                Button - 2026年8月15日
                └→ Button/Day-2026-08-15   (779:2713)
                  15   ／不變
              16
              └→ Calendar/DayCell-2026-08-16   (779:2715)
                Button - 2026年8月16日
                └→ Button/Day-2026-08-16   (779:2716)
                  16   ／不變
              17
              └→ Calendar/DayCell-2026-08-17   (779:2718)
                Button - 2026年8月17日（公休）
                └→ Button/Day-2026-08-17 [closed]   (779:2719)
                  17   ／不變
              18
              └→ Calendar/DayCell-2026-08-18   (779:2721)
                Button - 2026年8月18日
                └→ Button/Day-2026-08-18   (779:2722)
                  18   ／不變
              19
              └→ Calendar/DayCell-2026-08-19   (779:2724)
                Button - 2026年8月19日
                └→ Button/Day-2026-08-19   (779:2725)
                  19   ／不變
              20
              └→ Calendar/DayCell-2026-08-20   (779:2727)
                Button - 2026年8月20日
                └→ Button/Day-2026-08-20   (779:2728)
                  20   ／不變
              21
              └→ Calendar/DayCell-2026-08-21   (779:2730)
                Button - 2026年8月21日
                └→ Button/Day-2026-08-21   (779:2731)
                  21   ／不變
              22
              └→ Calendar/DayCell-2026-08-22   (779:2733)
                Button - 2026年8月22日
                └→ Button/Day-2026-08-22   (779:2734)
                  22   ／不變
              23
              └→ Calendar/DayCell-2026-08-23   (779:2736)
                Button - 2026年8月23日
                └→ Button/Day-2026-08-23   (779:2737)
                  23   ／不變
              24
              └→ Calendar/DayCell-2026-08-24   (779:2739)
                Button - 2026年8月24日（公休）
                └→ Button/Day-2026-08-24 [closed]   (779:2740)
                  24   ／不變
              25
              └→ Calendar/DayCell-2026-08-25   (779:2742)
                Button - 2026年8月25日
                └→ Button/Day-2026-08-25   (779:2743)
                  25   ／不變
              26
              └→ Calendar/DayCell-2026-08-26   (779:2745)
                Button - 2026年8月26日
                └→ Button/Day-2026-08-26   (779:2746)
                  26   ／不變
              27
              └→ Calendar/DayCell-2026-08-27   (779:2748)
                Button - 2026年8月27日
                └→ Button/Day-2026-08-27   (779:2749)
                  27   ／不變
              28
              └→ Calendar/DayCell-2026-08-28   (779:2751)
                Button - 2026年8月28日
                └→ Button/Day-2026-08-28   (779:2752)
                  28   ／不變
              29
              └→ Calendar/DayCell-2026-08-29   (779:2754)
                Button - 2026年8月29日
                └→ Button/Day-2026-08-29   (779:2755)
                  29   ／不變
              30
              └→ Calendar/DayCell-2026-08-30   (779:2757)
                Button - 2026年8月30日
                └→ Button/Day-2026-08-30   (779:2758)
                  30   ／不變
              31
              └→ Calendar/DayCell-2026-08-31   (779:2760)
                Button - 2026年8月31日（公休）
                └→ Button/Day-2026-08-31 [closed]   (779:2761)
                  31   ／不變
              1
              └→ Calendar/DayCell-2026-09-01   (779:2763)
                Button
                └→ Button/Day-2026-09-01 [outside]   (779:2764)
                  1   ／不變
              2
              └→ Calendar/DayCell-2026-09-02   (779:2766)
                Button
                └→ Button/Day-2026-09-02 [outside]   (779:2767)
                  2   ／不變
              3
              └→ Calendar/DayCell-2026-09-03   (779:2769)
                Button
                └→ Button/Day-2026-09-03 [outside]   (779:2770)
                  3   ／不變
              4
              └→ Calendar/DayCell-2026-09-04   (779:2772)
                Button
                └→ Button/Day-2026-09-04 [outside]   (779:2773)
                  4   ／不變
              5
              └→ Calendar/DayCell-2026-09-05   (779:2775)
                Button
                └→ Button/Day-2026-09-05 [outside]   (779:2776)
                  5   ／不變
      BookingPanel
      └→ Column/TimeSlot   (779:2778)
        TimeSlotGroup
        └→ Section/TimeSlot   (779:2779)
          Row
          └→ Row/TimeSlotHeader   (779:2780)
            Heading
            └→ Heading/TimeSlot   (779:2781)
              選擇時段   ／不變
          TimeSlots
          └→ [Comp] TimeSlots   (779:2783)
        Button
        └→ [Comp] Button/NextStep   (835:663)
Header
└→ Header/Booking   (779:2787)
  Row
  └→ Row/HeaderBar   (779:2788)
    Button - 返回預約首頁
    └→ Button/BackToHome   (779:2789)
      ChevLeft
      └→ Icon/ChevronLeft   (779:2790)
      預約首頁
      └→ Label/BackToHome   (779:2792)
        訂位查詢   ／不變
    步驟 1 3
    └→ Badge/StepIndicator   (779:2794)
      步驟 1 3
      └→ Label/StepIndicator   (779:2795)
        步驟 1 / 3   ／不變
SharedFooter
└→ Footer/Shared   (779:2797)
  Inner
  └→ Container/FooterInner   (779:2798)
    Row
    └→ Row/FooterContent   (779:2799)
      Stack
      └→ Stack/FooterBrand   (779:2800)
        RESTAURANT BOO
        └→ Label/BrandName   (779:2801)
          RESTAURANT BOOKING ENTRANCE   ／不變
        © 2026 Restaur
        └→ Label/Copyright   (779:2803)
          © 2026 Restaurant Booking Entrance. All rights res   ／不變
      Navigation - 頁尾導覽
      └→ Nav/FooterLinks   (779:2805)
        Link
        └→ Link/PrivacyPolicy   (779:2806)
          隱私政策   ／不變
        Link
        └→ Link/TermsOfService   (779:2808)
          服務條款   ／不變
        Link
        └→ Link/Contact   (779:2810)
          聯繫我們   ／不變
```

## 結構層 Tailwind 對應（給工程師）

| 新圖層名 | 節點 ID | Tailwind |
|---|---|---|
| `Main` | `779:2573` | `<main> · flex flex-col` |
| `Section/HeroCarousel` | `779:2574` | `relative w-full h-[480px] overflow-hidden` |
| `Carousel/Slides` | `779:2575` | `flex` |
| `Carousel/Slide` | `779:2576` | `relative w-full h-full` |
| `Media/HeroImage` | `779:2577` | `absolute inset-0 object-cover` |
| `Media/HeroOverlay` | `779:2578` | `absolute inset-0 bg-black/30` |
| `Carousel/SlideContent` | `779:2579` | `absolute inset-0` |
| `Carousel/Indicator` | `779:2580` | `flex gap-1.5` |
| `Section/BookingForm` | `782:2572` | `w-full px-8` |
| `Card/BookingForm` | `779:2584` | `flex flex-col md:flex-row gap-8 rounded-2xl bg-surface` |
| `Column/PartySize` | `779:2585` | `flex flex-col gap-4 md:w-[400px]` |
| `Section/PartySize` | `779:2586` | `flex flex-col` |
| `Stack/PartySizeBody` | `779:2587` | `flex flex-col gap-6` |
| `Heading/PartySize` | `779:2588` | `text-lg font-medium` |
| `Stack/StepperGroup` | `779:2590` | `flex flex-col gap-3` |
| `Field/PartySizeAdult` | `779:2591` | `flex items-center justify-between` |
| `Label/Adult` | `779:2592` | `text-sm` |
| `Field/PartySizeChild` | `779:2601` | `flex items-center justify-between` |
| `Label/Child` | `779:2602` | `text-sm` |
| `Notice/PartySizeLimit` | `779:2611` | `border-l-4 bg-surface-alt p-4 text-sm` |
| `Spacer/PartySizeBottom` | `779:2613` | `h-px` |
| `Section/DatePicker` | `779:2614` | `flex flex-col gap-4 md:w-[400px]` |
| `Heading/DatePicker` | `779:2615` | `text-lg font-medium` |
| `Row/MonthNav` | `779:2617` | `flex items-center justify-between` |
| `Label/CurrentMonth` | `779:2618` | `text-base font-medium` |
| `Row/MonthNavButtons` | `779:2620` | `flex gap-1.5` |
| `Button/PrevMonth` | `779:2621` | `size-[30px] rounded hover:bg-surface-alt` |
| `Icon/ChevronLeft` | `779:2622` | `size-4` |
| `Button/NextMonth` | `779:2624` | `size-[30px] rounded hover:bg-surface-alt` |
| `Icon/ChevronRight` | `779:2625` | `size-4` |
| `Calendar/Grid` | `779:2627` | `flex flex-col` |
| `Calendar/WeekdayHeader` | `779:2628` | `grid grid-cols-7` |
| `Calendar/Weekday-Sun` | `779:2629` | `flex items-center justify-center` |
| `Label/Sun` | `779:2630` | `text-xs text-text-muted` |
| `Calendar/Weekday-Mon` | `779:2632` | `flex items-center justify-center` |
| `Label/Mon` | `779:2633` | `text-xs text-text-muted` |
| `Calendar/Weekday-Tue` | `779:2635` | `flex items-center justify-center` |
| `Label/Tue` | `779:2636` | `text-xs text-text-muted` |
| `Calendar/Weekday-Wed` | `779:2638` | `flex items-center justify-center` |
| `Label/Wed` | `779:2639` | `text-xs text-text-muted` |
| `Calendar/Weekday-Thu` | `779:2641` | `flex items-center justify-center` |
| `Label/Thu` | `779:2642` | `text-xs text-text-muted` |
| `Calendar/Weekday-Fri` | `779:2644` | `flex items-center justify-center` |
| `Label/Fri` | `779:2645` | `text-xs text-text-muted` |
| `Calendar/Weekday-Sat` | `779:2647` | `flex items-center justify-center` |
| `Label/Sat` | `779:2648` | `text-xs text-text-muted` |
| `Calendar/DayGridWrap` | `779:2650` | `overflow-hidden` |
| `Calendar/DayGrid` | `779:2651` | `grid grid-cols-7` |
| `Column/TimeSlot` | `779:2778` | `flex flex-col gap-6 md:w-[412px]` |
| `Section/TimeSlot` | `779:2779` | `flex flex-col gap-4` |
| `Row/TimeSlotHeader` | `779:2780` | `flex items-center justify-between` |
| `Heading/TimeSlot` | `779:2781` | `text-lg font-medium` |
| `[Comp] Button/NextStep` | `835:663` | `w-full` |
| `Header/Booking` | `779:2787` | `<header> · w-full border-b` |
| `Row/HeaderBar` | `779:2788` | `flex items-center justify-between px-6 h-[72px]` |
| `Button/BackToHome` | `779:2789` | `flex items-center gap-1 hover:text-primary` |
| `Icon/ChevronLeft` | `779:2790` | `size-5` |
| `Label/BackToHome` | `779:2792` | `text-base` |
| `Badge/StepIndicator` | `779:2794` | `rounded-full border px-3 py-1` |
| `Label/StepIndicator` | `779:2795` | `text-xs text-text-secondary` |
| `Footer/Shared` | `779:2797` | `<footer> · w-full border-t` |
| `Container/FooterInner` | `779:2798` | `mx-auto max-w-[1280px] px-6` |
| `Row/FooterContent` | `779:2799` | `flex flex-col md:flex-row items-center justify-between gap-4` |
| `Stack/FooterBrand` | `779:2800` | `flex flex-col gap-1` |
| `Label/BrandName` | `779:2801` | `text-sm font-semibold tracking-widest text-primary` |
| `Label/Copyright` | `779:2803` | `text-xs text-text-muted` |
| `Nav/FooterLinks` | `779:2805` | `<nav> · flex gap-2` |
| `Link/PrivacyPolicy` | `779:2806` | `px-2 py-1 text-sm hover:text-primary hover:underline` |
| `Link/TermsOfService` | `779:2808` | `px-2 py-1 text-sm hover:text-primary hover:underline` |
| `Link/Contact` | `779:2810` | `px-2 py-1 text-sm hover:text-primary hover:underline` |

## 需要你確認的點

- **`Box` → `Carousel/SlideContent`** (`779:2579`)：原名 Box，實為疊在圖上的內容容器（目前為空）
- **`Stack` → `Card/BookingForm`** (`779:2584`)：原名 Stack，實為三欄白色卡片
- **`Block` → `Stack/PartySizeBody`** (`779:2587`)：原名 Block
- **`Row` → `Stack/StepperGroup`** (`779:2590`)：原名 Row，實際是垂直堆疊（縱向 156px / 兩列 48px）
- **`stepper` → `[Comp] Stepper/Adult`** (`835:636`)：元件實例，工程師直接 import <Stepper />
- **`stepper` → `[Comp] Stepper/Child`** (`835:646`)：元件實例，工程師直接 import <Stepper />
- **`Background+VerticalBorder` → `Notice/PartySizeLimit`** (`779:2611`)：原名 Background+VerticalBorder，是左側色條的說明區塊
- **`Margin` → `Spacer/PartySizeBottom`** (`779:2613`)：原名 Margin，1px 高。⚠️ 請確認這是分隔線還是純佔位，我先當佔位命名
- **`2026 年 8月` → `Row/MonthNav`** (`779:2617`)：原名「2026 年 8月」，是月份切換列
- **`Inner` → `Calendar/DayGridWrap`** (`779:2650`)：原名 Inner
- **`BookingPanel` → `Column/TimeSlot`** (`779:2778`)：原名 BookingPanel
- **`TimeSlotGroup` → `Section/TimeSlot`** (`779:2779`)：原名 TimeSlotGroup
- **`TimeSlots` → `[Comp] TimeSlots`** (`779:2783`)：元件實例
- **`Button` → `[Comp] Button/NextStep`** (`835:663`)：元件實例：下一步 CTA
- **`預約首頁` → `Label/BackToHome`** (`779:2792`)：⚠️ 圖層叫「預約首頁」但文案是「訂位查詢」，兩者不一致，請確認哪個才對
- **`Inner` → `Container/FooterInner`** (`779:2798`)：原名 Inner
- **`Navigation - 頁尾導覽` → `Nav/FooterLinks`** (`779:2805`)：原名 Navigation - 頁尾導覽