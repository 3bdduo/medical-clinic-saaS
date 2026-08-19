"use client";

import { useEffect, useState } from "react";
import { getClinics } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import type { Clinic } from "@/types/api";

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClinics()
      .then((res) => setClinics(res.data.clinics ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {clinics.map((c) => (
        <Card key={c._id}>
          <p className="font-display font-bold text-text-primary">{c.name}</p>
          <p className="mt-1 text-sm text-text-secondary">{c.specialization}</p>
          <p className="mt-1 text-sm text-text-secondary">
            {c.city}، {c.governorate}
          </p>
          <p className="mt-2 text-sm font-medium text-primary">
            {c.consultationPrice} ج.م / الكشف
          </p>
        </Card>
      ))}
      {!loading && clinics.length === 0 && (
        <p className="col-span-full py-10 text-center text-sm text-text-secondary">
          لا توجد عيادات
        </p>
      )}
    </div>
  );
}
