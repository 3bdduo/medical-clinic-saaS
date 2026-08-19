"use client";

import { FormEvent, useEffect, useState } from "react";
import { getMyAppointments, createAppointmentByPatient } from "@/lib/api/appointment";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApiError } from "@/lib/http";
import type { Appointment } from "@/types/api";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  async function load() {
    const res = await getMyAppointments();
    setAppointments(res.data.appointments ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleBook(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBooking(true);
    try {
      await createAppointmentByPatient({ doctorId, date });
      setDoctorId("");
      setDate("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر حجز الموعد");
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Card className="max-w-lg">
        <h2 className="font-display text-base font-bold text-text-primary">
          حجز موعد جديد
        </h2>
        <form onSubmit={handleBook} className="mt-4 flex flex-col gap-4">
          <Field
            label="معرّف الطبيب"
            required
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
          <Field
            label="التاريخ"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={booking}>
            {booking ? "جارٍ الحجز..." : "احجز الموعد"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-right text-text-secondary">
              <th className="px-5 py-3 font-medium">التاريخ</th>
              <th className="px-5 py-3 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-text-primary">
                  {new Date(a.date).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p className="py-10 text-center text-sm text-text-secondary">
            لا توجد مواعيد
          </p>
        )}
      </Card>
    </div>
  );
}
