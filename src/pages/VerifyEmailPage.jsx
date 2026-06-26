import { useState, useEffect, useRef } from 'react'
import { PageShell } from './LoginPage'

// ─── VerifyEmailPage ──────────────────────────────────────────────────────────
// Three views:
//   pending → show user email + resend link      (Dark/VerifyEmail/pending)
//   success → green check + 驗證成功             (Dark/VerifyEmail/success)
//   expired → warning + two action buttons       (Dark/VerifyEmail/expired)

const RESEND_COOLDOWN = 60

function PendingScreen({ email, onResend, resendCooldown, canResend, isDark, locale, onLocaleToggle, onThemeToggle }) {
  return (
    <PageShell isDark={isDark} locale={locale} onLocaleToggle={onLocaleToggle} onThemeToggle={onThemeToggle}>
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl px-10 py-7 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-heading-h1 font-semibold text-text-primary text-center w-full">驗證電子信箱</h1>
          <p className="text-body-base text-text-secondary text-center w-full">請點擊發送至您信箱的驗證連結以完成驗證</p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Email display */}
          <div className="flex items-center justify-center px-5 py-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-body-base font-medium text-primary text-center break-all">{email || 'user@example.com'}</span>
          </div>

          {/* Resend */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onResend}
              disabled={!canResend}
              className={`text-link-semibold font-semibold underline transition-opacity ${
                canResend ? 'text-primary cursor-pointer hover:opacity-80' : 'text-primary opacity-40 cursor-not-allowed'
              }`}
            >
              重新發送驗證信
            </button>
            {!canResend && (
              <p className="text-body-small text-text-secondary">
                {resendCooldown}s 後可重新發送
              </p>
            )}
          </div>

          <a
            href="/login"
            className="block text-center text-body-small text-text-secondary hover:text-text-primary transition-colors duration-200 py-1"
          >
            ← 返回登入
          </a>
        </div>
      </div>
    </PageShell>
  )
}

function SuccessScreen({ isDark, locale, onLocaleToggle, onThemeToggle }) {
  return (
    <PageShell isDark={isDark} locale={locale} onLocaleToggle={onLocaleToggle} onThemeToggle={onThemeToggle}>
      <div className="flex flex-col items-center gap-7">
        <div className="flex items-center justify-center size-20 rounded-full bg-status-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-heading-h1 font-semibold text-text-primary">驗證成功</p>
          <a
            href="/login"
            className="text-link-semibold font-semibold text-primary underline hover:opacity-80 transition-opacity"
          >
            立即登入
          </a>
        </div>
      </div>
    </PageShell>
  )
}

function ExpiredScreen({ onResend, isDark, locale, onLocaleToggle, onThemeToggle }) {
  return (
    <PageShell isDark={isDark} locale={locale} onLocaleToggle={onLocaleToggle} onThemeToggle={onThemeToggle}>
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl px-10 py-7 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col items-center gap-2 mb-6">
          {/* Warning circle */}
          <div className="flex items-center justify-center size-[72px] rounded-full bg-status-error/15 border border-status-error/40 mb-2">
            <span className="text-[32px] font-bold text-status-error leading-none">!</span>
          </div>
          <h1 className="text-heading-h1 font-semibold text-text-primary text-center w-full">驗證連結已過期</h1>
          <p className="text-body-base text-text-secondary text-center w-full">驗證連結已失效，請重新發送</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onResend}
            className="w-full py-[14.5px] rounded-md bg-primary hover:opacity-90 active:opacity-80 text-button-primary font-semibold text-white transition-opacity duration-200 cursor-pointer"
          >
            重新發送驗證信
          </button>
          <a
            href="/login"
            className="block text-center text-body-small text-text-secondary hover:text-text-primary transition-colors duration-200 py-3"
          >
            ← 返回登入
          </a>
        </div>
      </div>
    </PageShell>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
// Props: email (string), initialView ('pending'|'success'|'expired')
export default function VerifyEmailPage({ email: emailProp = '', initialView = 'pending' }) {
  const [view, setView]               = useState(initialView)
  const [email]                       = useState(emailProp)
  const [cooldown, setCooldown]       = useState(0)
  const [canResend, setCanResend]     = useState(true)
  const [locale, setLocale]           = useState('zh')
  const [isDark, setIsDark]           = useState(true)
  const timerRef = useRef(null)

  const startCooldown = () => {
    setCanResend(false)
    setCooldown(RESEND_COOLDOWN)
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0 }
        return s - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const handleResend = () => {
    if (!canResend) return
    // TODO: call resend API
    console.log('Resend verification to:', email)
    setView('pending')
    startCooldown()
  }

  const shellProps = {
    isDark,
    locale,
    onLocaleToggle: setLocale,
    onThemeToggle: () => setIsDark(!isDark),
  }

  if (view === 'success') return <SuccessScreen {...shellProps} />
  if (view === 'expired') return <ExpiredScreen onResend={handleResend} {...shellProps} />

  return (
    <PendingScreen
      email={email}
      onResend={handleResend}
      resendCooldown={cooldown}
      canResend={canResend}
      {...shellProps}
    />
  )
}
