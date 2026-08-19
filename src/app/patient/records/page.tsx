"use client";

import { useEffect, useState } from "react";
import { getMyMedicalRecords } from "@/lib/api/medicalRecord";
import { Card } from "@/components/ui/Card";
import type { MedicalRecord } from "@/types/api";

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMedicalRecords()
      .then((res) => setRecords(res.data.medicalRecords ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {records.map((r) => (
        <Card key={r._id}>
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-text-primary">{r.diagnosis}</p>
            <span className="text-xs text-text-secondary">
              {new Date(r.createdAt).toLocaleDateString("ar-EG")}
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-1.5">
            {r.medications.map((m, i) => (
              <li key={i} className="text-sm text-text-secondary">
                <span className="text-text-primary">{m.name}</span> — {m.dosage ?? "—"} · {m.frequency} · {m.duration}
              </li>
            ))}
          </ul>
          {r.notes && <p className="mt-3 text-sm text-text-secondary">{r.notes}</p>}
        </Card>
      ))}
      {!loading && records.length === 0 && (
        <p className="py-10 text-center text-sm text-text-secondary">
          لا توجد سجلات طبية مشتركة معك بعد
        </p>
      )}
    </div>
  );
}
