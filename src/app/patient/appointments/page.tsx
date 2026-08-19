"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  getMyAppointments,
  createAppointmentByPatient,
  deleteAppointment,
} from "@/lib/api/appointment";
import { getDoctors, getClinics } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import { Field, SelectField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApiError } from "@/lib/http";
import type { Appointment, Clinic, Doctor } from "@/types/api";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<
    Array<{ id: string; name: string; specialization: string; clinicName: string }>
  >([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [customDoctorId, setCustomDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      // 1. Fetch patient's appointments
      const apptsRes = await getMyAppointments();
      setAppointments(apptsRes.data.appointments ?? []);

      // 2. Fetch doctors/clinics to populate dropdown options
      try {
        const [docsRes, clinicsRes] = await Promise.allSettled([
          getDoctors(),
          getClinics(),
        ]);

        const docsList: Doctor[] =
          docsRes.status === "fulfilled" ? docsRes.value.data.doctors ?? [] : [];
        const clinicsList: Clinic[] =
          clinicsRes.status === "fulfilled" ? clinicsRes.value.data.clinics ?? [] : [];

        const formatted = docsList.map((doc) => {
          const matchedClinic = clinicsList.find((c) => {
            const docId = typeof c.doctorId === "object" ? c.doctorId?._id : c.doctorId;
            return docId === doc._id;
          });

          return {
            id: doc._id,
            name: `د. ${doc.firstName} ${doc.lastName}`,
            specialization: matchedClinic?.specialization ?? "طب عام",
            clinicName: matchedClinic?.name ?? "عيادة طبية",
          };
        });

        setAvailableDoctors(formatted);
      } catch {
        // Fallback gracefully if admin endpoint requires special scope
      }
    } catch {
      // Ignore initial load errors
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleBook(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const targetDoctorId =
      selectedDoctorId === "custom" ? customDoctorId.trim() : selectedDoctorId;

    if (!targetDoctorId) {
      setError("يرجى اختيار الطبيب أو إدخال كود الطبيب");
      return;
    }

    if (!date) {
      setError("يرجى تحديد تاريخ الموعد");
      return;
    }

    setBooking(true);
    try {
      await createAppointmentByPatient({ doctorId: targetDoctorId, date });
      setSuccess("تم إرسال طلب حجز الموعد بنجاح!");
      setSelectedDoctorId("");
      setCustomDoctorId("");
      setDate("");
      loadData();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "تعذّر حجز الموعد، يرجى المحاولة مرة أخرى"
      );
    } finally {
      setBooking(false);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("هل أنت تأكد من رغبتك في إلغاء هذا الموعد؟")) return;
    setCancellingId(id);
    try {
      await deleteAppointment(id);
      loadData();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "تعذّر إلغاء الموعد");
    } finally {
      setCancellingId(null);
    }
  }

  const doctorOptions = [
    { label: "-- اختر الطبيب / العيادة --", value: "" },
    ...availableDoctors.map((d) => ({
      label: `${d.name} — ${d.clinicName} (${d.specialization})`,
      value: d.id,
    })),
    { label: "إدخال كود الطبيب يدوياً", value: "custom" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">
          حجز وتصفح المواعيد الطبية
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          يمكنك حجز موعد جديد لدى الأطباء واستعراض حالة مواعيدك الحالية.
        </p>
      </div>

      {/* Booking Form Card */}
      <Card glass vibrant className="border-primary/20 shadow-xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span>📅</span>
          <span>حجز موعد كشف جديد</span>
        </h2>

        <form onSubmit={handleBook} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
          {/* Doctor Selector Dropdown */}
          <SelectField
            label="اختيار الطبيب والعيادة"
            required
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            options={doctorOptions}
            className="sm:col-span-2"
          />

          {/* Custom Doctor ID fallback field */}
          {selectedDoctorId === "custom" && (
            <Field
              label="رمز/معرّف الطبيب (Doctor ID)"
              required
              value={customDoctorId}
              onChange={(e) => setCustomDoctorId(e.target.value)}
              placeholder="مثال: 64b8f... أو ألصق رمز الطبيب هنا"
              className="sm:col-span-2"
            />
          )}

          {/* Date Picker */}
          <Field
            label="تاريخ الكشف المطلوب"
            type="date"
            required
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="sm:col-span-2"
          />

          {error && (
            <div className="sm:col-span-2 rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="sm:col-span-2 rounded-xl bg-success/10 border border-success/20 p-3 text-sm font-medium text-success">
              {success}
            </div>
          )}

          <Button
            type="submit"
            variant="vibrant"
            disabled={booking}
            loading={booking}
            className="sm:col-span-2 text-base font-bold shadow-glow-cyan"
          >
            {booking ? "جارٍ إرسال الحجز..." : "تأكيد حجز الموعد"}
          </Button>
        </form>
      </Card>

      {/* Appointments List */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>📋</span>
            <span>قائمة مواعيدي الطبية ({appointments.length})</span>
          </span>
          <Button variant="ghost" size="sm" onClick={loadData}>
            تحديث القائمة 🔄
          </Button>
        </h2>

        {loading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-border/50" />
        ) : appointments.length === 0 ? (
          <div className="py-12 text-center text-text-secondary flex flex-col items-center gap-2">
            <span className="text-4xl">🩺</span>
            <p className="font-semibold">لا توجد لديك مواعيد محجوزة حالياً</p>
            <p className="text-xs">اختر الطبيب والتاريخ من النموذج أعلاه للحجز مباشرة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-right text-text-secondary bg-surface-elevated/50">
                  <th className="px-4 py-3 font-semibold">الطبيب / العيادة</th>
                  <th className="px-4 py-3 font-semibold">تاريخ الكشف</th>
                  <th className="px-4 py-3 font-semibold">حالة الموعد</th>
                  <th className="px-4 py-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {appointments.map((a) => {
                  const doc = typeof a.doctorId === "object" ? a.doctorId : null;
                  const clinic = typeof a.clinicId === "object" ? a.clinicId : null;

                  return (
                    <tr key={a._id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-4 py-3.5 text-text-primary">
                        <div className="font-bold">
                          {doc ? `د. ${doc.firstName} ${doc.lastName}` : "عيادة طبية"}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {clinic ? `${clinic.name} (${clinic.specialization})` : "كشف طبي"}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-text-primary font-medium">
                        {new Date(a.date).toLocaleDateString("ar-EG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        {a.status === "pending" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={cancellingId === a._id}
                            onClick={() => handleCancel(a._id)}
                            className="text-danger hover:bg-danger/10"
                          >
                            {cancellingId === a._id ? "جارٍ الإلغاء..." : "إلغاء الموعد"}
                          </Button>
                        ) : (
                          <span className="text-xs text-text-secondary">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
