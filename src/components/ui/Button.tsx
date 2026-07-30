import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Figma: `[Comp] Button` */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the container width — the Figma CTAs are full-bleed. */
  block?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-brand-contrast hover:bg-brand-hover active:bg-brand-active ' +
    'disabled:bg-brand/40 disabled:text-brand-contrast/70',
  secondary:
    'bg-surface text-text-primary border border-input-border ' +
    'hover:border-brand hover:text-brand active:bg-brand-tint ' +
    'disabled:text-text-muted disabled:border-border',
  ghost:
    'bg-transparent text-text-secondary hover:text-brand hover:bg-brand-tint ' +
    'active:bg-brand-tint-strong disabled:text-text-muted',
  danger:
    'bg-surface text-status-error border border-status-error/40 ' +
    'hover:bg-status-error/10 hover:border-status-error active:bg-status-error/20 ' +
    'disabled:text-text-muted disabled:border-border',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-r-note rounded-sm',
  md: 'h-10 px-4 text-r-label rounded-md',
  lg: 'h-12 px-5 text-r-button rounded-md',
};

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    />
  );
}
