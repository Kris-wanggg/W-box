import { useState } from 'react'
import logoSrc from '../assets/logo.svg'
import googleIconSrc from '../assets/google.svg'
import lineIconSrc from '../assets/line.svg'

// ─── Shared UI Primitives ────────────────────────────────────────────────────

function LocaleToggle({ locale, onToggle }) {
  return (
    <div className="flex border border-border rounded-sm overflow-hidden">
      {['zh', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onToggle(l)}
          className={`px-3 py-[5px] text-caption font-medium transition-colors duration-200 ${
            locale === l ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {l === 'zh' ? '繁中' : 'EN'}
        </button>
      ))}
    </div>
  )
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="切換深色/淺色模式"
      className="flex items-center gap-[9px] px-2 py-[6px] rounded-lg bg-surface border border-border cursor-pointer transition-colors duration-200"
    >
      <div
        className={`relative flex items-center w-[36px] h-[20px] rounded-[10px] transition-colors duration-200 ${
          isDark ? 'bg-primary justify-end pr-1' : 'bg-border justify-start pl-1'
        }`}
      >
        <div className="size-[14px] rounded-[7px] bg-white" />
      </div>
      <span className="text-[14px] leading-none select-none">🌙</span>
    </button>
  )
}

function SocialButton({ type, onClick }) {
  const isLine = type === 'line'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLine ? 'LINE 登入' : 'Google 登入'}
      className="flex items-center justify-center size-[44px] rounded-pill bg-surface-alt border border-border hover:border-primary transition-colors duration-200 cursor-pointer"
    >
      <img
        src={isLine ? lineIconSrc : googleIconSrc}
        alt={isLine ? 'LINE' : 'Google'}
        className="w-[19px] h-[17px]"
      />
    </button>
  )
}

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

// ─── Exported page shell (re-used by other auth pages) ───────────────────────
export function PageShell({ isDark, locale, onLocaleToggle, onThemeToggle, children }) {
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="relative min-h-screen w-full bg-background font-sans">
        <div className="absolute top-6 left-6 flex flex-col items-start w-[215px]">
          <img src={logoSrc} alt="FUSION" className="w-full" />
          <p className="mt-[4px] text-caption text-text-muted">會員後台管理系統</p>
        </div>
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <LocaleToggle locale={locale} onToggle={onLocaleToggle} />
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
        <div className="flex min-h-screen items-center justify-center px-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── LoginPage ───────────────────────────────────────────────────────────────
// States covered:
//   user       → email/phone + social buttons + register link   (Dark/Login/user)
//   employee   → employee ID, no social buttons                  (Dark/Login/employee)
//   error      → red borders + error messages                   (Dark/Login-Error)
//   socialFailed → red banner above card content                (Dark/Login/user/socialbtn-failed)

export default function LoginPage() {
  const [userType, setUserType]         = useState('user')   // 'user' | 'employee'
  const [identifier, setIdentifier]     = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [identifierError, setIdentifierError] = useState('')
  const [passwordError, setPasswordError]     = useState('')
  const [socialFailed, setSocialFailed]       = useState(false)
  const [locale, setLocale]             = useState('zh')
  const [isDark, setIsDark]             = useState(true)

  const isUser = userType === 'user'

  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: 串接登入 API
    console.log('Login:', { userType, identifier, password })
  }

  const handleSocialLogin = (provider) => {
    setSocialFailed(false)
    // TODO: 串接 OAuth — provider: 'google' | 'line'
    console.log('Social login:', provider)
  }

  return (
    <PageShell
      isDark={isDark}
      locale={locale}
      onLocaleToggle={setLocale}
      onThemeToggle={() => setIsDark(!isDark)}
    >
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl px-10 pt-10 pb-5 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)]">

        {/* Social login failed banner — state: socialFailed */}
        {socialFailed && (
          <div className="flex items-center gap-2 mb-5 px-3 py-3 rounded-lg bg-status-error/10 border border-status-error/30">
            <span className="size-2 rounded-full bg-status-error shrink-0" />
            <p className="text-label-medium text-status-error">授權失敗，請再重試一次</p>
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-heading-h1 font-semibold text-text-primary">歡迎回來</h1>
          <p className="text-body-base text-text-secondary">請輸入您的資料以登入</p>
        </div>

        {/* User type tab — toggles between user / employee views */}
        <div className="flex border border-border rounded-sm overflow-hidden mb-5">
          {[
            { key: 'user',     label: '一般會員' },
            { key: 'employee', label: '員工登入' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setUserType(key)
                setIdentifierError('')
                setPasswordError('')
              }}
              className={`flex-1 py-[7px] text-caption font-medium transition-colors duration-200 ${
                userType === key ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Identifier field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="identifier" className="text-label-medium font-medium text-text-primary">
              {isUser ? '電子信箱 / 手機號碼' : '員工帳號'}
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setIdentifierError('') }}
              placeholder={isUser ? '請輸入電子信箱或手機號碼' : '請輸入您的員工編號'}
              autoComplete="username"
              required
              className={`w-full px-4 py-[15.5px] rounded-md bg-input-bg border-[1.5px] text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200 ${
                identifierError ? 'border-status-error' : 'border-input-border'
              }`}
            />
            {identifierError && (
              <p className="text-caption text-status-error">{identifierError}</p>
            )}
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-label-medium font-medium text-text-primary">
                密碼
              </label>
              <a href="/forgot-password" className="text-link-semibold font-semibold text-primary hover:opacity-80 transition-opacity">
                忘記密碼？
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                placeholder="請輸入密碼"
                autoComplete="current-password"
                required
                className={`w-full pl-4 pr-12 py-3 rounded-md bg-input-bg border-[1.5px] text-body-base text-text-primary placeholder:text-placeholder outline-none focus:border-primary transition-colors duration-200 ${
                  passwordError ? 'border-status-error' : 'border-input-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {passwordError && (
              <p className="text-caption text-status-error">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-[14.5px] mt-2 rounded-md bg-primary hover:opacity-90 active:opacity-80 text-button-primary font-semibold text-white transition-opacity duration-200 cursor-pointer"
          >
            登入
          </button>
        </form>

        {/* Social login — user only */}
        {isUser && (
          <>
            <div className="relative flex items-center my-4">
              <div className="flex-1 h-px bg-divider" />
              <span className="mx-3 text-caption text-text-secondary whitespace-nowrap">或繼續使用</span>
              <div className="flex-1 h-px bg-divider" />
            </div>
            <div className="flex justify-center gap-4">
              <SocialButton type="google" onClick={() => handleSocialLogin('google')} />
              <SocialButton type="line"   onClick={() => handleSocialLogin('line')} />
            </div>
          </>
        )}

        {/* Register link */}
        <p className="mt-5 pb-1 text-center text-body-small text-text-primary">
          還沒有帳號嗎？{' '}
          <a href="/register" className="text-link-semibold font-semibold text-primary hover:opacity-80 transition-opacity">
            立即註冊
          </a>
        </p>
      </div>
    </PageShell>
  )
}
