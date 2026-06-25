import { useState, useEffect, useRef } from 'react'
import { PageShell } from './LoginPage'

// ─── ForgotPasswordPage ──────────────────────────────────────────────────────
// Two steps:
//   step 1 (email) → 輸入電子信箱/手機 → 發送驗證碼    (Dark/ForgotPassword)
//   step 2 (otp)   → 輸入驗證碼 → 重設密碼             (Dark/ForgotPassword-OTP)
// After OTP verified → navigate to /new-password

const OTP_RESEND_SECONDS = 60

export default function ForgotPasswordPage() {
  const [step, setStep]               = useState('email') // 'email' | 'otp'
  const [email, setEmail]             = useState('')
  const [emailError, setEmailError]   = useState('')
  const [otp, setOtp]                 = useState('')
  const [otpError, setOtpError]       = useState('')
  const [countdown, setCountdown]     = useState(OTP_RESEND_SECONDS)
  const [canResend, setCanResend]     = useState(false)
  const [locale, setLocale]           = useState('zh')
  const [isDark, setIsDark]           = useState(true)
  const timerRef = useRef(null)

  // Start countdown when entering OTP step
  useEffect(() => {
    if (step !== 'otp') return
    setCountdown(OTP_RESEND_SECONDS)
    setCanResend(false)
    timerRef.current = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          setCanResend(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step])

  const handleSendOtp = (e) => {
    e.preventDefault()
    // TODO: 呼叫發送驗證碼 API
    console.log('Send OTP to:', email)
    setStep('otp')
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    // TODO: 驗證 OTP，成功後跳轉
    console.log('Verify OTP:', otp)
    window.location.href = '/new-password'
  }

  const handleResend = () => {
    if (!canResend) return
    // TODO: 重新發送 OTP
    console.log('Resend OTP to:', email)
    setOtp('')
    setOtpError('')
    setCountdown(OTP_RESEND_SECONDS)
    setCanResend(false)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0 }
        return s - 1
      })
    }, 1000)
  }

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <PageShell
      isDark={isDark}
      locale={locale}
      onLocaleToggle={setLocale}
      onThemeToggle={() => setIsDark(!isDark)}
    >
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl px-10 py-7 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">

        {/* ── Step 1: Email input ─────────────────────────────────────────── */}
        {step === 'email' && (
          <>
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-heading-h1 font-semibold text-text-primary text-center w-full">忘記密碼</h1>
              <p className="text-body-base text-text-secondary text-center w-full">請輸入電子信箱或手機號碼以接收驗證碼</p>
            </div>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-label-medium font-medium text-text-primary">
                  電子信箱或手機號碼
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  placeholder="example@email.com"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-[15.5px] rounded-md bg-input-bg border-[1.5px] text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200 ${
                    emailError ? 'border-status-error' : 'border-input-border'
                  }`}
                />
                {emailError && <p className="text-caption text-status-error">{emailError}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full py-[14.5px] rounded-md bg-primary hover:opacity-90 active:opacity-80 text-button-primary font-semibold text-white transition-opacity duration-200 cursor-pointer"
                >
                  發送
                </button>
                <a
                  href="/login"
                  className="block text-center text-body-small text-text-secondary hover:text-text-primary transition-colors duration-200 py-3"
                >
                  ← 返回登入
                </a>
              </div>
            </form>
          </>
        )}

        {/* ── Step 2: OTP input ───────────────────────────────────────────── */}
        {step === 'otp' && (
          <>
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-heading-h1 font-semibold text-text-primary text-center w-full">忘記密碼</h1>
              <p className="text-body-base text-text-secondary text-center w-full">請在下方輸入驗證碼以重置密碼</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="text-label-medium font-medium text-text-primary">
                  驗證碼
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setOtpError('') }}
                  placeholder="請輸入驗證碼"
                  autoComplete="one-time-code"
                  required
                  className={`w-full px-4 py-[15.5px] rounded-md bg-input-bg border-[1.5px] text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200 ${
                    otpError ? 'border-status-error' : 'border-primary'
                  }`}
                />
                {otpError && <p className="text-caption text-status-error">{otpError}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full py-[14.5px] rounded-md bg-primary hover:opacity-90 active:opacity-80 text-button-primary font-semibold text-white transition-opacity duration-200 cursor-pointer"
                >
                  重設密碼
                </button>

                {/* Resend + countdown */}
                <div className="flex flex-col gap-2">
                  <p className="text-body-small text-text-secondary text-center">
                    沒有收到驗證碼嗎?{' '}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend}
                      className={`text-link-semibold font-semibold transition-opacity ${
                        canResend ? 'text-primary cursor-pointer hover:opacity-80' : 'text-primary opacity-40 cursor-not-allowed'
                      }`}
                    >
                      再重新發送一次
                    </button>
                  </p>
                  {!canResend && (
                    <p className="text-body-small text-text-primary text-center">
                      倒數計時 {formatCountdown(countdown)}，{OTP_RESEND_SECONDS / 2}s 後可重發
                    </p>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </PageShell>
  )
}
