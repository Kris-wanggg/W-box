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
 *  2. The `brand`/`ink`/`line`/… scale generated from the Figma file
 *     "Rastaurant Reservation system" (f27j5bQ9NnxC6aiUPxt5Ip), which is what
 *     the reservation screens in src/pages use. Sourced from the Figma
 *     variables `Restaurant/bg/brand` (#735C00) and `Restaurant/text/inverse`
 *     (#FFFFFF) plus the raw fills on the frames.
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

        // ── Restaurant reservation design system ──────────────────────────
        // Restaurant/bg/brand
        brand: {
          DEFAULT: '#735C00',
          hover: '#5E4B00',
          soft: 'rgba(115,92,0,0.70)',
          tint: 'rgba(115,92,0,0.08)',
        },
        // page + card surfaces
        canvas: '#FBF9F9',
        card: 'rgba(255,255,255,0.84)',
        // text ramp
        ink: {
          DEFAULT: '#1B1C1C',
          soft: '#4D4635',
          muted: '#6E6252',
        },
        // hairlines
        line: {
          DEFAULT: '#D0C5AF',
          soft: 'rgba(208,197,175,0.35)',
          faint: 'rgba(208,197,175,0.22)',
        },
        badge: '#EFEDED',
        // status colours used by the 候補 / 額滿 / 付款 states
        info: '#2F6F8F',
        warn: '#B4791B',
        danger: '#B3261E',
        ok: '#2E7D4F',
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

        // Restaurant reservation radii, read off the frames.
        chip: '6px', // step badge, option chips, radio pills
        control: '8px', // buttons, inputs, steppers, radio boxes, meal icons
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
      },
    },
  },
  plugins: [],
};
