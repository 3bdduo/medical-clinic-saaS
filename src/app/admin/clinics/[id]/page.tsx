"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClinicById } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Clinic } from "@/types/api";

export default function AdminClinicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    getClinicById(params.id as string)
      .then((res) => {
        setClinic(res.data.clinic);
      })
      .catch((err) => {
        console.error("Failed to load clinic details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl animate-pulse">
        <div className="h-10 w-32 bg-border/40 rounded-xl mb-4" />
        <Card className="h-48 bg-border/40 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-32 bg-border/40 rounded-2xl" />
          <Card className="h-32 bg-border/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-16 w-16 bg-border/50 rounded-full flex items-center justify-center text-2xl mb-4 opacity-50">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">لم يتم العثور على العيادة</h2>
        <Button variant="secondary" onClick={() => router.back()}>العودة للقائمة</Button>
      </div>
    );
  }

  const doctorName = typeof clinic.doctorId === "object" 
    ? `د. ${clinic.doctorId.firstName} ${clinic.doctorId.lastName}` 
    : "طبيب غير معروف";

  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="h-10 w-10 p-0 rounded-full bg-surface-raised hover:bg-surface border border-border/50 flex items-center justify-center">
          <span className="rtl:rotate-180">←</span>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary">
            تفاصيل العيادة
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            عرض بيانات عيادة {clinic.name} بالكامل
          </p>
        </div>
      </div>

      {/* Main Info Card */}
      <Card glass vibrant className="p-6 md:p-8 shadow-2xl border-primary/20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border/50 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                {clinic.specialization}
              </span>
              {clinic.isActive ? (
                <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-extrabold text-success flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span> نشطة
                </span>
              ) : (
                <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-extrabold text-warning flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning"></span> معطلة
                </span>
              )}
            </div>
            <h2 className="font-display text-3xl font-black text-text-primary">
              {clinic.name}
            </h2>
            <p className="text-sm text-text-secondary mt-2 flex items-center gap-2">
              <span>👨‍⚕️</span> طبيب العيادة: <span className="font-bold text-text-primary">{doctorName}</span>
            </p>
          </div>
          
          <div className="flex flex-col md:items-end p-4 rounded-xl bg-surface border border-border/60">
            <span className="text-[11px] font-extrabold text-text-secondary uppercase">سعر الكشف</span>
            <span className="font-display text-2xl font-black text-accent mt-1">
              {clinic.consultationPrice} <span className="text-sm text-text-secondary font-bold">ج.م</span>
            </span>
            <div className="mt-2 text-xs font-bold text-text-secondary flex gap-2">
              نوع الحجز: <span className="text-text-primary">{clinic.bookingType === "queue" ? "أسبقية الحضور" : "مواعيد ثابتة"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Details */}
          <div>
            <h3 className="text-sm font-extrabold text-text-primary mb-3 flex items-center gap-2">
              <span>📍</span> بيانات الموقع
            </h3>
            <div className="rounded-xl bg-surface p-4 border border-border/50 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-extrabold text-text-secondary">المحافظة والمدينة</span>
                <span className="text-sm font-bold text-text-primary">{clinic.governorate} - {clinic.city}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-extrabold text-text-secondary">العنوان التفصيلي</span>
                <span className="text-sm font-bold text-text-primary">{clinic.street || clinic.address || "غير محدد"}</span>
              </div>

              {clinic.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-extrabold text-text-secondary">وصف الموقع (علامات مميزة)</span>
                  <span className="text-sm text-text-primary leading-relaxed">{clinic.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-extrabold text-text-primary mb-3 flex items-center gap-2">
              <span>📞</span> معلومات الاتصال
            </h3>
            <div className="rounded-xl bg-surface p-4 border border-border/50 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-extrabold text-text-secondary">رقم الهاتف</span>
                <span className="text-sm font-bold text-text-primary" dir="ltr">{clinic.phoneNumber}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-extrabold text-text-secondary">البريد الإلكتروني</span>
                <span className="text-sm font-bold text-text-primary">{clinic.email}</span>
              </div>
            </div>

            <h3 className="text-sm font-extrabold text-text-primary mt-6 mb-3 flex items-center gap-2">
              <span>🕒</span> أيام العمل المتاحة
            </h3>
            <div className="flex flex-wrap gap-2">
              {clinic.workingDays && clinic.workingDays.length > 0 ? (
                clinic.workingDays.map((wd, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-surface-raised border border-border/50 text-xs font-bold text-text-primary">
                    {wd.day} ({new Date(wd.from).toLocaleTimeString("ar-EG", {hour: "2-digit", minute: "2-digit"})} - {new Date(wd.to).toLocaleTimeString("ar-EG", {hour: "2-digit", minute: "2-digit"})})
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-secondary italic">لم يتم تحديد أيام العمل</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
