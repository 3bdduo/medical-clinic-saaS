"use client";

import { useEffect, useState } from "react";

// Duration in ms — 5 seconds then fade out
const SPLASH_MS = 5000;

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
    }, SPLASH_MS + 700);

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
      <div
        aria-hidden
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-bg transition-opacity duration-700 ${
          fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ArcNabdSplash />
      </div>
      <div className="invisible">{children}</div>
    </>
  );
}

function ArcNabdSplash() {
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const nabdLogo = isDark
    ? "/logo/nabd-logo-dark.png"
    : "/logo/nabd-logo-light.png";

  return (
    <div className="flex flex-col items-center gap-10 px-6 animate-fade-in">

      {/* Logos row */}
      <div className="flex items-center gap-8 sm:gap-12">

        {/* ── ARC Logo ── */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden shadow-glow-cyan ring-2 ring-primary/30 bg-[#1a1f2e] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/arc-logo.jpg"
              alt="ARC Community Logo"
              className="h-full w-full object-cover"
            />
            {/* subtle cyan overlay tint to harmonize with Nabd palette */}
            <div className="absolute inset-0 bg-primary/10 mix-blend-color pointer-events-none" />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display text-xl font-extrabold gradient-text-alive tracking-tight">
              ARC
            </span>
            <span className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
              Community
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex flex-col items-center gap-1 select-none">
          <span className="text-3xl font-light text-primary/50">×</span>
        </div>

        {/* ── Nabd Logo ── */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden shadow-glow-cyan ring-2 ring-primary/30 bg-surface flex items-center justify-center">
            {/* Pulse rings */}
            <span className="absolute inset-[-4px] rounded-full border-2 border-primary/20 animate-pulse-ring" />
            <span
              className="absolute inset-[-10px] rounded-full border border-primary/10 animate-pulse-ring"
              style={{ animationDelay: "0.5s" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={nabdLogo}
              alt="نبض Nabd Logo"
              className="h-[85%] w-[85%] object-contain relative z-10"
            />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display text-xl font-extrabold gradient-text-alive tracking-tight">
              نبض
            </span>
            <span className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
              Nabd
            </span>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-semibold text-text-secondary">
          مجتمع{" "}
          <span className="text-primary font-bold">ARC</span>{" "}
          يُقدّم لكم
        </p>
        <p className="font-display text-lg font-bold text-text-primary">
          منصة{" "}
          <span className="gradient-text-alive">نبض</span>{" "}
          لإدارة العيادات الطبية
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-52 overflow-hidden rounded-full bg-border/50">
        <div
          className="h-full rounded-full bg-gradient-to-l from-primary to-accent"
          style={{
            animation: `nabd-fill-bar ${SPLASH_MS}ms linear forwards`,
          }}
        />
      </div>

      {/* Inject keyframe once */}
      <InjectKeyframe />
    </div>
  );
}

function InjectKeyframe() {
  useEffect(() => {
    if (document.getElementById("nabd-fill-bar-style")) return;
    const s = document.createElement("style");
    s.id = "nabd-fill-bar-style";
    s.textContent = `@keyframes nabd-fill-bar { from { width: 0% } to { width: 100% } }`;
    document.head.appendChild(s);
  }, []);
  return null;
}
