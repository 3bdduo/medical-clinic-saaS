"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createNotification,
  deleteNotificationForDoctor,
  getAllNotificationsForDoctor,
} from "@/lib/api/notification";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/http";
import type { Notification } from "@/types/api";

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function load() {
    try {
      const res = await getAllNotificationsForDoctor();
      setNotifications(res.data.notifications ?? []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر تحميل الإشعارات");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await createNotification({ patientId, title, message });
      setPatientId("");
      setTitle("");
      setMessage("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر إرسال الإشعار");
    } finally {
      setSending(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteNotificationForDoctor(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر حذف الإشعار");
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Card className="max-w-lg">
        <h2 className="font-display text-base font-bold text-text-primary">
          إرسال إشعار لمريض
        </h2>
        <form onSubmit={handleSend} className="mt-4 flex flex-col gap-4">
          <Field
            label="معرّف المريض"
            required
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <Field
            label="العنوان"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Field
            label="الرسالة"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={sending}>
            {sending ? "جارٍ الإرسال..." : "إرسال"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-base font-bold text-text-primary">
          الإشعارات المُرسلة
        </h2>
        <div className="mt-4 flex flex-col divide-y divide-border">
          {notifications.map((n) => (
            <div key={n._id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary">{n.title}</p>
                <p className="text-sm text-text-secondary">{n.message}</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => remove(n._id)}>
                حذف
              </Button>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="py-6 text-center text-sm text-text-secondary">
              لم ترسل أي إشعارات بعد
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
