'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import LocaleToggle from '@/components/LocaleToggle'
import { useI18n } from '@/components/I18nProvider'

export default function ForgotPasswordPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] transition-colors duration-200 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end items-center gap-2 mb-4">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-8 transition-colors duration-200">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-orange-500">{t.brand}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{t.brandSub}</div>
          </div>
          <h1 className="text-xl font-bold text-[var(--text)] text-center mb-2">{t.forgotTitle}</h1>
          <p className="text-sm text-[var(--muted)] text-center mb-6">{t.forgotDesc}</p>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-[var(--text)] mb-1">
              {t.codeLabel}
            </label>
            <input
              id="code"
              type="text"
              placeholder={t.codePlaceholder}
              aria-label={t.codeLabel}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors duration-200"
            />
          </div>
          <button
            type="button"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 outline-none mb-4"
          >
            {t.sendBtn}
          </button>
          <div className="text-center">
            <Link href="/login" className="text-sm text-[var(--muted)] hover:text-orange-500 transition-colors duration-200">
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
