"use client";

import { useEffect, useState } from "react";

// Duration in ms — 2 seconds then fade out
const SPLASH_MS = 2000;

export function Preloader({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Skip on repeat visits within the same session
    const already = sessionStorage.getItem("nabd-splash") === "1";
    if (already) {
      setDone(true);
      return;
    }

    const fadeTimer = setTimeout(() => setFadeOut(true), SPLASH_MS);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem("nabd-splash", "1");
      setDone(true);
    }, SPLASH_MS + 600); // extra 600ms for fade-out

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (!mounted || done) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Splash screen */}
      <div
        aria-hidden
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-bg transition-opacity duration-700 ${
          fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ArcNabdSplash />
      </div>
      {/* Page content invisible while splash shows */}
      <div className="invisible">{children}</div>
    </>
  );
}

/** ARC × Nabd community splash — 2-second cinematic branding */
function ArcNabdSplash() {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      {/* Union logos row */}
      <div className="flex items-center gap-6">
        {/* ARC Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-400 to-accent shadow-glow-cyan">
            <svg viewBox="0 0 40 40" fill="none" className="h-12 w-12 drop-shadow-md text-slate-950">
              {/* Arc outer ring */}
              <path
                d="M8 28C6 24 6 16 11 11C16 6 24 6 29 11C34 16 34 24 32 28"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* A-shape peak */}
              <path
                d="M13 28L20 12L27 28"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Crossbar with pulse dot */}
              <path d="M16 22H24" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="20" cy="22" r="2" fill="white" />
            </svg>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl border-2 border-primary/30 motion-safe:animate-pulse-ring" />
          </div>
          <span className="font-display text-lg font-extrabold gradient-text-alive tracking-tight">ARC</span>
          <span className="text-[11px] font-semibold text-text-secondary">Community</span>
        </div>

        {/* Divider × */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-primary opacity-60">×</span>
        </div>

        {/* Nabd Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-glow-cyan">
            <svg viewBox="0 0 34 34" fill="none" className="h-11 w-11 drop-shadow-sm">
              <path
                d="M2 17H8L11 8L17 26L21 14L25 17H32"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="80"
                className="motion-safe:animate-heartbeat-line"
              />
            </svg>
            {/* Outer rings */}
            <span className="absolute inset-[-6px] rounded-full border-2 border-primary/20 motion-safe:animate-pulse-ring" />
            <span
              className="absolute inset-[-12px] rounded-full border border-primary/10 motion-safe:animate-pulse-ring"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
          <span className="font-display text-lg font-extrabold gradient-text-alive tracking-tight">نبض</span>
          <span className="text-[11px] font-semibold text-text-secondary">Nabd</span>
        </div>
      </div>

      {/* Caption */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-semibold text-text-secondary">
          مجتمع <span className="text-primary font-bold">ARC</span> يُقدّم لكم
        </p>
        <p className="font-display text-base font-bold text-text-primary">
          منصة <span className="gradient-text-alive">نبض</span> لإدارة العيادات الطبية
        </p>
      </div>

      {/* Thin progress line */}
      <div className="h-0.5 w-40 overflow-hidden rounded-full bg-border/50">
        <div
          className="h-full rounded-full bg-gradient-to-l from-primary to-accent"
          style={{ animation: `fill-bar ${SPLASH_MS}ms linear forwards` }}
        />
      </div>

    </div>
  );
}

// Inject fill-bar keyframe once into the document head
if (typeof document !== "undefined" && !document.getElementById("nabd-fill-bar-style")) {
  const s = document.createElement("style");
  s.id = "nabd-fill-bar-style";
  s.textContent = `@keyframes fill-bar { from { width: 0% } to { width: 100% } }`;
  document.head.appendChild(s);
}
