"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyPatients } from "@/lib/api/patient";
import { Card } from "@/components/ui/Card";
import type { Patient } from "@/types/api";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyPatients()
      .then((res) => setPatients(res.data.patients ?? []))
      .catch((err) => {
        const msg = err?.message || "تعذّر جلب المرضى";
        if (msg.toLowerCase().includes("subscription expired")) {
          setError("اشتراك حساب الطبيب منتهي (Subscription Expired). يلزم تجديد تفعيل حساب الطبيب من صفحة الإدارة (/admin/doctors).");
        } else {
          setError(msg);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <Card className="mx-auto max-w-lg text-center p-8 border-warning/30 animate-fade-in">
        <p className="text-base font-bold text-warning">{error}</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {patients.map((p) => (
        <Link key={p._id} href={`/doctor/patients/${p._id}`}>
          <Card className="h-full transition-transform duration-300 ease-calm hover:-translate-y-0.5 hover:border-primary/40">
            <p className="font-display font-bold text-text-primary">
              {p.firstName} {p.lastName}
            </p>
            <p className="mt-1 text-sm text-text-secondary">{p.phoneNumber}</p>
            <p className="text-sm text-text-secondary">{p.email}</p>
          </Card>
        </Link>
      ))}
      {!loading && patients.length === 0 && (
        <p className="col-span-full py-10 text-center text-sm text-text-secondary">
          لا يوجد مرضى مسجلون بعد
        </p>
      )}
    </div>
  );
}
