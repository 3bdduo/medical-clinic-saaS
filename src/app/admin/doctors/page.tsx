"use client";

import { useEffect, useState } from "react";
import { getDoctors, toggleDoctorSubscription, deleteDoctor } from "@/lib/api/admin";
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
    await toggleDoctorSubscription(id);
    load();
  }

  async function remove(id: string) {
    await deleteDoctor(id);
    load();
  }

  return (
    <Card className="overflow-hidden p-0 animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-right text-text-secondary">
            <th className="px-5 py-3 font-medium">الاسم</th>
            <th className="px-5 py-3 font-medium">البريد الإلكتروني</th>
            <th className="px-5 py-3 font-medium">الاشتراك</th>
            <th className="px-5 py-3 font-medium">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d._id} className="border-b border-border last:border-0">
              <td className="px-5 py-3 text-text-primary">
                {d.firstName} {d.lastName}
              </td>
              <td className="px-5 py-3 text-text-secondary">{d.email}</td>
              <td className="px-5 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    d.isPaid ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                  }`}
                >
                  {d.isPaid ? "فعّال" : "منتهي"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => renew(d._id)}>
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
      {!loading && doctors.length === 0 && (
        <p className="py-10 text-center text-sm text-text-secondary">لا يوجد أطباء</p>
      )}
    </Card>
  );
}
