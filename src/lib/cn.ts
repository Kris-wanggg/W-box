type ClassValue = string | false | null | undefined;

/** Minimal class joiner — keeps conditional Tailwind lists readable. */
export function cn(...values: ClassValue[]): string {
  return values.filter((v): v is string => typeof v === 'string' && v.length > 0).join(' ');
}
