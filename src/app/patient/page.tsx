"use client";

import { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/api/patient";
import { getMyAppointments } from "@/lib/api/appointment";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Appointment, Patient } from "@/types/api";

export default function PatientHomePage() {
  const [profile, setProfile] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    getMyProfile().then((res) => setProfile(res.data.patient)).catch(() => {});
    getMyAppointments().then((res) => setAppointments(res.data.appointments ?? [])).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Card>
        <p className="text-sm text-text-secondary">أهلًا بك</p>
        <p className="mt-1 font-display text-xl font-bold text-text-primary">
          {profile ? `${profile.firstName} ${profile.lastName}` : "..."}
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-base font-bold text-text-primary">
          مواعيدك القادمة
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-border">
          {appointments.slice(0, 5).map((a) => (
            <div key={a._id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-text-primary">
                {new Date(a.date).toLocaleDateString("ar-EG")}
              </span>
              <StatusBadge status={a.status} />
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="py-6 text-center text-sm text-text-secondary">
              لا توجد مواعيد قادمة
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
