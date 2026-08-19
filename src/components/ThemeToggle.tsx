"use client";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition-all duration-250 ease-spring hover:scale-105 hover:border-primary/40 hover:text-primary hover:shadow-glow active:scale-95"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute transition-all duration-350 ease-spring ${
          isDark ? "scale-0 opacity-0 rotate-180" : "scale-100 opacity-100 rotate-0"
        }`}
      >
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute transition-all duration-350 ease-spring ${
          isDark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-180"
        }`}
      >
        <path
          d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
