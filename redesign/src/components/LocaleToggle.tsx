'use client'

import { useI18n, type Locale } from './I18nProvider'

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'zh-TW', label: '繁中' },
  { value: 'en',    label: 'EN'   },
]

export default function LocaleToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <div
      className="flex items-center rounded-xl overflow-hidden border border-[var(--border)] text-xs font-medium"
      role="group"
      aria-label="語系切換"
    >
      {LOCALES.map((l) => (
        <button
          key={l.value}
          type="button"
          onClick={() => setLocale(l.value)}
          aria-pressed={locale === l.value}
          className={`px-3 py-1.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset ${
            locale === l.value
              ? 'bg-orange-500 text-white'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
