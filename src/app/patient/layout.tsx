"use client";

import { RequireRole } from "@/components/RequireRole";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { IconDashboard, IconCalendar, IconRecord, IconBell } from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/patient", label: "الرئيسية", icon: <IconDashboard /> },
  { href: "/patient/appointments", label: "مواعيدي", icon: <IconCalendar /> },
  { href: "/patient/records", label: "سجلاتي الطبية", icon: <IconRecord /> },
  { href: "/patient/notifications", label: "الإشعارات", icon: <IconBell /> },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="Patient">
      <DashboardShell navItems={NAV_ITEMS} title="بوابة المريض">
        {children}
      </DashboardShell>
    </RequireRole>
  );
}
