"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPublicClinicById } from "@/lib/api/public";
import { createAppointmentByPatient } from "@/lib/api/appointment";
import { useAuth } from "@/hooks/useAuth";
import type { Clinic } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ClinicDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Simulated logic to generate slots for a chosen date
  useEffect(() => {
    if (!date || !clinic) {
      setAvailableSlots([]);
      setSelectedSlot("");
      return;
    }

    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const workingDay = clinic.workingDays.find((wd) => wd.day === dayOfWeek);

    if (!workingDay) {
      setAvailableSlots([]); // No working hours this day
      setSelectedSlot("");
      return;
    }

    // Generate slots every 30 mins between from and to
    const slots = [];
    const parseTime = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + (m || 0);
    };
    
    let currentMin = parseTime(workingDay.from);
    const endMin = parseTime(workingDay.to);
    
    // Fallback slot duration is 30 mins
    const slotDuration = (clinic as any).slotDuration || 30;

    while (currentMin + slotDuration <= endMin) {
      const h = Math.floor(currentMin / 60).toString().padStart(2, "0");
      const m = (currentMin % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      currentMin += slotDuration;
    }

    setAvailableSlots(slots);
    setSelectedSlot("");
  }, [date, clinic]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicClinicById(params.id);
        if (res.success) {
          setClinic(res.data.clinic);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/clinics/${params.id}`);
      return;
    }

    if (role !== "Patient") {
      setMessage({ type: "error", text: "فقط المرضى يمكنهم الحجز. يرجى تسجيل الدخول كـ مريض." });
      return;
    }

    setBookingLoading(true);
    setMessage(null);

    try {
      const doctorId = typeof clinic?.doctorId === "string" ? clinic.doctorId : clinic?.doctorId?._id;
      if (!doctorId) throw new Error("لا يمكن تحديد الطبيب المعالج لهذه العيادة.");

      await createAppointmentByPatient({
        doctorId,
        date,
        startTime: selectedSlot,
      });
      setMessage({ type: "success", text: "تم حجز الموعد بنجاح! سيتم مراجعته وتأكيده قريباً." });
      setDate("");
      setSelectedSlot("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "حدث خطأ أثناء الحجز، يرجى المحاولة لاحقاً." });
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <Card className="h-64 animate-pulse bg-surface-raised" />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:px-12">
        <h1 className="text-2xl font-bold text-text-primary">العيادة غير موجودة</h1>
        <Button className="mt-4" onClick={() => router.push("/clinics")}>العودة للعيادات</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:px-12 animate-fade-in">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/clinics")} className="mb-4">
          &rarr; العودة لقائمة العيادات
        </Button>
        <h1 className="font-display text-3xl font-extrabold text-text-primary">
          {clinic.name}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {clinic.specialization}
          </span>
          <span className="text-sm text-text-secondary">
            {clinic.governorate} - {clinic.city}
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">تفاصيل العيادة</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {clinic.description || "لا يوجد وصف."}
          </p>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">سعر الكشف</span>
              <span className="font-bold text-accent">{clinic.consultationPrice} ج.م</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">العنوان</span>
              <span className="font-medium text-text-primary">{clinic.street || "غير محدد"}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">الهاتف</span>
              <span className="font-medium text-text-primary" dir="ltr">{clinic.phoneNumber}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-text-primary mb-3">أيام العمل</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              {clinic.workingDays.map((wd, i) => (
                <li key={i} className="flex justify-between rounded bg-surface-raised px-3 py-2">
                  <span className="capitalize">{wd.day}</span>
                  <span>{wd.from} - {wd.to}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card glass vibrant className="flex flex-col">
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">حجز موعد جديد</h2>
          <p className="text-sm text-text-secondary mb-6">
            اختر التاريخ المناسب للحجز. سيتم التواصل معك لتأكيد الموعد.
          </p>

          <form onSubmit={handleBook} className="flex flex-col gap-5 flex-1">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                تاريخ الحجز
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.1)]"
              />
            </div>

            {date && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-primary">
                  الساعة
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
                          selectedSlot === slot
                            ? "bg-primary text-surface border-primary shadow-glow-cyan"
                            : "border-border/60 hover:border-primary/40 text-text-primary bg-surface-raised"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-danger/10 p-3 text-sm text-danger border border-danger/20 text-center">
                    لا توجد مواعيد متاحة في هذا اليوم. يرجى اختيار يوم آخر.
                  </div>
                )}
              </div>
            )}

            {message && (
              <div className={`rounded-xl px-4 py-3 text-sm font-medium animate-fade-in-slow ${
                message.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
              }`}>
                {message.text}
              </div>
            )}

            <div className="mt-auto pt-6">
              {!isAuthenticated ? (
                <Button type="submit" variant="vibrant" className="w-full">
                  تسجيل الدخول للحجز
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="vibrant" 
                  className="w-full shadow-glow-cyan" 
                  loading={bookingLoading}
                  disabled={!!date && availableSlots.length > 0 && !selectedSlot}
                >
                  تأكيد الحجز
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
