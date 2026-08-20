"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClinic, getMe, getMyClinic, updateMyClinic } from "@/lib/api/doctor";
import { Card } from "@/components/ui/Card";
import { Field, SelectField, TextAreaField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/http";
import { GOVERNORATES, EGYPT_LOCATIONS, getVillages } from "@/lib/egyptLocations";
import { SupportContactBox } from "@/components/SupportActivationModal";
import type { CreateClinicPayload, Doctor } from "@/types/api";

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

/* ─── Read-only info row ─────────────────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-border/40 last:border-0">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-secondary">
        {label}
      </span>
      <span className="text-sm font-semibold text-text-primary">
        {value ? (
          String(value)
        ) : (
          <span className="italic text-text-secondary opacity-50">لم يُضف بعد</span>
        )}
      </span>
    </div>
  );
}

/* ─── Reusable editable section ──────────────────────────────────────────── */
function Section({
  title,
  icon,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
  viewChildren,
  children,
}: {
  title: string;
  icon: string;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  viewChildren: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface-raised overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface border-b border-border/50">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-text-primary">
          <span>{icon}</span>
          <span>{title}</span>
        </h3>
        {!editing ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary transition-all duration-200"
          >
            <span>✏️</span>
            <span>تعديل</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-text-secondary hover:bg-surface-raised transition-all"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-surface shadow-glow-cyan transition-all disabled:opacity-60"
            >
              {saving ? (
                <><span className="h-3 w-3 rounded-full border-2 border-surface/30 border-t-surface animate-spin" /><span>حفظ...</span></>
              ) : (
                <><span>💾</span><span>حفظ التغييرات</span></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {editing ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
            {children}
          </div>
        ) : (
          <div className="animate-fade-in">{viewChildren}</div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function DoctorClinicPage() {
  const [activeTab, setActiveTab] = useState<"private" | "public">("private");

  // Source of truth (always reflects last server state)
  const [form, setForm] = useState<CreateClinicPayload>(EMPTY);
  // Draft used only while editing a section
  const [draft, setDraft] = useState<CreateClinicPayload>(EMPTY);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [streetDetail, setStreetDetail] = useState("");

  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  /* ── Load on mount ─────────────────────────────────────────────────── */
  useEffect(() => {
    Promise.allSettled([getMyClinic(), getMe()])
      .then(([clinicRes, docRes]) => {
        const docData = docRes.status === "fulfilled" ? docRes.value.data : null;
        if (docData) setDoctor(docData);

        if (clinicRes.status === "fulfilled") {
          // Clinic exists → populate form fully
          const data = { ...EMPTY, ...(clinicRes.value.data as Partial<CreateClinicPayload>) };
          setForm(data);
          setDraft(data);
          setStreetDetail(data.street ?? "");
          setExists(true);
        } else if (docData) {
          // No clinic yet → prefill from doctor profile
          const prefill: CreateClinicPayload = {
            ...EMPTY,
            email: docData.email ?? "",
            phoneNumber: docData.phoneNumber ?? "",
          };
          setForm(prefill);
          setDraft(prefill);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Helpers ───────────────────────────────────────────────────────── */
  function updateDraft<K extends keyof CreateClinicPayload>(key: K, val: CreateClinicPayload[K]) {
    setDraft((d) => ({ ...d, [key]: val }));
  }

  function updateDraftStreet(village: string, detail: string) {
    const parts = [village, detail].filter(Boolean);
    setDraft((d) => ({ ...d, street: parts.join(" - ") }));
  }

  function startEdit(section: string) {
    setDraft({ ...form });
    setStreetDetail(form.street ?? "");
    setSelectedVillage("");
    setSectionError(null);
    setEditingSection(section);
  }

  function cancelEdit() {
    setDraft({ ...form });
    setSectionError(null);
    setEditingSection(null);
  }

  async function saveSection() {
    setSaving(true);
    setSectionError(null);
    try {
      if (exists) {
        await updateMyClinic(draft);
      } else {
        await createClinic(draft);
        setExists(true);
      }
      setForm({ ...draft });
      setEditingSection(null);
      setGlobalSuccess("تم حفظ بيانات العيادة بنجاح ✓");
      setTimeout(() => setGlobalSuccess(null), 4000);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "تعذّر حفظ البيانات";
      setSectionError(
        msg.toLowerCase().includes("subscription expired")
          ? "اشتراك حساب الطبيب منتهي. يلزم تجديد الاشتراك من إدارة المنصة."
          : msg
      );
    } finally {
      setSaving(false);
    }
  }

  /* ── Loading skeleton ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse max-w-3xl mx-auto">
        <div className="h-14 rounded-2xl bg-border/30" />
        <div className="h-12 rounded-2xl bg-border/30" />
        <div className="h-48 rounded-2xl bg-border/30" />
        <div className="h-36 rounded-2xl bg-border/30" />
        <div className="h-28 rounded-2xl bg-border/30" />
      </div>
    );
  }

  const availableCities =
    draft.governorate && EGYPT_LOCATIONS[draft.governorate]
      ? [
          { label: "-- اختر المدينة / المركز --", value: "" },
          ...EGYPT_LOCATIONS[draft.governorate].map((c) => ({ label: c, value: c })),
        ]
      : [{ label: "-- اختر المحافظة أولاً --", value: "" }];

  const availableVillages = getVillages(draft.governorate, draft.city);
  const villageOptions =
    availableVillages.length > 0
      ? [
          { label: "-- اختر القرية / المنطقة --", value: "" },
          ...availableVillages.map((v) => ({ label: v, value: v })),
          { label: "أخرى (كتابة يدوية في الحقل أدناه)", value: "other" },
        ]
      : [{ label: "-- أدخل القرية/الشارع في الحقل أدناه --", value: "" }];

  const isEditing = (s: string) => editingSection === s;

  return (
    <div className="flex flex-col gap-5 animate-fade-in max-w-3xl mx-auto">

      {/* Account Status Banner */}
      {doctor && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium flex-wrap ${
            doctor.isPaid
              ? "bg-success/10 border-success/30 text-success"
              : "bg-warning/10 border-warning/30 text-warning"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            <span className={`h-3 w-3 rounded-full animate-pulse-glow ${doctor.isPaid ? "bg-success" : "bg-warning"}`} />
            {doctor.isPaid
              ? "حساب الطبيب مُفعل بالكامل (اشتراك ساري في المنصة)"
              : "حساب الطبيب غير مُفعل حالياً (لم يتم التفعيل بعد من إدارة المنصة)"}
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${doctor.isPaid ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
            {doctor.isPaid ? "مُفعل ✓" : "لم يتم التفعيل ⚠️"}
          </span>
        </div>
      )}

      {/* Show support contact numbers if account is not activated */}
      {doctor && !doctor.isPaid && (
        <SupportContactBox />
      )}

      {/* Tab Switcher */}
      <Card glass vibrant className="p-2">
        <div className="grid grid-cols-2 gap-2 text-center">
          {(["private", "public"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-surface shadow-glow-cyan"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              <span>{tab === "private" ? "🔒" : "🌐"}</span>
              <span>{tab === "private" ? "بيانات العيادة (خاص)" : "معاينة المرضى (عام)"}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Global feedback */}
      {globalSuccess && (
        <div className="rounded-2xl bg-success/10 border border-success/30 px-4 py-3 text-sm font-bold text-success animate-fade-in">
          {globalSuccess}
        </div>
      )}
      {sectionError && (
        <div className="rounded-2xl bg-danger/10 border border-danger/30 px-4 py-3 text-sm font-bold text-danger animate-fade-in flex items-start gap-2">
          <span>⚠️</span><span>{sectionError}</span>
        </div>
      )}

      {/* ══════════════════════ PRIVATE VIEW ══════════════════════════════ */}
      {activeTab === "private" && (
        <div className="flex flex-col gap-4 animate-fade-in">

          {!exists && (
            <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
              📋 لم يتم إنشاء بيانات العيادة بعد — أكمل الحقول أدناه ثم اضغط حفظ لتظهر للمرضى
            </div>
          )}

          {/* ── Section 1: Basic Info ──────────────────────── */}
          <Section
            title="المعلومات الأساسية"
            icon="🏥"
            editing={isEditing("basic")}
            saving={saving}
            onEdit={() => startEdit("basic")}
            onCancel={cancelEdit}
            onSave={saveSection}
            viewChildren={
              <>
                <InfoRow label="اسم العيادة" value={form.name} />
                <InfoRow label="التخصص الطبي" value={form.specialization} />
                <InfoRow label="سعر الكشف" value={form.consultationPrice ? `${form.consultationPrice} ج.م` : null} />
              </>
            }
          >
            <Field
              label="اسم العيادة *"
              required
              value={draft.name}
              onChange={(e) => updateDraft("name", e.target.value)}
              placeholder="مثال: عيادة الأمل الطبية"
              className="sm:col-span-2"
            />
            <Field
              label="التخصص الطبي *"
              required
              value={draft.specialization}
              onChange={(e) => updateDraft("specialization", e.target.value)}
              placeholder="مثال: باطنة / أطفال"
            />
            <Field
              label="سعر الكشف (ج.م) *"
              type="number"
              required
              value={draft.consultationPrice === 0 ? "" : draft.consultationPrice}
              onChange={(e) => updateDraft("consultationPrice", Number(e.target.value))}
            />
          </Section>

          {/* ── Section 2: Location ───────────────────────── */}
          <Section
            title="الموقع والعنوان"
            icon="📍"
            editing={isEditing("location")}
            saving={saving}
            onEdit={() => startEdit("location")}
            onCancel={cancelEdit}
            onSave={saveSection}
            viewChildren={
              <>
                <InfoRow label="المحافظة" value={form.governorate} />
                <InfoRow label="المدينة / المركز" value={form.city} />
                <InfoRow label="الشارع / العنوان التفصيلي" value={form.street} />
                <InfoRow label="توضيحات الموقع" value={form.description} />
              </>
            }
          >
            <SelectField
              label="المحافظة *"
              required
              value={draft.governorate}
              onChange={(e) => {
                const gov = e.target.value;
                setDraft((d) => ({ ...d, governorate: gov, city: "" }));
                setSelectedVillage("");
              }}
              options={[
                { label: "-- اختر المحافظة --", value: "" },
                ...GOVERNORATES.map((g) => ({ label: g, value: g })),
              ]}
            />
            <SelectField
              label="المدينة / المركز *"
              required
              disabled={!draft.governorate}
              value={draft.city}
              onChange={(e) => {
                updateDraft("city", e.target.value);
                setSelectedVillage("");
              }}
              options={availableCities}
            />
            <SelectField
              label="القرية / المنطقة (اختياري)"
              disabled={!draft.city}
              value={selectedVillage}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedVillage(v);
                updateDraftStreet(v === "other" ? "" : v, streetDetail);
              }}
              options={villageOptions}
              className="sm:col-span-2"
            />
            <Field
              label="اسم الشارع / تفاصيل العنوان"
              value={streetDetail}
              onChange={(e) => {
                setStreetDetail(e.target.value);
                updateDraftStreet(selectedVillage === "other" ? "" : selectedVillage, e.target.value);
              }}
              placeholder="مثال: شارع المحطة / بجوار المخبز الآلي"
              className="sm:col-span-2"
            />
            <TextAreaField
              label="توضيحات الموقع (علامات مميزة)"
              value={draft.description ?? ""}
              onChange={(e) => updateDraft("description", e.target.value)}
              placeholder="أدخل تفاصيل إضافية للعنوان أو علامات مميزة للوصول للعيادة..."
              className="sm:col-span-2"
            />
          </Section>

          {/* ── Section 3: Contact ────────────────────────── */}
          <Section
            title="بيانات التواصل"
            icon="📞"
            editing={isEditing("contact")}
            saving={saving}
            onEdit={() => startEdit("contact")}
            onCancel={cancelEdit}
            onSave={saveSection}
            viewChildren={
              <>
                <InfoRow label="رقم الهاتف" value={form.phoneNumber} />
                <InfoRow label="البريد الإلكتروني" value={form.email} />
              </>
            }
          >
            <Field
              label="رقم الهاتف المصري *"
              required
              inputMode="tel"
              value={draft.phoneNumber}
              onChange={(e) => updateDraft("phoneNumber", e.target.value)}
              placeholder="مثال: 01012345678"
            />
            <Field
              label="البريد الإلكتروني *"
              type="email"
              required
              value={draft.email}
              onChange={(e) => updateDraft("email", e.target.value)}
              placeholder="example@domain.com"
            />
          </Section>

          {/* Create button only if clinic doesn't exist yet */}
          {!exists && (
            <Button
              type="button"
              className="w-full text-base font-bold shadow-glow-cyan"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setSectionError(null);
                try {
                  await createClinic(draft);
                  setForm({ ...draft });
                  setExists(true);
                  setGlobalSuccess("تم إنشاء بيانات العيادة بنجاح ✓");
                  setTimeout(() => setGlobalSuccess(null), 4000);
                } catch (err) {
                  setSectionError(err instanceof ApiError ? err.message : "تعذّر إنشاء العيادة");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "جارٍ الحفظ..." : "💾 إنشاء وحفظ بيانات العيادة"}
            </Button>
          )}
        </div>
      )}

      {/* ══════════════════════ PUBLIC PREVIEW ════════════════════════════ */}
      {activeTab === "public" && (
        <Card glass vibrant className="p-6 md:p-8 shadow-2xl animate-fade-in border-accent/30">
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-extrabold text-text-primary flex items-center gap-2">
                <span>🌐</span>
                <span>بطاقة العيادة المعروضة للمرضى</span>
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                هكذا تظهر بيانات عيادتك تماماً للمرضى عند تصفح العيادات على المنصة.
              </p>
            </div>
            <span className="rounded-full bg-success/20 border border-success/30 px-3 py-1 text-xs font-extrabold text-success">
              معاينة حية 🟢
            </span>
          </div>

          <div className="rounded-3xl border border-primary/30 bg-surface-raised p-6 md:p-8 shadow-xl flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
              <div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary">
                  {form.specialization || "التخصص الطبي"}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-text-primary mt-2">
                  {form.name || "اسم العيادة الطبية"}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  📍 {form.governorate || "المحافظة"}، {form.city || "المدينة"}
                  {form.street ? ` — ${form.street}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-xs text-text-secondary">سعر الكشف</span>
                <span className="font-display text-2xl font-black text-accent">
                  {form.consultationPrice ? `${form.consultationPrice} ج.م` : "—"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-text-secondary mb-1">عن العيادة والموقع:</h4>
              <p className="text-sm leading-relaxed text-text-primary">
                {form.description || <span className="italic opacity-50">لم يتم إضافة تفاصيل الموقع بعد.</span>}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 border border-border/60">
                <span className="text-xl">📱</span>
                <div>
                  <p className="text-[11px] font-extrabold text-text-secondary">رقم الاستعلام والحجز</p>
                  <p className="text-sm font-bold text-text-primary" dir="ltr">{form.phoneNumber || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 border border-border/60">
                <span className="text-xl">✉️</span>
                <div>
                  <p className="text-[11px] font-extrabold text-text-secondary">البريد الإلكتروني</p>
                  <p className="text-sm font-bold text-text-primary">{form.email || "—"}</p>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => setActiveTab("private")}
                className="font-bold flex items-center gap-2"
              >
                <span>✏️</span>
                <span>تعديل بيانات العيادة</span>
              </Button>
              <Link href="/clinics">
                <Button variant="vibrant" size="lg" className="font-bold shadow-glow-cyan">
                  احجز موعدك الآن في هذه العيادة 🗓️
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
