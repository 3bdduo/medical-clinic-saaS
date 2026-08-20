"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createDoctorByAdmin } from "@/lib/api/admin";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/http";

export default function AdminNewDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    email: "",
    phoneNumber: "",
    password: "",
    subscriptionStatus: "paid",
  });

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createDoctorByAdmin(formData);
      router.push("/admin/doctors");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر إضافة الطبيب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text-primary">
            إضافة طبيب جديد
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            تسجيل حساب طبيب جديد وتحديد حالة اشتراكه يدوياً
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          رجوع
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="الاسم الأول"
              required
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="مثال: أحمد"
            />
            <Field
              label="اسم العائلة"
              required
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="مثال: محمود"
            />
          </div>

          <Field
            label="الرقم القومي"
            required
            type="number"
            value={formData.nationalId}
            onChange={(e) => handleChange("nationalId", e.target.value)}
            placeholder="14 رقم"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="البريد الإلكتروني"
              required
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="doctor@example.com"
            />
            <Field
              label="رقم الهاتف"
              required
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="010..."
            />
          </div>

          <Field
            label="كلمة المرور (المبدئية)"
            required
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="******"
          />

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-primary">
              حالة الاشتراك
            </label>
            <select
              value={formData.subscriptionStatus}
              onChange={(e) => handleChange("subscriptionStatus", e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(var(--color-primary-rgb),0.1)]"
            >
              <option value="paid">مدفوع (Paid)</option>
              <option value="free">مجاني (Free)</option>
              <option value="expired">منتهي (Expired)</option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border/50 flex gap-3">
            <Button type="submit" variant="vibrant" disabled={loading} className="flex-1 shadow-glow-cyan">
              {loading ? "جارٍ الحفظ..." : "إضافة الطبيب"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
