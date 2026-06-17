// Generates CSS custom properties from design tokens.
// Usage: inject <style> tag in _document.tsx or import in globals.css.

export const cssVariables = `
:root {
  /* Font */
  --font-family-base: Inter, sans-serif;

  /* Font sizes */
  --font-size-xs:   12px;
  --font-size-sm:   13px;
  --font-size-base: 14px;
  --font-size-md:   16px;
  --font-size-xl:   24px;

  /* Font weights */
  --font-weight-regular:   400;
  --font-weight-medium:    500;
  --font-weight-semibold:  600;
}

[data-theme="dark"] {
  --color-background:      #13111e;
  --color-surface:         #1e1c2e;
  --color-surface-alt:     #1a1625;
  --color-border:          #2e2b3f;
  --color-primary:         #f97316;
  --color-text-primary:    #f8f8f8;
  --color-text-secondary:  #8b8aa0;
  --color-text-muted:      #e4e2f0;
  --color-input-bg:        #13111e;
  --color-input-border:    #2e2b3f;
  --color-placeholder:     #8b8aa0;
  --color-divider:         #2e2b3f;
}

[data-theme="light"] {
  --color-background:      #fdfbf7;
  --color-surface:         #ffffff;
  --color-surface-alt:     #ffffff;
  --color-border:          #e4e2f0;
  --color-primary:         #cc7e5e;
  --color-text-primary:    #13111e;
  --color-text-secondary:  #6b697e;
  --color-text-muted:      #767676;
  --color-input-bg:        #ffffff;
  --color-input-border:    #d1cfdf;
  --color-placeholder:     #6b697e;
  --color-divider:         #e4e2f0;
}
`;
