'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

type Tab = 'b2c' | 'b2b'

// ── Password rules ─────────────────────────────────────────────────────────────
const RULES = [
  { key: 'len',    label: '8 個字元以上', test: (v: string) => v.length >= 8 },
  { key: 'letter', label: '包含字母',     test: (v: string) => /[a-zA-Z]/.test(v) },
  { key: 'number', label: '包含數字',     test: (v: string) => /[0-9]/.test(v) },
  { key: 'symbol', label: '包含符號',     test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
]

function PasswordStrengthBadges({ value }: { value: string }) {
  if (!value) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2" role="status" aria-live="polite" aria-label="密碼強度規則">
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
              <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {r.label}
          </span>
        )
      })}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [tab, setTab] = useState<Tab>('b2c')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] transition-colors duration-200 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-8 transition-colors duration-200">
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-orange-500">W-BOX</span>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[var(--border)] mb-6" role="tablist" aria-label="註冊類型">
            <button
              type="button"
              onClick={() => setTab('b2c')}
              aria-selected={tab === 'b2c'}
              role="tab"
              className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-200 ${
                tab === 'b2c'
                  ? 'bg-orange-500 text-white'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              }`}
            >
              個人註冊 (B2C)
            </button>
            <button
              type="button"
              onClick={() => setTab('b2b')}
              aria-selected={tab === 'b2b'}
              role="tab"
              className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-200 ${
                tab === 'b2b'
                  ? 'bg-orange-500 text-white'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              }`}
            >
              企業註冊 (B2B)
            </button>
          </div>

          <div className="space-y-4">
            {tab === 'b2c' ? (
              <>
                <InputField id="name" label="姓名" placeholder="請輸入姓名" />
                <InputField id="email" label="電子郵件" placeholder="請輸入電子郵件" type="email" />
                <InputField id="phone" label="手機號碼" placeholder="請輸入手機號碼" type="tel" />
                <PasswordField
                  id="password" label="密碼" placeholder="請輸入密碼"
                  show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                  value={password} onChange={setPassword}
                  showStrength
                />
                <PasswordField
                  id="confirm-password" label="確認密碼" placeholder="請再次輸入密碼"
                  show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </>
            ) : (
              <>
                <InputField id="company" label="公司名稱" placeholder="請輸入公司名稱" />
                <InputField id="tax-id" label="統一編號" placeholder="請輸入統一編號" />
                <InputField id="contact-name" label="聯絡人姓名" placeholder="請輸入聯絡人姓名" />
                <InputField id="company-email" label="公司電子郵件" placeholder="請輸入公司電子郵件" type="email" />
                <InputField id="phone" label="手機號碼" placeholder="請輸入手機號碼" type="tel" />
                <PasswordField
                  id="password" label="密碼" placeholder="請輸入密碼"
                  show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                  value={password} onChange={setPassword}
                  showStrength
                />
                <PasswordField
                  id="confirm-password" label="確認密碼" placeholder="請再次輸入密碼"
                  show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </>
            )}
          </div>

          <button
            type="button"
            className="w-full mt-6 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 outline-none"
          >
            立即註冊
          </button>

          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-[var(--border)]" />
            <span className="mx-4 text-sm text-[var(--muted)]">或繼續使用</span>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-[#1E1C2E] border border-[var(--border)] rounded-xl hover:bg-gray-50 dark:hover:bg-[#2E2B3F] text-[var(--text)] font-medium transition-colors duration-200 focus:ring-2 focus:ring-orange-500 outline-none"
              aria-label="使用 Google 註冊"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              使用 Google 註冊
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-white transition-colors duration-200 hover:opacity-90 focus:ring-2 focus:ring-green-500 outline-none"
              style={{ backgroundColor: '#06C755' }}
              aria-label="使用 LINE 註冊"
            >
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              使用 LINE 註冊
            </button>
          </div>

          <div className="text-center mt-5">
            <Link
              href="/login"
              className="text-sm text-[var(--muted)] hover:text-orange-500 transition-colors duration-200"
            >
              ← 返回登入
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function InputField({
  id,
  label,
  placeholder,
  type = 'text',
}: {
  id: string
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text)] mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-label={label}
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors duration-200"
      />
    </div>
  )
}

function PasswordField({
  id,
  label,
  placeholder,
  show,
  onToggle,
  value,
  onChange,
  showStrength = false,
}: {
  id: string
  label: string
  placeholder: string
  show: boolean
  onToggle: () => void
  value?: string
  onChange?: (v: string) => void
  showStrength?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text)] mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          aria-label={label}
          value={value ?? undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="w-full px-4 py-3 pr-12 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors duration-200"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? '隱藏密碼' : '顯示密碼'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-200"
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {showStrength && <PasswordStrengthBadges value={value ?? ''} />}
    </div>
  )
}
