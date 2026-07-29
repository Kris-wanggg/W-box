/**
 * Tailwind CSS configuration
 *
 * Two token families live here:
 *
 *  1. The original semantic tokens generated from the Figma file
 *     "FJ會員後台 — 登入介面設計" (C9EZHW6LDMqUM5s8jQVDtf). These stay wired to the
 *     CSS custom properties in ./tokens.css (Light in :root, Dark in .dark,
 *     toggled via the `darkMode: 'class'` strategy).
 *
 *  2. The reservation scale generated from "Rastaurant Reservation system"
 *     (f27j5bQ9NnxC6aiUPxt5Ip). Every value below is copied from that file —
 *     the `Restaurant/*` variable collection first, and where a component
 *     paints a colour the collection does not publish, the value read off that
 *     component (each one is attributed in a comment). Nothing here is invented:
 *     if a colour is needed and neither source has it, the fix is to add it to
 *     the Figma collection, not to pick one here.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue,html}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Login design system (tokens.css) ──────────────────────────────
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
        },
        border: 'var(--color-border)',
        divider: 'var(--color-divider)',
        primary: 'var(--color-primary)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        placeholder: 'var(--color-placeholder)',
        input: {
          bg: 'var(--color-input-bg)',
          border: 'var(--color-input-border)',
        },
        status: {
          error: 'var(--color-status-error)',
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
        },

        // ── Restaurant: Figma variable collection ─────────────────────────
        // bg/brand, border/active, text/accent all resolve to the same olive.
        brand: '#735C00',
        // The Meal Detail line on choose-set/default paints the accent at 70%.
        'brand-soft': 'rgba(115,92,0,0.70)',
        // bg/veil (70%) — the page ground and the sticky header.
        canvas: '#FBF9F9',
        // bg/surface 84% · bg/footer 72% · bg/input 6% · bg/subtle 5%
        veil: 'rgba(251,249,249,0.70)',
        card: 'rgba(255,255,255,0.84)',
        footerbg: 'rgba(255,255,255,0.72)',
        inputbg: 'rgba(255,255,255,0.06)',
        subtle: 'rgba(255,255,255,0.05)',
        // bg/muted
        muted: '#EFEDED',
        // text/*
        ink: {
          DEFAULT: '#1B1C1C', // text/primary
          secondary: '#6E6252', // text/secondary
          tertiary: '#4D4635', // text/tertiary
          placeholder: 'rgba(27,28,28,0.50)', // text/placeholder
        },
        // border/* + bg/divider
        line: {
          DEFAULT: '#D0C5AF', // border/default, bg/divider
          subtle: 'rgba(208,197,175,0.35)', // border/subtle
          faint: 'rgba(208,197,175,0.20)', // border/faint
          gold: 'rgba(201,146,42,0.35)', // border/gold-weak, at the alpha the Tag uses
        },

        // ── Restaurant: values published by components, not the collection ─
        // `[Comp] Radio` / `[Comp] Checkbox`, selected state.
        selected: '#C9922A',
        // `[Comp] Button (確認取消訂位)`.
        destructive: '#C21400',
        // The 成功 value on `Restaurant/ pay-success` (#072).
        ok: '#007722',
        // `[Comp] Button (取消訂位)` — the action-row outline uses text/secondary
        // for its border, not border/default.
        // `[Comp] Tag`, its three states.
        tag: {
          'confirm-bg': 'rgba(255,234,151,0.42)',
          'confirm-border': 'rgba(201,146,42,0.35)',
          'success-bg': 'rgba(0,255,94,0.20)',
          'success-border': 'rgba(5,95,8,0.35)',
          'warning-bg': 'rgba(255,14,0,0.15)',
          'warning-border': 'rgba(255,14,0,0.35)',
        },
        // `[Comp] Checkbox`, locked-out state.
        off: {
          bg: 'rgba(255,255,255,0.03)',
          border: 'rgba(255,255,255,0.10)',
          box: 'rgba(27,28,28,0.20)',
          text: 'rgba(27,28,28,0.25)',
        },
        // TimeSlots, unavailable slot.
        unavailable: {
          border: 'rgba(208,197,175,0.30)',
          text: 'rgba(77,70,53,0.30)',
        },
      },

      borderRadius: {
        // ⬡ Border Radius collection from the login design system. These
        // override Tailwind's defaults, so the reservation screens must NOT
        // use rounded-sm/md/lg — they would silently pick up these values.
        sm: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        pill: '100px',

        // Restaurant radii, read off the components.
        chip: '6px', // Tag (success/warning), step badge
        box: '4px', // the 16px checkbox / radio-dot square
        control: '8px', // buttons, inputs, steppers, radio + checkbox chips
        tile: '10px', // meal / drink / payment row cards
        panel: '12px', // surface cards
      },

      boxShadow: {
        card: '0px 4px 20px 0px rgba(0,0,0,0.05)',
        pop: '0px 12px 32px 0px rgba(0,0,0,0.12)',
      },

      maxWidth: {
        content: '1240px',
        footer: '1280px',
        aside: '420px',
      },

      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Login design system text styles
        'heading-h1': ['24px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }],
        'button-primary': ['16px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }],
        'body-base': ['14px', { lineHeight: '1', fontWeight: '400', letterSpacing: '0' }],
        'body-small': ['13px', { lineHeight: '1', fontWeight: '400', letterSpacing: '0' }],
        'label-medium': ['13px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0' }],
        'link-semibold': ['13px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }],
        caption: ['12px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0' }],

        // Restaurant text styles, from the `Restaurant/*` type variables.
        h2: ['24px', { lineHeight: '24px', fontWeight: '700' }],
        'h2-loose': ['22px', { lineHeight: '33px', fontWeight: '700' }],
        h3: ['20px', { lineHeight: '24px', fontWeight: '700' }],
        h4: ['18px', { lineHeight: '27px', fontWeight: '600' }],
        'h4-strong': ['18px', { lineHeight: '27px', fontWeight: '700' }],
        h5: ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        body: ['14px', { lineHeight: '21px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '19.5px', fontWeight: '400' }],
        label: ['14px', { lineHeight: '21px', fontWeight: '500' }],
        'label-sm': ['13px', { lineHeight: '19.5px', fontWeight: '500' }],
        'label-xs': ['12px', { lineHeight: '18px', fontWeight: '500' }],
        cap: ['12px', { lineHeight: '18px', fontWeight: '400' }],
        overline: ['12px', { lineHeight: '18px', fontWeight: '900', letterSpacing: '2.4px' }],
        btn: ['16px', { lineHeight: '23.2px', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
