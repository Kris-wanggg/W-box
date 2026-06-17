// W-BOX Design System — Typography Tokens
// Extracted from Figma: FJ會員後台 — 登入介面設計

export const fontFamily = {
  base: ['Inter', 'sans-serif'],
} as const;

export const fontWeight = {
  regular:  400,
  medium:   500,
  semiBold: 600,
} as const;

export const fontSize = {
  xs:   '12px',  // locale toggle, divider label, subtitle text
  sm:   '13px',  // input labels, body small
  base: '14px',  // input placeholder, body
  md:   '16px',  // primary button label
  xl:   '24px',  // page/card heading
} as const;

export const lineHeight = {
  normal: 'normal',
} as const;

// ── Composed Text Styles ────────────────────────────────────────────────

export const textStyles = {
  heading: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.xl,
    fontWeight:  fontWeight.semiBold,
    lineHeight:  lineHeight.normal,
  },
  bodyBase: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.base,
    fontWeight:  fontWeight.regular,
    lineHeight:  lineHeight.normal,
  },
  bodySmall: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.sm,
    fontWeight:  fontWeight.regular,
    lineHeight:  lineHeight.normal,
  },
  labelMedium: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.sm,
    fontWeight:  fontWeight.medium,
    lineHeight:  lineHeight.normal,
  },
  buttonPrimary: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.md,
    fontWeight:  fontWeight.semiBold,
    lineHeight:  lineHeight.normal,
  },
  linkSemiBold: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.sm,
    fontWeight:  fontWeight.semiBold,
    lineHeight:  lineHeight.normal,
  },
  caption: {
    fontFamily:  fontFamily.base.join(', '),
    fontSize:    fontSize.xs,
    fontWeight:  fontWeight.medium,
    lineHeight:  lineHeight.normal,
  },
} as const;
