"use client";

import { useEffect, useState } from "react";
import {
  deleteAllNotificationsForPatient,
  deleteNotificationForPatient,
  getAllNotificationsForPatient,
} from "@/lib/api/notification";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Notification } from "@/types/api";

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getAllNotificationsForPatient();
      setNotifications(res.data.notifications ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    await deleteNotificationForPatient(id);
    load();
  }

  async function clearAll() {
    await deleteAllNotificationsForPatient();
    load();
  }

  return (
    <div className="animate-fade-in">
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text-primary">
            الإشعارات
          </h2>
          {notifications.length > 0 && (
            <Button size="sm" variant="ghost" onClick={clearAll}>
              مسح الكل
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col divide-y divide-border">
          {notifications.map((n) => (
            <div key={n._id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary">{n.title}</p>
                <p className="text-sm text-text-secondary">{n.message}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => remove(n._id)}>
                حذف
              </Button>
            </div>
          ))}
          {!loading && notifications.length === 0 && (
            <p className="py-6 text-center text-sm text-text-secondary">
              لا توجد إشعارات
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
