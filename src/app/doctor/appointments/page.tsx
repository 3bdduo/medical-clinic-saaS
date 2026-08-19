"use client";

import { useEffect, useState } from "react";
import { getMyAppointments, updateAppointment, deleteAppointment } from "@/lib/api/appointment";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Appointment } from "@/types/api";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAppointments();
      setAppointments(res.data.appointments ?? []);
    } catch (err: any) {
      const msg = err?.message || "تعذّر جلب المواعيد";
      if (msg.toLowerCase().includes("subscription expired")) {
        setError("اشتراك حساب الطبيب منتهي (Subscription Expired). يلزم تجديد تفعيل حساب الطبيب من صفحة الإدارة (/admin/doctors).");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirm(id: string) {
    await updateAppointment(id, { status: "confirmed" });
    load();
  }

  async function cancel(id: string) {
    await deleteAppointment(id);
    load();
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-lg text-center p-8 border-warning/30 animate-fade-in">
        <p className="text-base font-bold text-warning">{error}</p>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-right text-text-secondary">
              <th className="px-5 py-3 font-medium">المريض</th>
              <th className="px-5 py-3 font-medium">التاريخ</th>
              <th className="px-5 py-3 font-medium">الحالة</th>
              <th className="px-5 py-3 font-medium">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-text-primary">
                  {typeof a.patientId === "object"
                    ? `${a.patientId.firstName} ${a.patientId.lastName}`
                    : a.patientId}
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  {new Date(a.date).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    {a.status === "pending" && (
                      <Button size="sm" onClick={() => confirm(a._id)}>
                        تأكيد
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => cancel(a._id)}>
                      إلغاء
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && appointments.length === 0 && (
          <p className="py-10 text-center text-sm text-text-secondary">
            لا توجد مواعيد
          </p>
        )}
      </Card>
    </div>
  );
}
