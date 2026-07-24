/**
 * Inline SVG icons.
 *
 * The Figma design references icon assets on Figma's CDN, which is not
 * reachable from this build environment. These stroke icons are hand-authored
 * to match the design's simple line style (currentColor so they inherit the
 * gold/cream text color of their container).
 */
import type { ReactNode } from 'react';

type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function Svg({
  size = 18,
  strokeWidth = 1.6,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 5c0-.6.4-1 1-1h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3c0 .6-.4 1-1 1A15 15 0 0 1 4 5Z" />
    </Svg>
  );
}

export function ChevronLeftIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </Svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a5 5 0 0 0-4-4.9" />
    </Svg>
  );
}

export function MinusIcon(p: IconProps) {
  return (
    <Svg strokeWidth={2} {...p}>
      <path d="M5 12h14" />
    </Svg>
  );
}

export function PlusIcon(p: IconProps) {
  return (
    <Svg strokeWidth={2} {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Svg strokeWidth={2} {...p}>
      <path d="M5 12.5l4.5 4.5L19 6.5" />
    </Svg>
  );
}

export function ChevronDownIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function ChevronUpIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 15l6-6 6 6" />
    </Svg>
  );
}

/** Plate with fork & knife — the set-meal thumbnail glyph. */
export function UtensilsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 3v7a2 2 0 0 0 2 2h0v9M7 3v6M9 3v6" />
      <path d="M17 3c-1.5 0-2.5 2-2.5 5 0 2 1 3 2.5 3v9" />
    </Svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </Svg>
  );
}

export function EditIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M13.5 6.5l3 3" />
    </Svg>
  );
}
