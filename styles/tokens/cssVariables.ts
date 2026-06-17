// Generates CSS custom properties from design tokens.
// Usage: inject <style> tag in _document.tsx or import in globals.css.

export const cssVariables = `
:root {
  /* Status — shared across both themes */
  --color-status-error:   #ef4444;
  --color-status-success: #22c55e;
  --color-status-warning: #f59e0b;

  /* Shared cross-theme */
  --color-text-subdued:    #8b8aa0;
  --color-text-on-primary: #ffffff;

  /* Toggle */
  --color-toggle-knob: #ffffff;

  /* Tab */
  --color-tab-bg-dark:           #13111e;
  --color-tab-bg-light:          #fdfbf7;
  --color-tab-active-dark:       #f97316;
  --color-tab-active-light:      #cc7e5e;
  --color-tab-inactive-text-dark:  #8b8aa0;
  --color-tab-inactive-text-light: #6b697e;

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
  --color-toggle-track: #f97316;
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
  --color-toggle-track: #e4e2f0;
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
