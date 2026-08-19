"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClinic, getMyClinic, updateMyClinic } from "@/lib/api/doctor";
import { Card } from "@/components/ui/Card";
import { Field, SelectField, TextAreaField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/http";
import { GOVERNORATES, EGYPT_LOCATIONS, getVillages } from "@/lib/egyptLocations";
import {
  validateEgyptianPhone,
  validateEmail,
  validatePrice,
} from "@/lib/validators";
import type { CreateClinicPayload } from "@/types/api";

const EMPTY: CreateClinicPayload = {
  name: "",
  description: "",
  phoneNumber: "",
  email: "",
  governorate: "",
  city: "",
  street: "",
  specialization: "",
  consultationPrice: 0,
  workingDays: [],
};

export default function DoctorClinicPage() {
  const [form, setForm] = useState<CreateClinicPayload>(EMPTY);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [streetDetail, setStreetDetail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMyClinic()
      .then((res) => {
        const data = { ...EMPTY, ...res.data };
        setForm(data);
        setStreetDetail(data.street ?? "");
        setExists(true);
      })
      .catch(() => setExists(false))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof CreateClinicPayload>(key: K, value: CreateClinicPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  // Combine village selection and street detail into form.street
  function updateCombinedStreet(village: string, detail: string) {
    const parts = [village, detail].filter(Boolean);
    const combined = parts.join(" - ");
    setForm((f) => ({ ...f, street: combined }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!form.name || form.name.trim().length < 3) {
      errs.name = "اسم العيادة يجب أن يتكون من 3 أحرف على الأقل";
    }

    if (!form.specialization || form.specialization.trim().length < 2) {
      errs.specialization = "يرجى تحديد التخصص الطبي بشكل صحيح";
    }

    const priceErr = validatePrice(form.consultationPrice);
    if (priceErr) errs.consultationPrice = priceErr;

    if (!form.governorate) {
      errs.governorate = "يرجى اختيار المحافظة";
    }

    if (!form.city) {
      errs.city = "يرجى اختيار المدينة / المركز";
    }

    const phoneErr = validateEgyptianPhone(form.phoneNumber);
    if (phoneErr) errs.phoneNumber = phoneErr;

    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      if (exists) await updateMyClinic(form);
      else await createClinic(form);
      setSuccess(true);
      setExists(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "تعذّر حفظ بيانات العيادة";
      if (msg.toLowerCase().includes("subscription expired")) {
        setError("اشتراك حساب الطبيب منتهي (Subscription Expired). يلزم تجديد اشتراك الطبيب من حساب الإدارة (Admin) لتتمكن من إنشاء أو تعديل العيادة.");
      } else {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-border/50" />;
  }

  const availableCities =
    form.governorate && EGYPT_LOCATIONS[form.governorate]
      ? [
          { label: "-- اختر المدينة / المركز --", value: "" },
          ...EGYPT_LOCATIONS[form.governorate].map((c) => ({ label: c, value: c })),
        ]
      : [{ label: "-- اختر المحافظة أولاً --", value: "" }];

  const availableVillages = getVillages(form.governorate, form.city);
  const villageOptions =
    availableVillages.length > 0
      ? [
          { label: "-- اختر القرية / المنطقة --", value: "" },
          ...availableVillages.map((v) => ({ label: v, value: v })),
          { label: "أخرى (كتابة يدوية في الحقل أدناه)", value: "other" },
        ]
      : [{ label: "-- أدخل القرية/الشارع في الحقل أدناه --", value: "" }];

  return (
    <Card className="max-w-2xl animate-fade-in">
      <h2 className="font-display text-lg font-bold text-text-primary">
        {exists ? "بيانات العيادة" : "إنشاء عيادة جديدة"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        <Field
          label="اسم العيادة"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={fieldErrors.name}
          placeholder="مثال: عيادة الأمل الطبية"
          className="sm:col-span-2"
        />

        <Field
          label="التخصص"
          required
          value={form.specialization}
          onChange={(e) => update("specialization", e.target.value)}
          error={fieldErrors.specialization}
          placeholder="مثال: باطنة / أطفال"
        />

        <Field
          label="سعر الكشف (بالجنية المصري)"
          type="number"
          required
          value={form.consultationPrice}
          onChange={(e) => update("consultationPrice", Number(e.target.value))}
          error={fieldErrors.consultationPrice}
        />

        {/* 1. المحافظة */}
        <SelectField
          label="المحافظة"
          required
          value={form.governorate}
          onChange={(e) => {
            const gov = e.target.value;
            setForm((f) => ({
              ...f,
              governorate: gov,
              city: "",
            }));
            setSelectedVillage("");
            if (fieldErrors.governorate) setFieldErrors((prev) => ({ ...prev, governorate: "" }));
          }}
          error={fieldErrors.governorate}
          options={[
            { label: "-- اختر المحافظة --", value: "" },
            ...GOVERNORATES.map((g) => ({ label: g, value: g })),
          ]}
        />

        {/* 2. المدينة / المركز */}
        <SelectField
          label="المدينة / المركز"
          required
          disabled={!form.governorate}
          value={form.city}
          onChange={(e) => {
            const city = e.target.value;
            update("city", city);
            setSelectedVillage("");
            if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: "" }));
          }}
          error={fieldErrors.city}
          options={availableCities}
        />

        {/* 3. القرية / المنطقة (اختيارات) */}
        <SelectField
          label="القرية / المنطقة (اختيارات)"
          disabled={!form.city}
          value={selectedVillage}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedVillage(v);
            const villageName = v === "other" ? "" : v;
            updateCombinedStreet(villageName, streetDetail);
          }}
          options={villageOptions}
          className="sm:col-span-2"
        />

        {/* 4. اسم الشارع / التفاصيل */}
        <Field
          label="اسم الشارع / تفاصيل العنوان"
          value={streetDetail}
          onChange={(e) => {
            const detail = e.target.value;
            setStreetDetail(detail);
            const villageName = selectedVillage === "other" ? "" : selectedVillage;
            updateCombinedStreet(villageName, detail);
          }}
          placeholder="مثال: شارع المحطة / بجوار المخبز الآلي"
          className="sm:col-span-2"
        />

        {/* 5. الموقع بالتفصيل */}
        <TextAreaField
          label="الموقع بالتفصيل"
          value={form.description ?? ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="أدخل تفاصيل إضافية للعنوان أو علامات مميزة للوصول للعيادة..."
          className="sm:col-span-2"
        />

        <Field
          label="رقم الهاتف المصري"
          required
          inputMode="tel"
          value={form.phoneNumber}
          onChange={(e) => update("phoneNumber", e.target.value)}
          error={fieldErrors.phoneNumber}
          placeholder="مثال: 01012345678"
        />

        <Field
          label="البريد الإلكتروني"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={fieldErrors.email}
          placeholder="example@domain.com"
        />

        {error && (
          <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm font-medium text-danger sm:col-span-2 flex flex-col gap-1">
            <span className="font-bold">فشل الحفظ:</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <p className="rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm font-medium text-success sm:col-span-2">
            تم حفظ بيانات العيادة بنجاح
          </p>
        )}

        <Button type="submit" disabled={saving} className="sm:col-span-2 text-base font-bold shadow-glow-cyan">
          {saving ? "جارٍ الحفظ..." : "حفظ بيانات العيادة"}
        </Button>
      </form>
    </Card>
  );
}
