"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LineIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden="true">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LoginForm() {
  const params = useSearchParams();
  const showError = params.get("error") === "true";

  const [showPw, setShowPw] = useState(false);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150
    focus:ring-2 focus:ring-orange-500`;

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ background: "var(--bg)" }}
    >
      {/* Theme toggle — top right */}
      <div className="fixed top-5 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        role="main"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-1">
          <span
            className="text-3xl font-black tracking-wider"
            style={{ color: "var(--primary)" }}
            aria-label="W-BOX"
          >
            W-BOX
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            會員後台管理系統
          </span>
        </div>

        <h1 className="mb-6 text-xl font-semibold" style={{ color: "var(--text)" }}>
          歡迎回來
        </h1>

        {/* Identity field */}
        <div className="mb-4">
          <label
            htmlFor="identity"
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            電子郵件 / 手機號碼
          </label>
          <input
            id="identity"
            type="text"
            autoComplete="username"
            placeholder="請輸入電子郵件或手機號碼"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            aria-describedby={showError ? "identity-error" : undefined}
            aria-invalid={showError}
            className={inputClass}
            style={{
              background: "var(--input-bg)",
              border: `1.5px solid ${showError ? "var(--error)" : "var(--input-border)"}`,
              color: "var(--text)",
            }}
          />
          {showError && (
            <p
              id="identity-error"
              role="alert"
              className="mt-1.5 text-xs"
              style={{ color: "var(--error)" }}
            >
              請檢查信箱或手機號碼是否正確
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="mb-2">
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              密碼
            </label>
            <Link
              href="/forgot-password"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: "var(--primary)" }}
            >
              忘記密碼？
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={showError ? "pw-error" : undefined}
              aria-invalid={showError}
              className={`${inputClass} pr-11`}
              style={{
                background: "var(--input-bg)",
                border: `1.5px solid ${showError ? "var(--error)" : "var(--input-border)"}`,
                color: "var(--text)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "隱藏密碼" : "顯示密碼"}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {showError && (
            <p
              id="pw-error"
              role="alert"
              className="mt-1.5 text-xs"
              style={{ color: "var(--error)" }}
            >
              密碼錯誤
            </p>
          )}
        </div>

        {/* Register link */}
        <div className="mb-6 text-right">
          <Link
            href="/register"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: "var(--primary)" }}
          >
            立即註冊
          </Link>
        </div>

        {/* Login button */}
        <button
          type="button"
          className="mb-6 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ background: "var(--primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
          aria-label="登入"
        >
          登入
        </button>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 border-t" style={{ borderColor: "var(--divider)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            或繼續使用
          </span>
          <div className="flex-1 border-t" style={{ borderColor: "var(--divider)" }} />
        </div>

        {/* Social login */}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{
              background: "var(--input-bg)",
              border: "1.5px solid var(--border)",
              color: "var(--text)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4285F4")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            aria-label="使用 Google 帳號登入"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-400"
            style={{ background: "var(--line-green)" }}
            aria-label="使用 LINE 帳號登入"
          >
            <LineIcon />
            LINE
          </button>
        </div>
      </div>
    </div>
  );
}
