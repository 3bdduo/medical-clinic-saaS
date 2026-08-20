"use client";

import { useState, useEffect } from "react";
import { DoctorActivationBanner } from "@/components/DoctorActivationBanner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PatientAnnouncement {
  id: string;
  text: string;
  enabled: boolean;
  createdAt: string;
}

export default function ClinicAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<PatientAnnouncement[]>([]);
  const [text, setText] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("clinic_announcements");
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  function saveAnnouncements(list: PatientAnnouncement[]) {
    setAnnouncements(list);
    localStorage.setItem("clinic_announcements", JSON.stringify(list));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const newAnn: PatientAnnouncement = {
      id: `ann-${Date.now()}`,
      text: text.trim(),
      enabled,
      createdAt: new Date().toLocaleDateString("ar-EG"),
    };

    saveAnnouncements([newAnn, ...announcements]);
    setText("");
  }

  function toggleEnable(id: string) {
    const updated = announcements.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    saveAnnouncements(updated);
  }

  function removeAnnouncement(id: string) {
    const updated = announcements.filter((a) => a.id !== id);
    saveAnnouncements(updated);
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DoctorActivationBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">
          إدارة الإشعارات والتنبيهات للمرضى
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          أضف إشعاراً أو تنبيهاً عاماً يظهر للمرضى في أعلى صفحة العيادة فور دخولهم
        </p>
      </div>

      {/* Add Form (Matching Screenshot 4) */}
      <Card glass vibrant className="max-w-2xl border-primary/20 p-6 md:p-8 shadow-2xl">
        <h2 className="font-display text-lg font-bold text-text-primary mb-4">
          إضافة إشعار جديد
        </h2>

        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              نص الإشعار
            </label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="مثال: تنويه: العيادة مغلقة في الإجازات الرسمية..."
              className="w-full rounded-xl border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-primary">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span>إشعار مفعل (يظهر للمرضى في صفحة العيادة)</span>
          </label>

          <Button type="submit" variant="vibrant" className="mt-2 font-bold shadow-glow-cyan">
            + إضافة إشعار
          </Button>
        </form>
      </Card>

      {/* List (Matching Screenshot 4) */}
      <Card className="max-w-2xl">
        <h2 className="font-display text-base font-bold text-text-primary mb-4">
          قائمة الإشعارات الحاليّة ({announcements.length})
        </h2>

        <div className="flex flex-col divide-y divide-border/60">
          {announcements.map((ann) => (
            <div key={ann.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-text-primary">{ann.text}</p>
                <span className="text-[11px] text-text-secondary">{ann.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEnable(ann.id)}
                  className={`rounded-full px-3 py-1 text-xs font-extrabold transition-colors ${
                    ann.enabled ? "bg-success/20 text-success" : "bg-border text-text-secondary"
                  }`}
                >
                  {ann.enabled ? "نشط" : "معطل"}
                </button>

                <Button size="sm" variant="danger" onClick={() => removeAnnouncement(ann.id)}>
                  حذف
                </Button>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">
              لا توجد إشعارات حالية
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
