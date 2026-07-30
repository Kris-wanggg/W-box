/**
 * Tailwind CSS configuration
 *
 * Design tokens generated from Figma:
 * "FJ會員後台 — 登入介面設計"
 * https://www.figma.com/design/C9EZHW6LDMqUM5s8jQVDtf
 *
 * Source of truth = the semantic Figma variable collections:
 *   • "🎨 Color Tokens"  (15 vars, Light / Dark modes)
 *   • "⬡ Border Radius"  (5 vars)
 *   • Text styles        (7 typography presets)
 *
 * Colors are wired to CSS custom properties (see ./tokens.css). The Light
 * values live in :root, the Dark values in .dark — toggled via the
 * `darkMode: 'class'` strategy. This mirrors the two Figma variable modes.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue,html}',
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // color/background
        background: 'var(--color-background)',
        // color/surface + color/surface-alt
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
        },
        // color/border + color/divider
        border: 'var(--color-border)',
        divider: 'var(--color-divider)',
        // color/primary
        primary: 'var(--color-primary)',
        // Restaurant Reservation System brand ramp (see ./tokens.css)
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
          active: 'var(--color-brand-active)',
          tint: 'var(--color-brand-tint)',
          'tint-strong': 'var(--color-brand-tint-strong)',
          contrast: 'var(--color-brand-contrast)',
        },
        // color/text-*
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        // color/placeholder
        placeholder: 'var(--color-placeholder)',
        // color/input-*
        input: {
          bg: 'var(--color-input-bg)',
          border: 'var(--color-input-border)',
        },
        // color/status-*  (identical in both modes)
        status: {
          error: 'var(--color-status-error)',
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
        },
      },

      // ⬡ Border Radius collection.
      // NOTE: sm/md/lg/xl intentionally override Tailwind defaults to match
      // the design system; `pill` is an added token.
      borderRadius: {
        sm: '10px',   // radius/sm
        md: '12px',   // radius/md
        lg: '16px',   // radius/lg
        xl: '20px',   // radius/xl
        pill: '100px',// radius/pill
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // Typography presets from Figma text styles.
      // Format: [fontSize, { lineHeight, fontWeight, letterSpacing }]
      fontSize: {
        'heading-h1': ['24px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }], // Heading/H1
        'button-primary': ['16px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }], // Button/Primary
        'body-base': ['14px', { lineHeight: '1', fontWeight: '400', letterSpacing: '0' }], // Body/Base
        'body-small': ['13px', { lineHeight: '1', fontWeight: '400', letterSpacing: '0' }], // Body/Small
        'label-medium': ['13px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0' }], // Label/Medium
        'link-semibold': ['13px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }], // Link/SemiBold
        'caption': ['12px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0' }], // Caption

        // Restaurant Reservation System text styles. Unlike the presets
        // above these carry a real line-height, because the copy is
        // Traditional Chinese and wraps across multiple lines.
        'r-h1': ['20px', { lineHeight: '28px', fontWeight: '600' }],   // 選擇餐點 / 聯絡資料
        'r-h2': ['17px', { lineHeight: '24px', fontWeight: '600' }],   // card headings
        'r-body': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'r-label': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'r-note': ['13px', { lineHeight: '19.5px', fontWeight: '400' }],
        'r-button': ['16px', { lineHeight: '23.2px', fontWeight: '500' }], // Figma: Inter Medium 16 / 23.2
      },

      maxWidth: {
        // Figma "Content Row" — 1240px inside a 1550px frame
        content: '1240px',
      },
    },
  },
  plugins: [],
};
