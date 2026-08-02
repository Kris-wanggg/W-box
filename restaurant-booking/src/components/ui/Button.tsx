import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Figma: `[Comp] Button`
 *
 * Interaction states are required by CLAUDE.md's Definition of Done:
 * hover / active / focus-visible / disabled are all styled here so screens
 * never re-declare them.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-inverse border border-primary hover:opacity-90 active:opacity-80 disabled:bg-surface-muted disabled:text-text-muted disabled:border-border',
  secondary:
    'bg-surface text-text-secondary border border-border hover:bg-surface-alt active:bg-surface-muted disabled:text-text-muted',
  ghost:
    'bg-transparent text-text-secondary border border-transparent hover:bg-surface-alt active:bg-surface-muted disabled:text-text-muted',
  danger:
    'bg-surface text-status-error border border-status-error hover:bg-surface-alt active:bg-surface-muted disabled:text-text-muted disabled:border-border',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-body-small',
  md: 'h-11 px-4 text-body-base',
  lg: 'h-12 px-6 text-button-primary',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    type = 'button',
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
});
