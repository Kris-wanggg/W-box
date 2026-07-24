/**
 * Tailwind CSS configuration
 *
 * Theme extracted from the Figma design:
 *   "Restaurant Reservation system" — 第28區中餐廳 線上訂位系統
 *   https://www.figma.com/design/f27j5bQ9NnxC6aiUPxt5Ip
 *
 * The restaurant flow is a dark, warm "fine-dining" theme built around a gold
 * accent (#C9922A / #E4A93C) on near-black backgrounds with cream text.
 * These semantic tokens mirror the raw values used across the Figma frames.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces
        ink: '#0A0A0A', // page background base
        'ink-800': '#12100E', // deep panel
        panel: 'rgba(10,8,6,0.84)', // hero / content card
        'panel-soft': 'rgba(255,255,255,0.05)', // inset info card
        'panel-input': 'rgba(255,255,255,0.04)', // input field bg

        // Gold accent scale
        gold: {
          DEFAULT: '#C9922A',
          light: '#E4A93C',
          soft: 'rgba(201,146,42,0.15)',
        },

        // Text
        cream: '#F5F0E8', // primary text on dark
        'cream-dim': '#C8BFB0', // secondary text
        muted: '#9A8C7E', // notes / captions

        // Status
        success: '#4CAF50',
        danger: '#E5484D',
      },
      // Gold-tinted borders reused across cards / inputs / dividers.
      borderColor: {
        gold: 'rgba(201,146,42,0.4)',
        'gold-soft': 'rgba(201,146,42,0.28)',
        'gold-faint': 'rgba(201,146,42,0.18)',
        'gold-line': 'rgba(201,146,42,0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        badge: '6px',
      },
      boxShadow: {
        hero: '0px 8px 48px 0px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(172.7deg, #C9922A 0%, #E4A93C 60%, #C9922A 100%)',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};
