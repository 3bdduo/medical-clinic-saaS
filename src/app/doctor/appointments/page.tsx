"use client";

import { useEffect, useState } from "react";
import { DoctorActivationBanner } from "@/components/DoctorActivationBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getMyAppointments, updateAppointment } from "@/lib/api/appointment";
import type { Appointment, AppointmentStatus } from "@/types/api";

type TabFilter = "active" | "completed" | "cancelled" | "past";

interface ClinicDoctorMock {
  id: string;
  name: string;
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("active");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await getMyAppointments();
      setAppointments(res.data.appointments ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, status: AppointmentStatus) {
    try {
      await updateAppointment(id, { status });
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update appointment:", err);
    }
  }

  const todayStr = new Date().toISOString().split("T")[0];

  // Filter appointments
  const filteredAppointments = appointments.filter((appt) => {
    // 1. Tab Filter
    const apptDate = appt.date ? appt.date.split("T")[0] : "";
    if (activeTab === "active" && (appt.status === "pending" || appt.status === "confirmed")) {
      return apptDate >= todayStr;
    }
    if (activeTab === "completed" && appt.status === "completed") return true;
    if (activeTab === "cancelled" && appt.status === "cancelled") return true;
    if (activeTab === "past" && apptDate < todayStr) return true;

    // Default tab matching if exact status match
    if (activeTab === "active" && apptDate < todayStr) return false;
    
    return true;
  }).filter((appt) => {
    // 3. Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const patientName = typeof appt.patientId === "object"
      ? `${appt.patientId.firstName} ${appt.patientId.lastName}`
      : appt.patientId;
    const phone = typeof appt.patientId === "object" ? appt.patientId.phoneNumber : "";
    return patientName.toLowerCase().includes(q) || phone.includes(q);
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DoctorActivationBanner />

      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary">
            إدارة الحجوزات
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            متابعة وجدولة كشوفات العيادة وتصفية المواعيد حسب اليوم والحالة
          </p>
        </div>
      </div>

      {/* Main Status Tabs */}
      <Card glass vibrant className="p-2">
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto scrollbar-hide">
          <TabButton
            active={activeTab === "active"}
            onClick={() => setActiveTab("active")}
            label="🟢 الحالية (قيد الانتظار)"
          />
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            label=" السجل (المكتملة)"
          />
          <TabButton
            active={activeTab === "cancelled"}
            onClick={() => setActiveTab("cancelled")}
            label=" الملغاة"
          />
          <TabButton
            active={activeTab === "past"}
            onClick={() => setActiveTab("past")}
            label=" الأيام السابقة"
          />
        </div>
      </Card>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="بحث باسم المريض أو رقم الهاتف..."
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

      {/* Grouping Day Bar */}
      <div className="rounded-2xl bg-surface-raised px-5 py-3 text-sm font-bold text-text-primary flex items-center justify-between border border-border/50">
        <span>اليوم ({todayStr})</span>
        <span className="text-xs text-text-secondary">{filteredAppointments.length} حجز</span>
      </div>

      {/* Appointments List Container */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-20 animate-pulse bg-surface-raised" />
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="py-16 text-center text-text-secondary">
          <p className="text-base font-semibold">لا توجد حجوزات في هذه القائمة حتى الآن</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAppointments.map((appt, index) => {
            const patientName =
              typeof appt.patientId === "object"
                ? `${appt.patientId.firstName} ${appt.patientId.lastName}`
                : appt.patientId;
            const patientPhone =
              typeof appt.patientId === "object" ? appt.patientId.phoneNumber : "—";
            const doctorName =
              typeof appt.doctorId === "object"
                ? `د. ${appt.doctorId.firstName} ${appt.doctorId.lastName}`
                : "دكتور العيادة";

            return (
              <Card key={appt._id} hover className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary font-black text-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary">
                      {patientName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-secondary">
                      <span dir="ltr"> {patientPhone}</span>
                      <span>‍️ {doctorName}</span>
                      <span> {appt.startTime || appt.date ? new Date(appt.date).toLocaleDateString("ar-EG") : "موعد فوري"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <StatusBadge status={appt.status} />

                  {appt.status === "pending" && (
                    <Button
                      size="sm"
                      variant="vibrant"
                      onClick={() => handleStatusUpdate(appt._id, "confirmed")}
                    >
                      تأكيد الحجز
                    </Button>
                  )}

                  {appt.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="vibrant"
                      onClick={() => handleStatusUpdate(appt._id, "completed")}
                    >
                      تم الكشف
                    </Button>
                  )}

                  {appt.status !== "cancelled" && appt.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusUpdate(appt._id, "cancelled")}
                    >
                      إلغاء
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 whitespace-nowrap ${
        active
          ? "bg-primary text-surface shadow-glow-cyan"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
      }`}
    >
      {label}
    </button>
  );
}
