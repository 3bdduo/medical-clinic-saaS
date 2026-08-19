"use client";

import { useEffect, useRef, useState } from "react";

// Duration in ms — 5 seconds then fade out
const SPLASH_MS = 5000;
const FADE_MS = 700;

// Inject keyframes once at module level (runs client-side only)
if (typeof document !== "undefined") {
  if (!document.getElementById("nabd-splash-styles")) {
    const s = document.createElement("style");
    s.id = "nabd-splash-styles";
    s.textContent = `
      @keyframes nabd-fill-bar { from { width:0% } to { width:100% } }
      @keyframes nabd-fade-in  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      .nabd-splash-enter { animation: nabd-fade-in 0.6s cubic-bezier(0.16,1,0.3,1) both; }
      /* Hide body content while splash is visible — applied immediately via this style block */
      .nabd-body-locked > *:not(#nabd-splash-root) { visibility: hidden !important; }
    `;
    document.head.appendChild(s);
  }
}

export function Preloader({ children }: { children: React.ReactNode }) {
  // Check sessionStorage SYNCHRONOUSLY during first client render
  const skipRef = useRef(
    typeof window !== "undefined" &&
      sessionStorage.getItem("nabd-splash") === "1"
  );

  const [phase, setPhase] = useState<"splash" | "fading" | "done">(
    skipRef.current ? "done" : "splash"
  );

  useEffect(() => {
    if (skipRef.current) return;

    // Lock body so nothing beneath is visible
    document.body.classList.add("nabd-body-locked");

    const fadeTimer = setTimeout(() => setPhase("fading"), SPLASH_MS);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem("nabd-splash", "1");
      document.body.classList.remove("nabd-body-locked");
      setPhase("done");
    }, SPLASH_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.classList.remove("nabd-body-locked");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Splash overlay — always rendered on first paint to avoid flash */}
      {phase !== "done" && (
        <div
          id="nabd-splash-root"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-bg, #0d1117)",
            opacity: phase === "fading" ? 0 : 1,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.16,1,0.3,1)`,
            pointerEvents: phase === "fading" ? "none" : "all",
          }}
        >
          <ArcNabdSplash />
        </div>
      )}

      {/* Page children — always rendered (SSR-safe), hidden by .nabd-body-locked until splash done */}
      {children}
    </>
  );
}

/** ARC × Nabd community splash */
function ArcNabdSplash() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const nabdLogo = isDark ? "/logo/nabd-logo-dark.png" : "/logo/nabd-logo-light.png";

  return (
    <div className="nabd-splash-enter flex flex-col items-center gap-10 px-6">

      {/* Logos row */}
      <div className="flex items-center gap-8 sm:gap-14">

        {/* ARC Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-full shadow-[0_0_35px_rgba(0,229,255,0.35)]"
            style={{
              width: "clamp(100px, 20vw, 128px)",
              height: "clamp(100px, 20vw, 128px)",
              border: "2px solid rgba(0,229,255,0.3)",
              background: "#1a1f2e",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/arc-logo.jpg"
              alt="ARC Community"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,229,255,0.06)",
              mixBlendMode: "color",
              pointerEvents: "none",
            }} />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display text-xl font-extrabold gradient-text-alive tracking-tight">ARC</span>
            <span className="text-[11px] font-semibold text-text-secondary tracking-widest uppercase">Community</span>
          </div>
        </div>

        {/* × Divider */}
        <span style={{ fontSize: "2rem", fontWeight: 200, opacity: 0.4, color: "var(--color-primary)" }}>×</span>

        {/* Nabd Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-full shadow-[0_0_35px_rgba(0,229,255,0.35)]"
            style={{
              width: "clamp(100px, 20vw, 128px)",
              height: "clamp(100px, 20vw, 128px)",
              border: "2px solid rgba(0,229,255,0.3)",
              background: "var(--color-surface, #1a1f2e)",
            }}
          >
            {/* Pulse rings */}
            <span style={{
              position: "absolute",
              inset: -6,
              borderRadius: "9999px",
              border: "1.5px solid rgba(0,229,255,0.2)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{
              position: "absolute",
              inset: -14,
              borderRadius: "9999px",
              border: "1px solid rgba(0,229,255,0.1)",
              animation: "pulse 2s ease-in-out 0.5s infinite",
            }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={nabdLogo}
              alt="نبض Nabd"
              style={{ width: "82%", height: "82%", objectFit: "contain", position: "relative", zIndex: 1 }}
            />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display text-xl font-extrabold gradient-text-alive tracking-tight">نبض</span>
            <span className="text-[11px] font-semibold text-text-secondary tracking-widest uppercase">Nabd</span>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-semibold text-text-secondary">
          مجتمع{" "}
          <span className="font-bold" style={{ color: "var(--color-primary)" }}>ARC</span>
          {" "}يُقدّم لكم
        </p>
        <p className="font-display text-lg font-bold text-text-primary">
          منصة{" "}
          <span className="gradient-text-alive">نبض</span>
          {" "}لإدارة العيادات الطبية
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 200,
        height: 3,
        borderRadius: 9999,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          borderRadius: 9999,
          background: "linear-gradient(to left, var(--color-primary), var(--color-accent))",
          animation: `nabd-fill-bar ${SPLASH_MS}ms linear forwards`,
        }} />
      </div>
    </div>
  );
}
