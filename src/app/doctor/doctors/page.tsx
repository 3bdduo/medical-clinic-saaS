"use client";

import { useState, useEffect } from "react";
import { DoctorActivationBanner } from "@/components/DoctorActivationBanner";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ClinicDoctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  price: number;
  active: boolean;
}

export default function ClinicDoctorsPage() {
  const [doctors, setDoctors] = useState<ClinicDoctor[]>([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");
  const [price, setPrice] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("clinic_doctors_list");
    if (saved) {
      try {
        setDoctors(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  function saveDoctors(newList: ClinicDoctor[]) {
    setDoctors(newList);
    localStorage.setItem("clinic_doctors_list", JSON.stringify(newList));
  }

  function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !specialty || !phone) return;

    const newDoc: ClinicDoctor = {
      id: `doc-${Date.now()}`,
      name,
      specialty,
      phone,
      price: Number(price) || 300,
      active: true,
    };

    const updated = [newDoc, ...doctors];
    saveDoctors(updated);
    setName("");
    setSpecialty("");
    setPhone("");
    setPrice("");
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  }

  function toggleActive(id: string) {
    const updated = doctors.map((d) => (d.id === id ? { ...d, active: !d.active } : d));
    saveDoctors(updated);
  }

  function removeDoctor(id: string) {
    const updated = doctors.filter((d) => d.id !== id);
    saveDoctors(updated);
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DoctorActivationBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text-primary">
          إدارة أطباء العيادة
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          إضافة أطباء جدد إلى طاقم العيادة، تحديد تخصصاتهم، وإدارة صلاحيات المواعيد
        </p>
      </div>

      {/* Add Doctor Card */}
      <Card glass vibrant className="max-w-2xl border-primary/20 p-6 md:p-8 shadow-2xl">
        <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span>👨‍⚕️</span>
          <span>إضافة طبيب جديد للعيادة</span>
        </h2>

        <form onSubmit={handleAddDoctor} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="اسم الطبيب بالكامل *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: د. زياد الكردي"
            className="sm:col-span-2"
          />

          <Field
            label="التخصص الطبي *"
            required
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="مثال: أطفال وحديثي الولادة"
          />

          <Field
            label="رقم الهاتف / الواتساب *"
            required
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 01012345678"
          />

          <Field
            label="سعر الكشف (ج.م)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثال: 350"
            className="sm:col-span-2"
          />

          {successMsg && (
            <div className="sm:col-span-2 rounded-xl bg-success/10 border border-success/20 p-3 text-xs font-bold text-success animate-fade-in">
              تمت إضافة الطبيب بنجاح إلى طاقم العيادة!
            </div>
          )}

          <Button type="submit" variant="vibrant" className="mt-2 sm:col-span-2 shadow-glow-cyan font-bold">
            + إضافة الطبيب لطاقم العيادة
          </Button>
        </form>
      </Card>

      {/* Active Doctors List */}
      <Card className="max-w-2xl">
        <h2 className="font-display text-base font-bold text-text-primary mb-4">
          الأطباء النشطين في العيادة ({doctors.length})
        </h2>

        <div className="flex flex-col divide-y divide-border/60">
          {doctors.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 font-black text-primary text-base">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
                    <span>{doc.specialty}</span>
                    <span>•</span>
                    <span dir="ltr">{doc.phone}</span>
                    <span>•</span>
                    <span className="text-accent font-bold">{doc.price} ج.م</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(doc.id)}
                  className={`rounded-full px-3 py-1 text-xs font-extrabold transition-colors ${
                    doc.active ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                  }`}
                >
                  {doc.active ? "نشط" : "متوقف"}
                </button>

                <Button size="sm" variant="danger" onClick={() => removeDoctor(doc.id)}>
                  حذف
                </Button>
              </div>
            </div>
          ))}

          {doctors.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">
              لا يوجد أطباء مضافين حتى الآن
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
