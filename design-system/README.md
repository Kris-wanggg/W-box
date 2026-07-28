# Restaurant Reservation — Design System

Design tokens for the **`28 section v2`** section (node `668:1064`, 35 screens) of the
Figma file [Rastaurant Reservation system](https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip/Rastaurant-Reservation-system?node-id=668-1064)
(`f27j5bQ9NnxC6aiUPxt5Ip`).

Built so a designer can restyle every screen from one place instead of editing
5,328 layers by hand.

## What lives where

| Where | What |
|---|---|
| Figma → Variables → **Restaurant Primitives** | 23 raw colours, mode `Value` |
| Figma → Variables → **Restaurant Color** | 45 semantic tokens, mode `Light` |
| Figma → 右側 Styles 面板 → **`Restaurant/…`** | 45 colour styles + 24 text styles |
| `restaurant-colors.css` | the same colours as CSS custom properties |
| `restaurant-typography.css` | the 24 text styles as CSS classes |
| `restaurant-tokens.json` | machine-readable source for other pipelines |

## Two layers

```
primitive           semantic                used by
──────────          ──────────────          ─────────────────────
olive/900   ──────► bg/brand         ──────► 主要按鈕底
#735c00     ──┬───► text/accent      ──────► 金額、連結
              └───► border/active    ──────► 選取狀態邊框
```

**Primitives are never applied to a layer directly** — their scopes are empty, so
they don't clutter Figma's property pickers. Only semantic tokens get used.

To re-skin the product, edit the primitives. Changing `olive/900` from `#735c00`
to something else recolours the primary button, every price, every link and every
active border at once.

## Naming

```
bg/…      背景與填色       bg/base, bg/surface, bg/brand
text/…    文字             text/primary, text/accent, text/danger
border/…  邊框             border/default, border/active, border/gold
```

Text styles follow the type ramp: `display` → `h1`…`h5` → `body-*` → `label-*`
→ `button` / `overline` / `caption`.

## One Figma limitation to know about

Figma cannot alias a variable *and* override its alpha. So the 23 semi-transparent
tokens (`bg/surface` = white @84%, `border/card` = sand @28%, …) store a literal
RGBA value and **do not follow their primitive** — changing `sand/300` updates
`border/default` but not `border/card`.

Practical rule when re-skinning in Figma: change the primitives first, then
sweep the ~23 alpha tokens. Their descriptions state which primitive they were
derived from, e.g. `卡片邊框 → #d0c5af @28%`.

`restaurant-colors.css` does **not** have this limitation — every primitive also
exposes an `--rst-…-rgb` channel triplet, and translucent tokens are composed
with `rgb(var(--rst-sand-300-rgb) / 28%)`. Editing one triplet updates the solid
and translucent tokens together.

## Consolidations

The section had grown near-duplicate values. These were merged (all differences
are ≤0.07 alpha or ≤0.7px line-height, i.e. not perceivable):

| Merged into | Absorbed |
|---|---|
| `border/faint` (sand @20%) | @22%, @18% |
| `border/card` (sand @28%) | @25% |
| `border/subtle` (sand @35%) | @30% |
| `border/gold-weak` (gold @18%) | @15%, @20%, @22% |
| `border/gold-subtle` (gold @35%) | @28%, @40% |
| `bg/subtle` (white @5%) | @2%, @3%, @4%, @7% |
| `body-sm` (13/19.5) | 13/20.15, 13/20.8, 13/145% |
| `body` (14/21) | 14/auto, 14/19.5, 14/21.7, 14/25.2 |
| `label` (14/21) | 14/18, 14/18.9, 14/19.5, 14/20.3 |
| `caption` (12/18) | 12/18.6, 12/19.5 |
| `h1` (28/36.4) | 28/42, 28/145%, 30/145%, 26/39 |

63 distinct type signatures were condensed to 24 text styles.

## Two colours worth revisiting

`bg/danger-tint` (`#ff0e00` @15%) and `bg/success-tint` (`#00ff5e` @20%) are
fully-saturated RGB primaries that sit outside the warm palette. They were
captured at their existing values so applying tokens changed nothing visually —
but now that they are tokens, they can be corrected in one place. Suggested
replacements: `red/600` `#c03a2b` and `green/700` `#007722`.

## Relationship to the other systems in these files

- The Figma file already contains a **`🎨 Foundations`** set (`Primitives`,
  `Color`, `Spacing`, `Radius`, `color/*` styles, `text/*` styles). It was left
  untouched. Its text styles use Noto Serif/Sans TC while this section is drawn
  in Inter, and four of its Light values disagree with what the section actually
  renders — hence the separate `Restaurant/` namespace.
- The repository's existing `tokens.css` / `tailwind.config.js` come from a
  different Figma file (`C9EZHW6LDMqUM5s8jQVDtf`, the FJ 會員後台 login UI) and
  are unrelated to these tokens.

## Applied so far

Tokens are applied to two reference screens, at 100% coverage (no hard-coded
fills, strokes or type left):

| Screen | Node | fills | strokes | text |
|---|---|---|---|---|
| `Restaurant/ search reservation` | `668:5213` | 22 | 7 | 15 |
| `Restaurant/contact info` | `668:3955` | 47 | 8 | 36 |

The remaining 33 screens still carry hard-coded values. The mapping tables used
to convert a screen are deterministic, so the same pass can be run over them.
