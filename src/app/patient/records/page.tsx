"use client";

import { useEffect, useState } from "react";
import { getMyMedicalRecords } from "@/lib/api/medicalRecord";
import { Card } from "@/components/ui/Card";
import type { MedicalRecord } from "@/types/api";

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getMyMedicalRecords()
      .then((res) => setRecords(res.data.medicalRecords ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = records.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchDiagnosis = r.diagnosis?.toLowerCase().includes(q);
    const matchMeds = r.medications?.some((m) => m.name.toLowerCase().includes(q));
    return matchDiagnosis || matchMeds;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary">
            سجلاتي الطبية الموحدة
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            الملف الطبي التراكمي المشترك معك من الأطباء المعالجين
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="بحث في التشخيص أو الأدوية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/80 bg-surface px-4 py-2.5 pl-10 text-sm outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.1)]"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="h-40 animate-pulse bg-surface-raised" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card className="py-16 text-center text-text-secondary">
          <p className="text-base font-semibold">لا توجد سجلات طبية مطابقة</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredRecords.map((r) => (
            <Card key={r._id} className="p-5 md:p-6 border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
                <div>
                  <span className="text-[10px] font-bold text-primary bg-primary-soft px-2.5 py-1 rounded-full uppercase tracking-wider">تشخيص طبي</span>
                  <p className="font-display font-extrabold text-text-primary text-lg mt-1.5">{r.diagnosis}</p>
                </div>
                <span className="text-xs font-bold text-text-secondary bg-surface-raised px-3 py-1.5 rounded-xl">
                   {new Date(r.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>

              {/* Prescription Image */}
              {r.prescriptionImageUrl && (
                <div className="mt-4">
                  <p className="text-xs font-extrabold text-text-secondary mb-2"> صورة الروشتة المرفقة:</p>
                  <img
                    src={r.prescriptionImageUrl}
                    alt="prescription"
                    className="rounded-xl max-h-48 object-contain border border-border/50 bg-bg"
                  />
                </div>
              )}

              {/* Medications */}
              <div className="mt-4">
                <p className="text-xs font-extrabold text-text-secondary mb-2"> الأدوية الموصوفة:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {r.medications.map((m, i) => (
                    <div key={i} className="rounded-xl border border-border/60 bg-surface-raised p-3 text-sm">
                      <p className="font-bold text-text-primary">{m.name}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-text-secondary mt-1">
                        {m.dosage && <span>الجرعة: {m.dosage}</span>}
                        {m.frequency && <span>التكرار: {m.frequency}</span>}
                        {m.duration && <span>المدة: {m.duration}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {r.notes && (
                <div className="mt-4 pt-3 border-t border-border/40">
                  <p className="text-xs font-extrabold text-text-secondary mb-1"> ملاحظات الطبيب:</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{r.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
