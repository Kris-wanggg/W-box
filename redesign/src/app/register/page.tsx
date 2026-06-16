"use client";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type Tab = "b2c" | "b2b";

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

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
}

function Field({ id, label, type = "text", placeholder, autoComplete }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--text)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150 focus:ring-2 focus:ring-orange-500"
        style={{
          background: "var(--input-bg)",
          border: "1.5px solid var(--input-border)",
          color: "var(--text)",
        }}
      />
    </div>
  );
}

export default function RegisterPage() {
  const [tab, setTab] = useState<Tab>("b2c");

  const tabClass = (t: Tab) =>
    `flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500`;

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="fixed top-5 right-6 z-50">
        <ThemeToggle />
      </div>

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
          >
            W-BOX
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            會員後台管理系統
          </span>
        </div>

        <h1 className="mb-5 text-xl font-semibold" style={{ color: "var(--text)" }}>
          建立帳號
        </h1>

        {/* Tabs */}
        <div
          className="mb-6 flex gap-1.5 rounded-xl p-1"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          role="tablist"
          aria-label="註冊類型"
        >
          <button
            role="tab"
            aria-selected={tab === "b2c"}
            onClick={() => setTab("b2c")}
            className={tabClass("b2c")}
            style={{
              background: tab === "b2c" ? "var(--primary)" : "transparent",
              color: tab === "b2c" ? "#fff" : "var(--muted)",
            }}
          >
            個人註冊
          </button>
          <button
            role="tab"
            aria-selected={tab === "b2b"}
            onClick={() => setTab("b2b")}
            className={tabClass("b2b")}
            style={{
              background: tab === "b2b" ? "var(--primary)" : "transparent",
              color: tab === "b2b" ? "#fff" : "var(--muted)",
            }}
          >
            企業註冊
          </button>
        </div>

        {/* B2C fields */}
        {tab === "b2c" && (
          <div className="flex flex-col gap-4" role="tabpanel" aria-label="個人註冊表單">
            <Field id="name" label="姓名" placeholder="請輸入姓名" autoComplete="name" />
            <Field id="email" label="電子郵件" type="email" placeholder="name@example.com" autoComplete="email" />
            <Field id="phone" label="手機號碼" type="tel" placeholder="09XX-XXX-XXX" autoComplete="tel" />
            <Field id="pw" label="密碼" type="password" placeholder="至少 8 個字元" autoComplete="new-password" />
            <Field id="pw2" label="確認密碼" type="password" placeholder="再次輸入密碼" autoComplete="new-password" />
          </div>
        )}

        {/* B2B fields */}
        {tab === "b2b" && (
          <div className="flex flex-col gap-4" role="tabpanel" aria-label="企業註冊表單">
            <Field id="company" label="公司名稱" placeholder="請輸入公司名稱" autoComplete="organization" />
            <Field id="taxid" label="統一編號" placeholder="12345678" />
            <Field id="contact" label="聯絡人姓名" placeholder="請輸入姓名" autoComplete="name" />
            <Field id="corp-email" label="公司電子郵件" type="email" placeholder="contact@company.com" autoComplete="email" />
            <Field id="corp-phone" label="手機號碼" type="tel" placeholder="09XX-XXX-XXX" autoComplete="tel" />
            <Field id="corp-pw" label="密碼" type="password" placeholder="至少 8 個字元" autoComplete="new-password" />
            <Field id="corp-pw2" label="確認密碼" type="password" placeholder="再次輸入密碼" autoComplete="new-password" />
          </div>
        )}

        <button
          type="button"
          className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus:ring-2"
          style={{ background: "var(--primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
        >
          立即註冊
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t" style={{ borderColor: "var(--divider)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>或使用以下方式</span>
          <div className="flex-1 border-t" style={{ borderColor: "var(--divider)" }} />
        </div>

        {/* Social register */}
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
            aria-label="使用 Google 帳號註冊"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-400"
            style={{ background: "var(--line-green)" }}
            aria-label="使用 LINE 帳號註冊"
          >
            <LineIcon />
            LINE
          </button>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            已有帳號？立即登入
          </Link>
        </div>
      </div>
    </div>
  );
}
