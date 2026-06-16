"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "切換為淺色模式" : "切換為深色模式"}
      className="relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--muted)",
      }}
    >
      {/* Track */}
      <span
        className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200"
        style={{ background: dark ? "var(--primary)" : "var(--border)" }}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: dark ? "translateX(18px)" : "translateX(2px)" }}
        />
      </span>
      <span className="select-none">{dark ? "🌙" : "☀️"}</span>
    </button>
  );
}
