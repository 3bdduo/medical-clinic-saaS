import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-600 ease-silky">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-surface/75 px-6 py-4 backdrop-blur-xl transition-all duration-450 md:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size="md" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-16">
        {/* Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-slow">
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary shadow-glow-cyan">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow" />
            المنصة الطبية الأكثر تطورًا لإدارة العيادات والحجوزات
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.2] tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            مرحباً بك في منصة <span className="gradient-text-alive">نبض | Nabd</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
            اختر وجهتك للدخول إلى الخدمة المناسبة لك فوراً
          </p>
        </div>

        {/* 2 HUGE SPLIT PORTAL CARDS */}
        <div className="grid gap-8 md:grid-cols-2 animate-scale-in-slow">
          {/* DOCTORS PORTAL CARD */}
          <Card
            hover
            glass
            vibrant
            className="group relative flex flex-col justify-between p-8 md:p-10 border-primary/30 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/70"
          >
            <div className="absolute top-4 left-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
              قسم الأطباء والعيادات
            </div>

            <div>
              {/* Icon / Image Header */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-surface shadow-glow-cyan transition-transform duration-500 group-hover:scale-110">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 0 0 4.5 2.6V5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V2.6a.3.3 0 0 0-.3-.3H4.8z" />
                  <path d="M8 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                  <path d="M16 8v11a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V8" />
                  <path d="M12 18a4 4 0 0 0 4-4V6H8v8a4 4 0 0 0 4 4z" />
                </svg>
              </div>

              <h2 className="font-display text-2xl font-extrabold text-text-primary md:text-3xl">
                بوابة الأطباء والعيادات
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                إدارة العيادة الكاملة، جدول المواعيد، سجلات المرضى بالذكاء الاصطناعي، وإشعارات الطاقم.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-border/60">
              <Link href="/register" className="w-full">
                <Button variant="vibrant" size="lg" className="w-full justify-center text-base font-bold shadow-glow-cyan">
                  تسجيل عيادة جديدة 🩺
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button variant="secondary" size="lg" className="w-full justify-center text-base font-semibold">
                  تسجيل الدخول كطبيب
                </Button>
              </Link>
            </div>
          </Card>

          {/* PATIENTS PORTAL CARD */}
          <Card
            hover
            glass
            vibrant
            className="group relative flex flex-col justify-between p-8 md:p-10 border-accent/30 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-accent/70"
          >
            <div className="absolute top-4 left-4 rounded-full bg-accent/10 px-3 py-1 text-xs font-extrabold text-accent">
              قسم المرضى والحجوزات
            </div>

            <div>
              {/* Icon / Image Header */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-surface shadow-glow-emerald transition-transform duration-500 group-hover:scale-110">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              <h2 className="font-display text-2xl font-extrabold text-text-primary md:text-3xl">
                بوابة المرضى والخدمات
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                تصفح العيادات المتاحة، حجز المواعيد، متابعة تخصصك المناسب، والاطلاع على السجلات الطبية.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-border/60">
              <Link href="/clinics" className="w-full">
                <Button variant="vibrant" size="lg" className="w-full justify-center text-base font-bold shadow-glow-emerald">
                  تصفح العيادات والحجز الآن ️
                </Button>
              </Link>
              <Link href="/patient" className="w-full">
                <Button variant="secondary" size="lg" className="w-full justify-center text-base font-semibold">
                  مواعيدي وسجلاتي الطبية
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
