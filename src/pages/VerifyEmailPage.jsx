import { useState, useEffect, useRef } from 'react'
import { PageShell } from './LoginPage'

// ─── VerifyEmailPage ──────────────────────────────────────────────────────────
// States read from URL: ?status=pending (default) | success | expired
//
//   pending  → 驗證電子信箱：顯示信箱、資訊框、重新發送按鈕（30s 冷卻）
//   success  → 已驗證電子郵件地址：橘色勾勾圓圈 + 立即登入
//   expired  → 驗證連結已過期：紅色驚嘆號 + 重新發送按鈕

const RESEND_COOLDOWN = 30

const ExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
)

function ResendButton({ onResend }) {
  const [cooldown, setCooldown] = useState(0)
  const timer = useRef(null)

  const handleClick = () => {
    onResend()
    setCooldown(RESEND_COOLDOWN)
  }

  useEffect(() => {
    if (cooldown <= 0) return
    timer.current = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer.current)
  }, [cooldown])

  const disabled = cooldown > 0

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`w-full py-[14.5px] rounded-md text-button-primary font-semibold text-white transition-opacity duration-200 ${
        disabled
          ? 'bg-primary opacity-35 cursor-not-allowed'
          : 'bg-primary hover:opacity-90 active:opacity-80 cursor-pointer'
      }`}
    >
      {disabled ? `重新發送驗證信（${cooldown}s）` : '重新發送驗證信'}
    </button>
  )
}

// ─── pending ─────────────────────────────────────────────────────────────────
function PendingView({ shellProps }) {
  const email = new URLSearchParams(window.location.search).get('email') || 'example@email.com'

  const handleResend = () => {
    // TODO: 呼叫重新發送驗證信 API
    console.log('Resend verification email to:', email)
  }

  return (
    <PageShell {...shellProps}>
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl px-10 py-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">

        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-heading-h1 font-semibold text-text-primary text-center">驗證電子信箱</h1>
          <p className="text-body-base text-text-secondary text-center">我們已將驗證信寄送至您的信箱</p>
        </div>

        {/* Email display */}
        <div className="mb-4">
          <input
            type="email"
            readOnly
            value={email}
            className="w-full px-4 py-[15.5px] rounded-md bg-input-bg border-[1.5px] border-input-border text-body-base text-text-primary outline-none"
          />
        </div>

        {/* Info box */}
        <div className="flex gap-3 items-start bg-primary/10 border border-primary/25 rounded-md px-3 py-3 mb-5">
          <span className="mt-[1px] text-primary shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
          <p className="text-caption text-text-secondary leading-relaxed">
            請到您的信箱收信，並點擊驗證連結以啟用帳號。驗證連結對應於所有子域下，請檢查垃圾信箱
          </p>
        </div>

        {/* Resend section */}
        <p className="text-body-small text-text-secondary text-center mb-3">還沒收到驗證信？</p>
        <ResendButton onResend={handleResend} />

        <p className="mt-4 text-center text-caption text-text-secondary">
          我已收到，{' '}
          <a href="/login" className="text-primary font-semibold hover:opacity-80 transition-opacity">
            繼續進行下一步。
          </a>
        </p>
      </div>
    </PageShell>
  )
}

// ─── success ─────────────────────────────────────────────────────────────────
function SuccessView({ shellProps }) {
  return (
    <PageShell {...shellProps}>
      <div className="flex flex-col items-center gap-7">
        <div className="flex items-center justify-center size-20 rounded-full bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-heading-h1 font-semibold text-text-primary">已驗證電子郵件地址</p>
          <a href="/login" className="text-link-semibold font-semibold text-primary underline hover:opacity-80 transition-opacity">
            立即登入
          </a>
        </div>
      </div>
    </PageShell>
  )
}

// ─── expired ─────────────────────────────────────────────────────────────────
function ExpiredView({ shellProps }) {
  const handleResend = () => {
    // TODO: 呼叫重新發送驗證信 API
    console.log('Resend verification email (expired)')
  }

  return (
    <PageShell {...shellProps}>
      <div className="w-full max-w-[360px] bg-surface border border-border rounded-xl px-10 py-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] flex flex-col items-center gap-5">

        {/* Red exclamation circle */}
        <div className="flex items-center justify-center size-16 rounded-full bg-status-error text-white">
          <ExclamationIcon />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-heading-h1 font-semibold text-text-primary">驗證連結已過期</h1>
          <p className="text-body-small text-text-secondary">驗證連結已失效，請重新發送</p>
        </div>

        <div className="w-full">
          <ResendButton onResend={handleResend} />
        </div>

        <a href="/login" className="text-body-small text-text-secondary hover:text-text-primary transition-colors">
          ← 返回登入
        </a>
      </div>
    </PageShell>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VerifyEmailPage() {
  const [isDark, setIsDark] = useState(true)
  const [locale, setLocale] = useState('zh')

  const status = new URLSearchParams(window.location.search).get('status') || 'pending'

  const shellProps = {
    isDark,
    locale,
    onLocaleToggle: setLocale,
    onThemeToggle: () => setIsDark((d) => !d),
  }

  if (status === 'success') return <SuccessView shellProps={shellProps} />
  if (status === 'expired') return <ExpiredView shellProps={shellProps} />
  return <PendingView shellProps={shellProps} />
}
