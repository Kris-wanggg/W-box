'use client'

import { useI18n } from './I18nProvider'

export function usePasswordRules() {
  const { t } = useI18n()
  return [
    { key: 'len',    label: t.ruleLen,    test: (v: string) => v.length >= 8 },
    { key: 'letter', label: t.ruleLetter, test: (v: string) => /[a-zA-Z]/.test(v) },
    { key: 'number', label: t.ruleNumber, test: (v: string) => /[0-9]/.test(v) },
    { key: 'symbol', label: t.ruleSymbol, test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
  ]
}

export function PasswordStrengthBadges({ value }: { value: string }) {
  const rules = usePasswordRules()
  if (!value) return null
  return (
    <div
      className="flex flex-wrap gap-2 mt-2"
      role="status"
      aria-live="polite"
      aria-label="密碼強度規則"
    >
      {rules.map((r) => {
        const ok = r.test(value)
        return (
          <span
            key={r.key}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              ok
                ? 'bg-green-500/15 text-green-500 border border-green-500/30'
                : 'bg-[var(--border)] text-[var(--muted)] border border-transparent'
            }`}
            aria-label={`${r.label}：${ok ? '符合' : '未符合'}`}
          >
            {ok && (
              <svg
                viewBox="0 0 12 12"
                className="w-3 h-3 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {r.label}
          </span>
        )
      })}
    </div>
  )
}
