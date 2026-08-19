"use client";

import { RequireRole } from "@/components/RequireRole";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { IconDashboard, IconCalendar, IconUsers, IconClinic } from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/doctor", label: "لوحة التحكم", icon: <IconDashboard /> },
  { href: "/doctor/appointments", label: "المواعيد", icon: <IconCalendar /> },
  { href: "/doctor/patients", label: "المرضى", icon: <IconUsers /> },
  { href: "/doctor/clinic", label: "بيانات العيادة", icon: <IconClinic /> },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="Doctor">
      <DashboardShell navItems={NAV_ITEMS} title="لوحة تحكم الطبيب">
        {children}
      </DashboardShell>
    </RequireRole>
  );
}
