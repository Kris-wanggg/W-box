// W-BOX Design System — Color Tokens
// Extracted from Figma: FJ會員後台 — 登入介面設計

export const colors = {
  // ── Brand / Primary ──────────────────────────────────────────────────
  brand: {
    dark: '#f97316',   // orange — used in dark theme
    light: '#cc7e5e',  // terracotta — used in light theme
  },

  // ── Neutral Palette ──────────────────────────────────────────────────
  neutral: {
    900: '#13111e',
    800: '#1a1625',
    700: '#1e1c2e',
    600: '#2e2b3f',
    500: '#8b8aa0',
    400: '#6b697e',
    300: '#d1cfdf',
    200: '#e4e2f0',
    100: '#f8f8f8',
    50:  '#fdfbf7',
    white: '#ffffff',
  },

  // ── Semantic — Dark Theme ─────────────────────────────────────────────
  dark: {
    background:       '#13111e',
    surface:          '#1e1c2e',
    surfaceAlt:       '#1a1625',
    border:           '#2e2b3f',
    primary:          '#f97316',
    textPrimary:      '#f8f8f8',
    textSecondary:    '#8b8aa0',
    textMuted:        '#e4e2f0',
    inputBackground:  '#13111e',
    inputBorder:      '#2e2b3f',
    placeholder:      '#8b8aa0',
    divider:          '#2e2b3f',
  },

  // ── Semantic — Light Theme ────────────────────────────────────────────
  light: {
    background:       '#fdfbf7',
    surface:          '#ffffff',
    surfaceAlt:       '#ffffff',
    border:           '#e4e2f0',
    primary:          '#cc7e5e',
    textPrimary:      '#13111e',
    textSecondary:    '#6b697e',
    textMuted:        '#767676',
    inputBackground:  '#ffffff',
    inputBorder:      '#d1cfdf',
    placeholder:      '#6b697e',
    divider:          '#e4e2f0',
  },
  // ── Status — shared across both themes ───────────────────────────────
  status: {
    error:   '#ef4444',  // from Dark/Login-Error frame — input border + error text
    success: '#22c55e',
    warning: '#f59e0b',

    // Password strength badge — transparent fill/border
    badge: {
      successFill:   'rgba(34, 197, 94, 0.15)',
      successBorder: 'rgba(34, 197, 94, 0.30)',
      errorFill:     'rgba(239, 68, 68, 0.15)',   // previously missing
      errorBorder:   'rgba(239, 68, 68, 0.30)',   // previously missing
      defaultLight:  'rgba(228, 226, 240, 0.80)',
      defaultDark:   'rgba(46, 43, 63, 0.80)',
    },
  },
} as const;

export type ColorTheme = 'dark' | 'light';
export type ThemeColors = typeof colors.dark & typeof colors.light;
