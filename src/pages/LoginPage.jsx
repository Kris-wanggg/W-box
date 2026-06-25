import { useState } from 'react'

// ─── 圖片素材 ───────────────────────────────────────────────────────────────
// ⚠️  以下 Figma 資產連結有效期限為 7 天，請工程師在正式環境替換為本地檔案
// 建議放置路徑：src/assets/images/
import logoSrc from '../assets/logo.svg'           // 替換為本地 logo
import googleIconSrc from '../assets/google.svg'   // 替換為本地 Google icon
import lineIconSrc from '../assets/line.svg'        // 替換為本地 LINE icon

// ─── 子元件：社群登入按鈕 ─────────────────────────────────────────────────
function SocialButton({ type, onClick }) {
  const isLine = type === 'line'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLine ? 'LINE 登入' : 'Google 登入'}
      className="
        flex items-center justify-center
        size-[44px] rounded-pill
        bg-surface-alt border border-border
        hover:border-primary transition-colors duration-200
        cursor-pointer
      "
    >
      <img
        src={isLine ? lineIconSrc : googleIconSrc}
        alt={isLine ? 'LINE' : 'Google'}
        className="w-[19px] h-[17px]"
      />
    </button>
  )
}

// ─── 子元件：Locale 切換 ──────────────────────────────────────────────────
function LocaleToggle({ locale, onToggle }) {
  return (
    <div className="flex border border-border rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle('zh')}
        className={`px-3 py-[5px] text-caption font-medium transition-colors duration-200 ${
          locale === 'zh'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        繁中
      </button>
      <button
        type="button"
        onClick={() => onToggle('en')}
        className={`px-3 py-[5px] text-caption font-medium transition-colors duration-200 ${
          locale === 'en'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
    </div>
  )
}

// ─── 子元件：主題切換 ─────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="切換深色/淺色模式"
      className="
        flex items-center gap-[9px]
        px-2 py-[6px] rounded-lg
        bg-surface border border-border
        cursor-pointer transition-colors duration-200
      "
    >
      {/* Switch track */}
      <div
        className={`
          relative flex items-center
          w-[36px] h-[20px] rounded-[10px]
          transition-colors duration-200
          ${isDark ? 'bg-primary justify-end pr-1' : 'bg-border justify-start pl-1'}
        `}
      >
        <div className="size-[14px] rounded-[7px] bg-white" />
      </div>
      <span className="text-[14px] leading-none select-none">🌙</span>
    </button>
  )
}

// ─── 子元件：密碼強度提示 ─────────────────────────────────────────────────
function PasswordStrengthBadge({ label, passed }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-[3px] rounded-sm text-[11px] font-medium
        border transition-colors duration-200
        ${passed
          ? 'bg-status-success/15 border-status-success/30 text-status-success'
          : 'bg-border/50 border-border text-text-secondary'
        }
      `}
    >
      {passed && <span>✓</span>}
      {label}
    </span>
  )
}

// ─── 主頁面 ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [locale, setLocale] = useState('zh')
  const [isDark, setIsDark] = useState(true)

  // 密碼強度檢查
  const passwordChecks = {
    length:  password.length >= 8,
    letter:  /[a-zA-Z]/.test(password),
    number:  /[0-9]/.test(password),
    symbol:  /[^a-zA-Z0-9]/.test(password),
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: 串接登入 API
    console.log('Login:', { email, password })
  }

  const handleGoogleLogin = () => {
    // TODO: 串接 Google OAuth
  }

  const handleLineLogin = () => {
    // TODO: 串接 LINE OAuth
  }

  return (
    // 根節點加上 dark class 對應 tailwind.config.js darkMode: 'class'
    <div className={isDark ? 'dark' : ''}>
      <div className="relative min-h-screen w-full bg-background font-sans">

        {/* ── 左上角 Logo ─────────────────────────────────────────────── */}
        <div className="absolute top-6 left-6 flex flex-col items-start w-[215px]">
          <img src={logoSrc} alt="FUSION" className="w-full" />
          <p className="mt-[4px] text-caption text-text-muted">
            會員後台管理系統
          </p>
        </div>

        {/* ── 右上角：Locale + Theme Toggle ───────────────────────────── */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <LocaleToggle locale={locale} onToggle={setLocale} />
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        {/* ── 置中 Card ────────────────────────────────────────────────── */}
        <div className="flex min-h-screen items-center justify-center px-4">
          <div
            className="
              w-full max-w-[440px]
              bg-surface border border-border rounded-xl
              px-10 pt-10 pb-5
              shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)]
            "
          >
            {/* 標題 */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <h1 className="text-heading-h1 font-semibold text-text-primary">
                歡迎回來
              </h1>
              <p className="text-body-base text-text-secondary">
                請輸入您的資料以登入
              </p>
            </div>

            {/* 表單 */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email / 手機號碼 */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-label-medium font-medium text-text-primary"
                >
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
                  className="
                    w-full px-4 py-[15.5px] rounded-md
                    bg-input-bg border-[1.5px] border-input-border
                    text-body-base text-text-primary
                    placeholder:text-placeholder
                    outline-none
                    focus:border-primary
                    transition-colors duration-200
                  "
                />
              </div>

              {/* 密碼 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-label-medium font-medium text-text-primary"
                  >
                    密碼
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-link-semibold font-semibold text-primary hover:opacity-80 transition-opacity"
                  >
                    忘記密碼？
                  </a>
                </div>

                {/* 密碼欄位 */}
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="請輸入密碼"
                    autoComplete="current-password"
                    required
                    className="
                      w-full pl-4 pr-12 py-3 rounded-md
                      bg-input-bg border-[1.5px] border-input-border
                      text-body-base text-text-primary
                      placeholder:text-placeholder
                      outline-none
                      focus:border-primary
                      transition-colors duration-200
                    "
                  />
                  {/* 顯示/隱藏密碼按鈕 */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      text-text-secondary hover:text-text-primary
                      transition-colors duration-200 cursor-pointer
                    "
                  >
                    {/* eye / eye-off icon — Lucide React 建議：import { Eye, EyeOff } from 'lucide-react' */}
                    {showPassword ? (
                      // Eye icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      // Eye-off icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                        <path d="m2 2 20 20"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* 密碼強度 Badges（僅在有輸入時顯示） */}
                {password.length > 0 && (
                  <div className="flex flex-wrap gap-[6px]">
                    <PasswordStrengthBadge label="8 個字元以上" passed={passwordChecks.length} />
                    <PasswordStrengthBadge label="包含字母" passed={passwordChecks.letter} />
                    <PasswordStrengthBadge label="包含數字" passed={passwordChecks.number} />
                    <PasswordStrengthBadge label="包含符號" passed={passwordChecks.symbol} />
                  </div>
                )}
              </div>

              {/* 登入按鈕 */}
              <button
                type="submit"
                className="
                  w-full py-[14.5px] mt-2 rounded-md
                  bg-primary hover:opacity-90 active:opacity-80
                  text-button-primary font-semibold text-white
                  transition-opacity duration-200 cursor-pointer
                "
              >
                登入
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-1 h-px bg-divider" />
              <span className="mx-3 text-caption text-text-secondary whitespace-nowrap">
                或繼續使用
              </span>
              <div className="flex-1 h-px bg-divider" />
            </div>

            {/* 社群登入 */}
            <div className="flex justify-center gap-4">
              <SocialButton type="google" onClick={handleGoogleLogin} />
              <SocialButton type="line" onClick={handleLineLogin} />
            </div>

            {/* 立即註冊 */}
            <p className="mt-5 pb-1 text-center text-body-small text-text-primary">
              還沒有帳號嗎？{' '}
              <a
                href="/register"
                className="text-link-semibold font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                立即註冊
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
