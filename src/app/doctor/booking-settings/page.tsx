"use client";

import { useState, useEffect } from "react";
import { DoctorActivationBanner } from "@/components/DoctorActivationBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CustomTimePicker } from "@/components/ui/CustomTimePicker";

interface DayConfig {
  dayName: string;
  dateStr: string;
  isOpen: boolean;
  mode: "queue" | "time";
  limitEnabled: boolean;
  maxLimit: number;
  fromTime: string;
  toTime: string;
  slotDuration: number;
  waitingCapacity: number;
  bookedCount: number;
}

const DEFAULT_DAYS: DayConfig[] = [
  {
    dayName: "الخميس",
    dateStr: "2026-08-20",
    isOpen: true,
    mode: "queue",
    limitEnabled: true,
    maxLimit: 20,
    fromTime: "16:30",
    toTime: "21:00",
    slotDuration: 30,
    waitingCapacity: 5,
    bookedCount: 0,
  },
  {
    dayName: "الجمعة",
    dateStr: "2026-08-21",
    isOpen: false,
    mode: "queue",
    limitEnabled: true,
    maxLimit: 0,
    fromTime: "16:30",
    toTime: "21:00",
    slotDuration: 30,
    waitingCapacity: 5,
    bookedCount: 0,
  },
  {
    dayName: "السبت",
    dateStr: "2026-08-22",
    isOpen: true,
    mode: "time",
    limitEnabled: true,
    maxLimit: 25,
    fromTime: "10:00",
    toTime: "18:00",
    slotDuration: 30,
    waitingCapacity: 5,
    bookedCount: 0,
  },
  {
    dayName: "الأحد",
    dateStr: "2026-08-23",
    isOpen: true,
    mode: "queue",
    limitEnabled: true,
    maxLimit: 20,
    fromTime: "10:00",
    toTime: "18:00",
    slotDuration: 30,
    waitingCapacity: 5,
    bookedCount: 0,
  },
  {
    dayName: "الإثنين",
    dateStr: "2026-08-24",
    isOpen: true,
    mode: "time",
    limitEnabled: true,
    maxLimit: 20,
    fromTime: "11:00",
    toTime: "19:00",
    slotDuration: 20,
    waitingCapacity: 3,
    bookedCount: 0,
  },
  {
    dayName: "الثلاثاء",
    dateStr: "2026-08-25",
    isOpen: true,
    mode: "queue",
    limitEnabled: true,
    maxLimit: 20,
    fromTime: "10:00",
    toTime: "18:00",
    slotDuration: 30,
    waitingCapacity: 5,
    bookedCount: 0,
  },
  {
    dayName: "الأربعاء",
    dateStr: "2026-08-26",
    isOpen: true,
    mode: "queue",
    limitEnabled: true,
    maxLimit: 30,
    fromTime: "12:00",
    toTime: "20:00",
    slotDuration: 30,
    waitingCapacity: 5,
    bookedCount: 0,
  },
];

export default function BookingSettingsPage() {
  const [globalBookingOpen, setGlobalBookingOpen] = useState(true);
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [savedMsgIndex, setSavedMsgIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("clinic_booking_config_v3");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGlobalBookingOpen(parsed.globalBookingOpen ?? true);
        if (parsed.days) setDays(parsed.days);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  function saveConfig(updatedDays: DayConfig[], globalState: boolean) {
    setDays(updatedDays);
    setGlobalBookingOpen(globalState);
    localStorage.setItem(
      "clinic_booking_config_v3",
      JSON.stringify({ globalBookingOpen: globalState, days: updatedDays })
    );
  }

  function updateDay(index: number, patch: Partial<DayConfig>) {
    const updated = [...days];
    updated[index] = { ...updated[index], ...patch };
    saveConfig(updated, globalBookingOpen);
  }

  function handleSaveClick(index: number) {
    setSavedMsgIndex(index);
    setTimeout(() => setSavedMsgIndex(null), 2500);
  }

  function toggleGlobalState() {
    const nextState = !globalBookingOpen;
    saveConfig(days, nextState);
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in max-w-4xl mx-auto">
      <DoctorActivationBanner />

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold text-text-primary md:text-3xl">
          إعدادات الحجز
        </h1>
        <p className="text-sm text-text-secondary">
          تحكم في نوع وعدد الحجوزات لكل يوم على حده متوافقة مع ألوان ونظام العيادة
        </p>
      </div>

      {/* Global Booking Status Banner */}
      <Card glass vibrant className="border-primary/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner ${
                globalBookingOpen ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
              }`}
            >
              {globalBookingOpen ? "🔓" : "🔒"}
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-text-primary">
                حالة الحجز الكلية: {globalBookingOpen ? "مفتوح ويستقبل حجوزات" : "مغلق عموماً"}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {globalBookingOpen
                  ? "الحجز متاح حالياً ويتبع جدول مواعيد كل يوم أدناه"
                  : "تم إيقاف استقبال جميع الحجوزات مؤقتاً في العيادة"}
              </p>
            </div>
          </div>

          <Button
            variant={globalBookingOpen ? "danger" : "vibrant"}
            onClick={toggleGlobalState}
            className="font-bold shadow-md px-6 py-3"
          >
            {globalBookingOpen ? "🔒 قفل الحجز عموماً" : "🔓 فتح الحجز للعيادة"}
          </Button>
        </div>
      </Card>

      {/* Days Configuration List */}
      <div className="flex flex-col gap-6">
        {days.map((day, idx) => (
          <Card
            key={day.dayName}
            glass
            vibrant
            className={`p-6 md:p-8 transition-all duration-300 ${
              !day.isOpen ? "opacity-70 border-danger/30" : ""
            }`}
          >
            {/* Card Header Row */}
            <div className="flex items-start justify-between border-b border-border/50 pb-5 mb-6">
              <div>
                <h3 className="font-display text-xl font-extrabold text-text-primary">
                  {day.dayName} ({day.dateStr})
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  حجوزات: {day.bookedCount}
                </p>
              </div>

              <div className="text-primary font-extrabold text-sm bg-primary-soft border border-primary/30 px-4 py-1.5 rounded-2xl">
                {day.mode === "queue"
                  ? `بالدور (${day.bookedCount} محجوز)`
                  : `بالساعة (${day.bookedCount} محجوز)`}
              </div>
            </div>

            {/* Form Body */}
            <div className="flex flex-col gap-6">
              {/* Mode Selection Pill Row */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-text-secondary">
                  طريقة الحجز لهذا اليوم:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateDay(idx, { mode: "queue" })}
                    className={`rounded-full border px-5 py-2 text-xs font-bold transition-all ${
                      day.mode === "queue"
                        ? "border-primary bg-primary text-surface shadow-glow-cyan"
                        : "border-border/80 bg-surface-raised text-text-secondary hover:border-border"
                    }`}
                  >
                    بالدور (رقم حجز عادي)
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDay(idx, { mode: "time" })}
                    className={`rounded-full border px-5 py-2 text-xs font-bold transition-all ${
                      day.mode === "time"
                        ? "border-primary bg-primary text-surface shadow-glow-cyan"
                        : "border-border/80 bg-surface-raised text-text-secondary hover:border-border"
                    }`}
                  >
                    بالساعة (تحديد مواقيت)
                  </button>
                </div>
              </div>

              {/* MODE 1: QUEUE (بالدور) */}
              {day.mode === "queue" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-text-secondary">
                      حد الحجوزات لهذا اليوم:
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-text-primary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.limitEnabled}
                        onChange={(e) => updateDay(idx, { limitEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span>تفعيل الحد</span>
                    </label>
                  </div>

                  <input
                    type="number"
                    disabled={!day.limitEnabled}
                    value={day.maxLimit === 0 ? "" : day.maxLimit}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      updateDay(idx, { maxLimit: val });
                    }}
                    className="w-full rounded-2xl border border-border/80 bg-surface-raised px-5 py-3.5 text-center text-lg font-black text-text-primary outline-none transition-all focus:border-primary disabled:opacity-50"
                  />
                </div>
              )}

              {/* MODE 2: TIME SLOTS (بالساعة) */}
              {day.mode === "time" && (
                <div className="flex flex-col gap-5">
                  {/* Row 1: Start & End Times */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CustomTimePicker
                      label="وقت بدء العمل:"
                      value={day.fromTime}
                      onChange={(val) => updateDay(idx, { fromTime: val })}
                    />
                    <CustomTimePicker
                      label="وقت انتهاء العمل:"
                      value={day.toTime}
                      onChange={(val) => updateDay(idx, { toTime: val })}
                    />
                  </div>

                  {/* Row 2: Duration & Capacity */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-extrabold text-text-secondary mb-2">
                        مدة الموعد (دقائق):
                      </label>
                      <input
                        type="number"
                        placeholder="مثال: 30"
                        value={day.slotDuration === 0 ? "" : day.slotDuration}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          updateDay(idx, { slotDuration: val });
                        }}
                        className="w-full rounded-2xl border border-border/80 bg-surface-raised px-5 py-3.5 text-center text-sm font-bold text-text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-text-secondary mb-2">
                        سعة الانتظار:
                      </label>
                      <input
                        type="number"
                        placeholder="مثال: 5"
                        value={day.waitingCapacity === 0 ? "" : day.waitingCapacity}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          updateDay(idx, { waitingCapacity: val });
                        }}
                        className="w-full rounded-2xl border border-border/80 bg-surface-raised px-5 py-3.5 text-center text-sm font-bold text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Stack matching theme */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40">
                <Button
                  variant="vibrant"
                  size="lg"
                  onClick={() => handleSaveClick(idx)}
                  className="w-full justify-center text-base font-bold shadow-glow-cyan"
                >
                  حفظ الإعدادات
                </Button>

                <Button
                  variant={day.isOpen ? "danger" : "secondary"}
                  size="lg"
                  onClick={() => updateDay(idx, { isOpen: !day.isOpen })}
                  className="w-full justify-center text-base font-bold"
                >
                  {day.isOpen ? "قفل اليوم" : "فتح اليوم"}
                </Button>

                {savedMsgIndex === idx && (
                  <p className="text-center text-xs font-extrabold text-success animate-fade-in mt-1">
                    تم حفظ الإعدادات لليوم بنجاح ✓
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
