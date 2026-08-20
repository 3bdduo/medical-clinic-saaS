"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDoctors, renewDoctorSubscription, deleteDoctor } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Doctor } from "@/types/api";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getDoctors();
      setDoctors(res.data.doctors ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function renew(id: string) {
    const input = window.prompt("جدد الاشتراك لكام شهر؟", "1");
    if (!input) return;
    const monthNumber = Number(input);
    if (!Number.isFinite(monthNumber) || monthNumber <= 0) return;
    await renewDoctorSubscription(id, { monthNumber });
    load();
  }

  async function remove(id: string) {
    if (!confirm("هل أنت متأكد من حذف حساب هذا الطبيب وعيادته بالكامل؟")) return;
    await deleteDoctor(id);
    load();
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">
          إدارة حسابات الأطباء
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          تفعيل، تجديد اشتراكات، وحذف حسابات الأطباء في المنصة
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-border bg-surface-raised text-text-secondary">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">الاشتراك</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {doctors.map((d) => (
                <tr key={d._id} className="hover:bg-surface-raised/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-primary">
                    <Link href={`/admin/doctors/${d._id}`} className="hover:text-primary hover:underline font-bold transition-colors">
                      د. {d.firstName} {d.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{d.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        d.isPaid ? "bg-success/15 text-success border border-success/30" : "bg-warning/15 text-warning border border-warning/30"
                      }`}
                    >
                      {d.isPaid ? "فعّال" : "منتهي"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/doctors/${d._id}`}>
                        <Button size="sm" variant="outline">
                          عرض
                        </Button>
                      </Link>
                      <Button size="sm" variant="secondary" onClick={() => renew(d._id)}>
                        تجديد
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => remove(d._id)}>
                        حذف
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && doctors.length === 0 && (
          <p className="py-12 text-center text-sm text-text-secondary">لا يوجد أطباء مسجلين بعد</p>
        )}
      </Card>
    </div>
  );
}
