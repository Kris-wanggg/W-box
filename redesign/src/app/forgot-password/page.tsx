"use client";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordPage() {
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (code.trim()) setSent(true);
  }

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150
    focus:ring-2 focus:ring-orange-500`;

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

        <h1 className="mb-2 text-xl font-semibold" style={{ color: "var(--text)" }}>
          忘記密碼
        </h1>
        <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
          請在下方輸入驗證碼以重置密碼
        </p>

        {sent ? (
          <div
            className="mb-6 rounded-xl px-4 py-3 text-sm"
            style={{ background: "#F0FDF4", color: "var(--success)", border: "1px solid #BBF7D0" }}
            role="alert"
          >
            ✓ 驗證碼已發送，請查看您的信箱或手機簡訊
          </div>
        ) : null}

        <div className="mb-4">
          <label
            htmlFor="code"
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            驗證碼
          </label>
          <input
            id="code"
            type="text"
            placeholder="請輸入電子郵件或手機以接收驗證碼"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={inputClass}
            style={{
              background: "var(--input-bg)",
              border: "1.5px solid var(--input-border)",
              color: "var(--text)",
            }}
            aria-label="驗證碼輸入欄位"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          className="mb-4 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus:ring-2"
          style={{ background: "var(--primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
        >
          發送
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            ← 返回登入
          </Link>
        </div>
      </div>
    </div>
  );
}
