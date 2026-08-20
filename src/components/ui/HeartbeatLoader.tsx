"use client";

import { useEffect, useState, useRef } from "react";

export function HeartbeatLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const minTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    function handleGlobalLoading(e: Event) {
      const customEv = e as CustomEvent<{ isLoading: boolean }>;
      const shouldLoad = customEv.detail?.isLoading;

      if (shouldLoad) {
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        if (minTimerRef.current) clearTimeout(minTimerRef.current);
        
        startTimeRef.current = Date.now();
        setIsLoading(true);
      } else {
        // Enforce a minimum visible duration (600ms) for smooth ECG line animation
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, 600 - elapsed);

        minTimerRef.current = setTimeout(() => {
          setIsLoading(false);
        }, remaining);
      }
    }

    window.addEventListener("global-loading", handleGlobalLoading);
    return () => {
      window.removeEventListener("global-loading", handleGlobalLoading);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      if (minTimerRef.current) clearTimeout(minTimerRef.current);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-surface/90 border border-primary/30 shadow-2xl backdrop-blur-xl max-w-sm w-full mx-4">
        {/* ECG / EKG SVG Animation Container */}
        <div className="w-full h-24 relative flex items-center justify-center overflow-hidden">
          <svg
            className="w-full h-full text-primary"
            viewBox="0 0 500 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Faint Grid Line */}
            <path
              d="M 0 75 L 500 75"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Glowing EKG Heartbeat Pulse Path */}
            <path
              d="M 0 75 H 120 L 140 75 L 155 30 L 175 120 L 195 10 L 215 95 L 230 75 H 500"
              stroke="url(#ecg-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg-pulse"
            />

            <defs>
              <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary, #06b6d4)" stopOpacity="0.2" />
                <stop offset="50%" stopColor="var(--color-primary-light, #22d3ee)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-accent, #3b82f6)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulse Dot Leading Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-ecg-scan pointer-events-none" />
        </div>

        {/* Loading Text */}
        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          <p className="font-display text-sm font-bold text-text-primary tracking-wide">
            جاري الاتصال بالنظام...
          </p>
        </div>
      </div>
    </div>
  );
}
