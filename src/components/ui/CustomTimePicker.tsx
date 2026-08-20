"use client";

import { useState, useRef, useEffect } from "react";

interface CustomTimePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["مساءً", "صباحاً"];

export function CustomTimePicker({ label, value, onChange }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseValue = () => {
    if (!value) return { hour: "04", minute: "30", period: "مساءً" };
    
    if (value.includes(":")) {
      const parts = value.split(":");
      let h = parseInt(parts[0], 10);
      const m = parts[1]?.slice(0, 2) || "00";
      const p = h >= 12 ? "مساءً" : "صباحاً";
      h = h % 12 || 12;
      const hStr = h < 10 ? `0${h}` : `${h}`;
      return { hour: hStr, minute: m, period: p };
    }
    return { hour: "04", minute: "30", period: "مساءً" };
  };

  const { hour, minute, period } = parseValue();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(h: string, m: string, p: string) {
    const formatted = `${h}:${m} ${p}`;
    onChange(formatted);
  }

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      <label className="text-xs font-extrabold text-text-secondary">{label}</label>

      {/* Interactive Display Button using Theme Colors */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-2xl border border-primary/40 bg-surface-raised px-5 py-3.5 text-primary font-mono font-bold text-sm tracking-wider shadow-sm transition-all hover:border-primary focus:border-primary"
      >
        <span className="text-xs font-sans font-extrabold bg-primary-soft px-3 py-1 rounded-xl text-primary">
          {period}
        </span>
        <span className="text-base font-extrabold text-text-primary">
          {hour} : {minute}
        </span>
      </button>

      {/* Dropdown Popup List using Theme Colors */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 flex justify-between gap-1 rounded-2xl border border-border/80 bg-surface p-3 shadow-2xl backdrop-blur-xl animate-scale-in">
          {/* Hours Scroll Column */}
          <div className="flex-1 flex flex-col gap-1 max-h-48 overflow-y-auto text-center">
            <span className="text-[10px] font-bold text-text-secondary sticky top-0 bg-surface py-1">ساعة</span>
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  handleSelect(h, minute, period);
                }}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                  h === hour ? "bg-primary text-surface" : "text-text-primary hover:bg-primary-soft"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          <div className="w-[1px] bg-border/40 my-1" />

          {/* Minutes Scroll Column */}
          <div className="flex-1 flex flex-col gap-1 max-h-48 overflow-y-auto text-center">
            <span className="text-[10px] font-bold text-text-secondary sticky top-0 bg-surface py-1">دقيقة</span>
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  handleSelect(hour, m, period);
                }}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                  m === minute ? "bg-primary text-surface" : "text-text-primary hover:bg-primary-soft"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="w-[1px] bg-border/40 my-1" />

          {/* Period Column */}
          <div className="flex-1 flex flex-col gap-1 justify-center text-center">
            <span className="text-[10px] font-bold text-text-secondary sticky top-0 bg-surface py-1">الفترة</span>
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  handleSelect(hour, minute, p);
                  setIsOpen(false);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                  p === period ? "bg-primary text-surface" : "text-text-primary hover:bg-primary-soft"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
