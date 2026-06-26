import { useState } from 'react'
import { PageShell } from './LoginPage'

// ─── RegisterPage ────────────────────────────────────────────────────────────
// Two views:
//   form    → 姓名 + 電子信箱/手機 + 密碼 + 確認密碼   (Dark/Register-user)
//   success → 註冊成功 + 立即登入                       (Dark/Register-user/signin-finish)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
    <path d="m2 2 20 20"/>
  </svg>
)

function PasswordStrengthBadge({ label, passed }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[11px] font-normal border transition-colors duration-200 ${
        passed
          ? 'bg-status-success/15 border-status-success/30 text-status-success'
          : 'bg-border/50 border-border text-text-secondary'
      }`}
    >
      {passed && <span>✓</span>}
      {label}
    </span>
  )
}

function PasswordField({ id, label, placeholder, value, onChange, show, onToggleShow, checks }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label-medium font-medium text-text-primary">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            id={id}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="new-password"
            required
            className="w-full pl-4 pr-12 py-3 rounded-md bg-input-bg border-[1.5px] border-input-border text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200"
          />
          <button
            type="button"
            onClick={onToggleShow}
            aria-label={show ? '隱藏密碼' : '顯示密碼'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
          >
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-[6px]">
            <PasswordStrengthBadge label="8 個字元以上" passed={checks.length} />
            <PasswordStrengthBadge label="包含字母"     passed={checks.letter} />
            <PasswordStrengthBadge label="包含數字"     passed={checks.number} />
            <PasswordStrengthBadge label="包含符號"     passed={checks.symbol} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────
// Matches Dark/Register-user/signin-finish: orange check circle + 註冊成功 + 立即登入
function SuccessScreen({ isDark, locale, onLocaleToggle, onThemeToggle }) {
  return (
    <PageShell
      isDark={isDark}
      locale={locale}
      onLocaleToggle={onLocaleToggle}
      onThemeToggle={onThemeToggle}
    >
      <div className="flex flex-col items-center gap-7">
        {/* Orange check circle */}
        <div className="flex items-center justify-center size-20 rounded-full bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-heading-h1 font-semibold text-text-primary">註冊成功</p>
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [name, setName]                   = useState('')
  const [email, setEmail]                 = useState('')
  const [password, setPassword]           = useState('')
  const [confirm, setConfirm]             = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [confirmError, setConfirmError]   = useState('')
  const [success, setSuccess]             = useState(false)
  const [locale, setLocale]               = useState('zh')
  const [isDark, setIsDark]               = useState(true)

  const checks = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setConfirmError('兩次輸入的密碼不一致')
      return
    }
    // TODO: 呼叫註冊 API
    console.log('Register:', { name, email, password })
    setSuccess(true)
  }

  const shellProps = {
    isDark,
    locale,
    onLocaleToggle: setLocale,
    onThemeToggle: () => setIsDark(!isDark),
  }

  if (success) {
    return <SuccessScreen {...shellProps} />
  }

  return (
    <PageShell {...shellProps}>
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl px-10 pt-7 pb-5 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">

        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-heading-h1 font-semibold text-text-primary text-center w-full">註冊新會員</h1>
          <p className="text-body-base text-text-secondary text-center w-full">請在下方輸入您的個人資訊</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* 姓名 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-label-medium font-medium text-text-primary">
              姓名
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入您的姓名"
              autoComplete="name"
              required
              className="w-full px-4 py-[15.5px] rounded-md bg-input-bg border-[1.5px] border-input-border text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200"
            />
          </div>

          {/* 電子信箱 / 手機號碼 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-label-medium font-medium text-text-primary">
              電子信箱 / 手機號碼
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入電子信箱或手機號碼"
              autoComplete="email"
              required
              className="w-full px-4 py-[15.5px] rounded-md bg-input-bg border-[1.5px] border-input-border text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200"
            />
          </div>

          {/* 密碼 */}
          <PasswordField
            id="password"
            label="密碼"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            onToggleShow={() => setShowPassword(!showPassword)}
            checks={checks}
          />

          {/* 確認密碼 */}
          <div className="flex flex-col gap-1">
            <PasswordField
              id="confirm"
              label="確認密碼"
              placeholder="再次輸入密碼"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setConfirmError('') }}
              show={showConfirm}
              onToggleShow={() => setShowConfirm(!showConfirm)}
              checks={checks}
            />
            {confirmError && (
              <p className="text-caption text-status-error mt-1">{confirmError}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-[14.5px] mt-2 rounded-md bg-primary hover:opacity-90 active:opacity-80 text-button-primary font-semibold text-white transition-opacity duration-200 cursor-pointer"
          >
            立即註冊
          </button>
        </form>

        {/* Login link */}
        <p className="mt-4 pb-1 text-center text-body-small text-text-secondary">
          已有帳號？{' '}
          <a href="/login" className="text-link-semibold font-semibold text-primary hover:opacity-80 transition-opacity">
            立即登入
          </a>
        </p>
      </div>
    </PageShell>
  )
}
