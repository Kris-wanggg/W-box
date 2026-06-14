/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Color Variables (from Figma: Personal Finance Tracker Mobile UI) ───
      colors: {
        brand: {
          navy: '#0A142A', // Background/Navy (main app background)
        },
        background: {
          card:   '#121F39', // Background/Card
          border: '#1C2A47', // Background/Border / Divider
        },
        accent: {
          green:  '#22C57D', // Accent/Green (income, positive, active)
          red:    '#EF4444', // Accent/Red   (expense, negative, danger)
          yellow: '#FABA22', // Accent/Yellow (transfer, warning)
          'green-muted': 'rgba(34, 197, 125, 0.15)',  // Accent/Green Background (icon bg)
          'red-muted':   'rgba(239, 68,  68,  0.15)', // Accent/Red Background   (icon bg)
          'yellow-muted':'rgba(250, 186, 34,  0.18)', // Accent/Yellow Muted     (icon bg)
          'white-muted': 'rgba(255, 255, 255, 0.18)', // Accent/White Muted      (icon bg)
        },
        text: {
          primary:   '#FFFFFF',                      // Text/Primary
          secondary: 'rgba(255, 255, 255, 0.55)',    // Text/Secondary (muted labels)
          tertiary:  'rgba(255, 255, 255, 0.30)',    // Text/Tertiary  (inactive nav, date group)
        },
      },

      // ─── Typography (from Figma design tokens) ───────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label-sm':    ['10px', { lineHeight: '1', letterSpacing: '0' }],
        'caption':     ['12px', { lineHeight: '1', letterSpacing: '0' }],
        'body-sm':     ['13px', { lineHeight: '1', letterSpacing: '0' }],
        'body-md':     ['14px', { lineHeight: '1', letterSpacing: '0' }],
        'body-lg':     ['15px', { lineHeight: '1', letterSpacing: '0' }],
        'body-xl':     ['16px', { lineHeight: '1', letterSpacing: '0' }],
        'label-status':['15px', { lineHeight: '1', letterSpacing: '0' }],
        'icon-sm':     ['16px', { lineHeight: '1', letterSpacing: '0' }],
        'icon-md':     ['18px', { lineHeight: '1', letterSpacing: '0' }],
        'icon-lg':     ['22px', { lineHeight: '1', letterSpacing: '0' }],
        'heading-md':  ['20px', { lineHeight: '1', letterSpacing: '0' }],
        'heading-lg':  ['22px', { lineHeight: '1', letterSpacing: '0' }],
        'heading-xl':  ['36px', { lineHeight: '1', letterSpacing: '0' }],
      },
      fontWeight: {
        normal:    '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
      },

      borderRadius: {
        'card':   '20px',
        'tile':   '16px',
        'chip':   '20px',
        'inner':  '12px',
        'tag':    '10px',
        'xs':     '6px',
      },

      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
        '22':  '88px',
        '83':  '332px',
        '97':  '388px',
      },

      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
