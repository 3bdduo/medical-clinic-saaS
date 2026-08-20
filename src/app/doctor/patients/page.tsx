"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyPatients } from "@/lib/api/patient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Patient } from "@/types/api";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPatients = patients.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return (
      name.includes(query) ||
      (p.phoneNumber && p.phoneNumber.includes(query)) ||
      (p.nationalId && p.nationalId.includes(query))
    );
  });

  if (error) {
    return (
      <Card className="mx-auto max-w-lg text-center p-8 border-warning/30 animate-fade-in">
        <p className="text-base font-bold text-warning">{error}</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary">
            سجلات المرضى
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            البحث عن مرضى العيادة الحاليين وإدارة ملفاتهم الطبية
          </p>
        </div>
        <Link href="/doctor/patients/register">
          <Button variant="vibrant" className="shadow-glow-cyan">
            + تسجيل مريض جديد
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="بحث باسم المريض، رقم الهاتف أو الرقم القومي..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border/80 bg-surface px-5 py-3 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.1)]"
        />
        <svg
          className="absolute left-4 top-3.5 h-5 w-5 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-surface-raised" />
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <Card className="py-16 text-center text-text-secondary">
          <p className="text-base font-semibold">لا يوجد مرضى مطابقين للبحث</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((p) => (
            <Link key={p._id} href={`/doctor/patients/${p._id}`}>
              <Card hover className="h-full flex flex-col justify-between p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer">
                <div>
                  <p className="font-display font-bold text-text-primary text-lg">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="mt-2 text-xs text-text-secondary flex items-center gap-1">
                    <span></span> <span dir="ltr">{p.phoneNumber}</span>
                  </p>
                  {p.email && (
                    <p className="mt-1 text-xs text-text-secondary flex items-center gap-1">
                      <span></span> {p.email}
                    </p>
                  )}
                  {p.nationalId && (
                    <p className="mt-1 text-xs text-text-secondary flex items-center gap-1">
                      <span>🪪</span> {p.nationalId}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary font-bold">
                  <span>عرض السجل الكامل</span>
                  <span>←</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
