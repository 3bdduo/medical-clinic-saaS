"use client";

import { useState, useEffect } from "react";
import { DoctorActivationBanner } from "@/components/DoctorActivationBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CustomTimePicker } from "@/components/ui/CustomTimePicker";
import { getMyClinic, updateMyClinic } from "@/lib/api/doctor";
import type { WorkingDay } from "@/types/api";

interface DayConfig {
  dayName: string;
  dayKey: WorkingDay["day"];
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

const ARABIC_DAYS: Record<WorkingDay["day"], string> = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};

const DEFAULT_DAYS: DayConfig[] = (Object.keys(ARABIC_DAYS) as WorkingDay["day"][]).map((dayKey) => ({
  dayName: ARABIC_DAYS[dayKey],
  dayKey,
  isOpen: true,
  mode: "queue",
  limitEnabled: true,
  maxLimit: 20,
  fromTime: "10:00",
  toTime: "18:00",
  slotDuration: 30,
  waitingCapacity: 5,
  bookedCount: 0,
}));

export default function BookingSettingsPage() {
  const [globalBookingOpen, setGlobalBookingOpen] = useState(true);
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [savedMsgIndex, setSavedMsgIndex] = useState<number | null>(null);

  useEffect(() => {
    getMyClinic()
      .then((res) => {
        const clinic = res.data;
        if (clinic && clinic.workingDays) {
          const mapped = DEFAULT_DAYS.map((defDay) => {
            const serverDay = clinic.workingDays.find((wd) => wd.day === defDay.dayKey);
            if (serverDay) {
              return {
                ...defDay,
                isOpen: true,
                fromTime: serverDay.from || defDay.fromTime,
                toTime: serverDay.to || defDay.toTime,
                // Load slotDuration from clinic if available
                slotDuration: (clinic as any).slotDuration ?? defDay.slotDuration,
              };
            } else {
              return {
                ...defDay,
                isOpen: false,
                slotDuration: (clinic as any).slotDuration ?? defDay.slotDuration,
              };
            }
          });
          setDays(mapped);
        }
      })
      .catch((err) => console.error("Failed to load clinic config:", err));
  }, []);

  async function saveConfigToBackend(updatedDays: DayConfig[]) {
    const workingDaysPayload: WorkingDay[] = updatedDays
      .filter((d) => d.isOpen)
      .map((d) => ({
        day: d.dayKey,
        from: d.fromTime,
        to: d.toTime,
      }));

    // slotDuration is a clinic-level setting; use the first open day's value (they share one setting)
    const firstOpen = updatedDays.find((d) => d.isOpen);
    const slotDuration = firstOpen?.slotDuration ?? 30;

    try {
      await updateMyClinic({ workingDays: workingDaysPayload, slotDuration });
    } catch (err) {
      console.error("Failed to update workingDays in backend:", err);
    }
  }

  function saveConfig(updatedDays: DayConfig[], globalState: boolean) {
    setDays(updatedDays);
    setGlobalBookingOpen(globalState);
    saveConfigToBackend(updatedDays);
  }

  function updateDay(index: number, patch: Partial<DayConfig>) {
    const updated = [...days];
    updated[index] = { ...updated[index], ...patch };
    saveConfig(updated, globalBookingOpen);
  }

  function handleSaveClick(index: number) {
    saveConfigToBackend(days);
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
          تعديل أيام العمل ومواعيد العمل الخاصة بالعيادة
        </p>
      </div>

      {/* Global Booking Status Banner */}
      <Card glass vibrant className="border-primary/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner bg-success/20 text-success`}
            >
              
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-text-primary">
                حالة جدول العيادة: مفتوح لتلقي الحجوزات
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                تعديل الأوقات أدناه سيقوم بتحديث جدول حجز المرضى فورياً
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Days Configuration List */}
      <div className="flex flex-col gap-6">
        {days.map((day, idx) => (
          <Card
            key={day.dayKey}
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
                  {day.dayName}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  حالة اليوم: {day.isOpen ? "🟢 عيادة تعمل" : " مغلق"}
                </p>
              </div>
            </div>

            {/* Form Body */}
            {day.isOpen ? (
              <div className="flex flex-col gap-6">
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

                {/* Slot Duration */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    مدة الكشف الواحد (بالدقائق)
                  </label>
                  <div className="flex items-center gap-3">
                    {[15, 20, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => updateDay(idx, { slotDuration: mins })}
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                          day.slotDuration === mins
                            ? "bg-primary text-surface shadow-glow-cyan"
                            : "bg-surface-raised text-text-secondary hover:bg-border/60"
                        }`}
                      >
                        {mins} د
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    الكشف الحالي: <span className="font-bold text-primary">{day.slotDuration} دقيقة</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40">
                  <Button
                    variant="vibrant"
                    size="lg"
                    onClick={() => handleSaveClick(idx)}
                    className="w-full justify-center text-base font-bold shadow-glow-cyan"
                  >
                    حفظ التغييرات
                  </Button>

                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => updateDay(idx, { isOpen: false })}
                    className="w-full justify-center text-base font-bold"
                  >
                    تعطيل العمل في هذا اليوم
                  </Button>

                  {savedMsgIndex === idx && (
                    <p className="text-center text-xs font-extrabold text-success animate-fade-in mt-1">
                      تم حفظ إعدادات اليوم بنجاح 
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-text-secondary mb-4">هذا اليوم معطل حالياً ولا يستقبل حجوزات</p>
                <Button
                  variant="vibrant"
                  onClick={() => updateDay(idx, { isOpen: true })}
                  className="shadow-glow-cyan"
                >
                  تفعيل اليوم وفتح الحجز 
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
