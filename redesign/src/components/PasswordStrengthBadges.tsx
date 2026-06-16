// Shared password-strength badge component used by login and register pages.

const RULES = [
  { key: 'len',    label: '8 個字元以上', test: (v: string) => v.length >= 8 },
  { key: 'letter', label: '包含字母',     test: (v: string) => /[a-zA-Z]/.test(v) },
  { key: 'number', label: '包含數字',     test: (v: string) => /[0-9]/.test(v) },
  { key: 'symbol', label: '包含符號',     test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
]

export function PasswordStrengthBadges({ value }: { value: string }) {
  if (!value) return null
  return (
    <div
      className="flex flex-wrap gap-2 mt-2"
      role="status"
      aria-live="polite"
      aria-label="密碼強度規則"
    >
      {RULES.map((r) => {
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
