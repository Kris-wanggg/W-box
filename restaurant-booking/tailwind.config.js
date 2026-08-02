/**
 * Tailwind CSS configuration — Restaurant Booking
 *
 * Design tokens generated from Figma:
 * "Rastaurant Reservation system" — section "28 section v3"
 * https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip?node-id=923-1753
 *
 * Colors are wired to CSS custom properties (see ./src/tokens.css) so the
 * Light values live in :root and Dark values in .dark, toggled via the
 * `darkMode: 'class'` strategy.
 *
 * Per CLAUDE.md: components must never invent raw #HEX values — every colour
 * used in a component has to resolve through one of the tokens below.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue,html}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
          muted: 'var(--color-surface-muted)',
        },
        border: 'var(--color-border)',
        divider: 'var(--color-divider)',
        // Restaurant/bg/brand
        primary: {
          DEFAULT: 'var(--color-primary)',
          soft: 'var(--color-primary-soft)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          // Restaurant/text/inverse
          inverse: 'var(--color-text-inverse)',
        },
        placeholder: 'var(--color-placeholder)',
        input: {
          bg: 'var(--color-input-bg)',
          border: 'var(--color-input-border)',
        },
        overlay: 'var(--color-overlay)',
        status: {
          error: 'var(--color-status-error)',
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
        },
      },

      borderRadius: {
        sm: '6px', // Step Badge
        md: '8px', // Stepper / Day Button
        lg: '12px',
        xl: '16px',
        pill: '100px',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // Typography presets from the Figma text styles.
      // Format: [fontSize, { lineHeight, fontWeight }]
      fontSize: {
        'heading-h1': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'heading-h2': ['20px', { lineHeight: '24px', fontWeight: '700' }],
        'heading-h3': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        // Restaurant/button — Inter Medium 16 / 23.2
        'button-primary': ['16px', { lineHeight: '23.2px', fontWeight: '500' }],
        'body-base': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label-medium': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
