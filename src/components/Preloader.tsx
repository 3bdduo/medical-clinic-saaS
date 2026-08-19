"use client";

import { useEffect, useState, useRef } from "react";
import { IMAGE_MANIFEST } from "@/lib/assetManifest";

const ROUTES_TO_PREFETCH = [
  "/login",
  "/register",
  "/doctor",
  "/doctor/appointments",
  "/doctor/patients",
  "/admin",
  "/admin/doctors",
  "/admin/clinics",
  "/patient",
  "/patient/appointments",
  "/patient/records",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function Preloader({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [skip, setSkip] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const alreadyLoaded = sessionStorage.getItem("clinic-preloaded") === "1";
    if (alreadyLoaded) {
      setSkip(true);
      setDone(true);
      return;
    }

    let cancelled = false;
    const total = IMAGE_MANIFEST.length + ROUTES_TO_PREFETCH.length || 1;

    const bump = () => {
      progressRef.current += 1;
      const pct = Math.min(100, Math.round((progressRef.current / total) * 100));
      if (!cancelled) setProgress(pct);
    };

    const imageTasks = IMAGE_MANIFEST.map((src) => preloadImage(src).then(bump));
    const routeTasks = ROUTES_TO_PREFETCH.map(
      () =>
        new Promise<void>((resolve) =>
          setTimeout(() => {
            bump();
            resolve();
          }, 30)
        )
    );

    Promise.all([...imageTasks, ...routeTasks]).then(() => {
      if (cancelled) return;
      sessionStorage.setItem("clinic-preloaded", "1");
      setTimeout(() => {
        if (!cancelled) setDone(true);
      }, 200);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-bg" />;
  }

  return (
    <>
      {!skip && (
        <div
          aria-hidden={done}
          role="status"
          aria-live="polite"
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg ${
            done ? "pointer-events-none animate-fade-scale-out" : ""
          }`}
        >
          <MedicalPulseLoader progress={progress} />
        </div>
      )}
      <div className={done ? "animate-fade-in" : "invisible"}>{children}</div>
    </>
  );
}

/** Premium medical pulse loader with heartbeat ECG line */
function MedicalPulseLoader({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Logo + Pulse */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Outer ring */}
        <span className="absolute inset-0 rounded-full border-2 border-primary/20 motion-safe:animate-pulse-ring" />
        {/* Middle ring */}
        <span
          className="absolute inset-2 rounded-full border border-primary/30 motion-safe:animate-pulse-ring"
          style={{ animationDelay: "0.4s" }}
        />
        {/* Core circle with gradient */}
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-glow">
          {/* Heartbeat ECG SVG */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 34 34"
            fill="none"
            className="drop-shadow-sm"
          >
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
        </div>
      </div>

      {/* App name */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-display text-xl font-bold text-text-primary">
          نبض | Nabd
        </h2>
        <p className="text-sm text-text-secondary">
          جارٍ تجهيز كل شيء...
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 w-48 overflow-hidden rounded-full bg-border">
        <div
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-primary to-accent transition-[width] duration-300 ease-spring"
          style={{ width: `${progress}%` }}
        />
        {/* Shine effect */}
        <div
          className="absolute inset-y-0 right-0 rounded-full bg-white/20 blur-sm transition-[width] duration-300"
          style={{ width: `${Math.max(0, progress - 10)}%` }}
        />
      </div>
    </div>
  );
}
