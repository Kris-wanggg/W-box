/**
 * Tailwind CSS configuration
 *
 * Design tokens generated from Figma:
 * "FJ會員後台 — 登入介面設計" › Color Variables + Typography
 * https://www.figma.com/design/C9EZHW6LDMqUM5s8jQVDtf
 *
 * Token naming mirrors the Figma variable groups (Primary, Surface, Text,
 * Border, Tab, Status, Toggle). Dark / Light theme pairs are exposed as
 * `*-dark` / `*-light` so they can be selected via the `dark:` variant or
 * directly by class name.
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
        // Primary / brand
        primary: {
          DEFAULT: '#F97316', // Primary/Dark
          dark: '#F97316',    // Primary/Dark
          light: '#CC7E5E',   // Primary/Light
        },

        // Surfaces / backgrounds
        surface: {
          dark: '#1E1C2E',     // Surface/Dark
          'alt-dark': '#1A1625', // Surface/Alt-Dark
        },

        // Text
        text: {
          'on-primary': '#FFFFFF',   // Text/On-Primary
          subdued: '#8B8AA0',        // Text/Subdued
          'primary-dark': '#F8F8F8', // Text/Primary-Dark
          'primary-light': '#13111E',// Text/Primary-Light
          'muted-dark': '#E4E2F0',   // Text/Muted-Dark
          'muted-light': '#767676',  // Text/Muted-Light
          'placeholder-light': '#6B697E', // Text/Placeholder-Light
        },

        // Borders
        border: {
          'input-dark': '#2E2B3F',  // Border/Input-Dark
          'input-light': '#D1CFDF', // Border/Input-Light
        },

        // Tabs
        tab: {
          'active-dark': '#D4600A',         // Tab/Active-Dark
          'active-light': '#CC7E5E',        // Tab/Active-Light
          'background-dark': '#13111E',     // Tab/Background-Dark
          'background-light': '#FDFBF7',    // Tab/Background-Light
          'inactive-text-light': '#6B697E', // Tab/Inactive-Text-Light
        },

        // Toggle
        toggle: {
          knob: '#FFFFFF',          // Toggle/Knob
          'track-off-light': '#E4E2F0', // Toggle/Track-Off-Light
        },

        // Status / badges
        status: {
          success: '#22C55E', // Status/Success
          error: '#EF4444',   // Status/Error-Dark-Border
          'badge-default-dark': '#2E2B3F',  // Status/Badge-Default-Dark
          'badge-default-light': '#E4E2F0', // Status/Badge-Default-Light
          'badge-neutral-fill': '#8B8AA0',  // Status/Badge-Neutral-Fill
          'badge-neutral-border': '#8B8AA0',// Status/Badge-Neutral-Border
          'badge-focused-fill': '#F97316',  // Status/Badge-Focused-Fill
          'badge-focused-border': '#F97316',// Status/Badge-Focused-Border
          'badge-success-fill': '#22C55E',  // Status/Badge-Success-Fill
          'badge-success-border': '#22C55E',// Status/Badge-Success-Border
          'badge-error-fill': '#EF4444',    // Status/Badge-Error-Fill
          'badge-error-border': '#EF4444',  // Status/Badge-Error-Border
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // Typography presets from Figma text styles.
      // Format: [fontSize, { lineHeight, fontWeight, letterSpacing }]
      fontSize: {
        // Heading/H1 — Inter Semi Bold 24
        'heading-h1': ['24px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }],
        // Button/Primary — Inter Semi Bold 16
        'button-primary': ['16px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }],
        // Body/Base — Inter Regular 14
        'body-base': ['14px', { lineHeight: '1', fontWeight: '400', letterSpacing: '0' }],
        // Body/Small — Inter Regular 13
        'body-small': ['13px', { lineHeight: '1', fontWeight: '400', letterSpacing: '0' }],
        // Label/Medium — Inter Medium 13
        'label-medium': ['13px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0' }],
        // Link/SemiBold — Inter Semi Bold 13
        'link-semibold': ['13px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0' }],
        // Caption — Inter Medium 12
        'caption': ['12px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0' }],
      },
    },
  },
  plugins: [],
};
