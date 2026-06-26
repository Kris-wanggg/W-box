import { PageShell } from './LoginPage'
import { useState } from 'react'

// ─── LoginSuccessPage ─────────────────────────────────────────────────────────
// Full-page loading state shown after successful login while redirecting.
// (Dark/LoginSuccess/loading)

export default function LoginSuccessPage() {
  const [locale, setLocale] = useState('zh')
  const [isDark, setIsDark] = useState(true)

  return (
    <PageShell
      isDark={isDark}
      locale={locale}
      onLocaleToggle={setLocale}
      onThemeToggle={() => setIsDark(!isDark)}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Rotating spinner */}
        <svg
          className="animate-spin"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track ring */}
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4"
            className="text-border" />
          {/* Colored arc */}
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="131.9"
            strokeDashoffset="98.9"
            className="text-primary"
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
        </svg>

        <p className="text-body-base text-text-secondary">登入中，請稍候…</p>
      </div>
    </PageShell>
  )
}
