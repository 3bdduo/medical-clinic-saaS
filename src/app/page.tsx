import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

const FEATURES = [
  {
    title: "إدارة المواعيد الذكية",
    desc: "جدولة وتأكيد وتعديل مواعيد المرضى في مكان واحد، بدون أي تعارض في الأوقات مع تنبيهات فورية.",
    badge: "فوري ومباشر",
    icon: (
      <svg className="h-6 w-6 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    title: "سجلات طبية بالذكاء الاصطناعي",
    desc: "استخراج التشخيص والأدوية تلقائيًا من صورة الروشتة فور رفعها للمراجعة والحفظ بأمان.",
    badge: "ذكاء اصطناعي",
    icon: (
      <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "لوحة تحكم وشاشات لمسية",
    desc: "متابعة عدد المرضى والأطباء والاشتراكات والتقارير المالية من مكان واحد برؤية تحليلية شاطئة.",
    badge: "تحليلات متكاملة",
    icon: (
      <svg className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
];

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
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="vibrant" size="sm">ابدأ الآن مجانًا</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 md:px-12">
        {/* Hero Section */}
        <section className="grid items-center gap-12 py-12 md:grid-cols-2 md:py-24">
          <div className="flex flex-col items-start text-right animate-fade-in-slow">
            {/* Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary shadow-glow-cyan">
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow" />
              المنصة الطبية الأكثر تطورًا لإدارة العيادات
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.2] tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              عيادتك، منظمة بالكامل
              <br />
              <span className="gradient-text-alive">
                من الحجز للسجل الطبي
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">
              تطبيق SaaS حيوي وفائق السرعة يربط الأطباء والمرضى والإدارة في بيئة رقمية أنيقة — مواعيد بدون تعارض، وسجلات ذكية، وألوان تنبض بالحياة.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button variant="vibrant" size="lg" className="shadow-glow-cyan">
                  سجّل عيادتك الآن
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>

          </div>

          {/* Hero Image / Card Preview */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-primary/20 bg-surface shadow-2xl transition-all duration-600 ease-silky hover:scale-[1.015] hover:border-primary/50 animate-scale-in-slow">
            <Image
              src="/images/hero-clinic-1.jpg"
              alt="طبيب أثناء الفحص داخل العيادة"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-800 ease-silky hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            
            {/* Floating Glass Badge */}
            <div className="glass-alive absolute bottom-6 right-6 left-6 flex items-center justify-between rounded-2xl p-4 shadow-xl border border-primary/30">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-slate-950 font-black text-lg shadow-glow-cyan">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold text-text-primary">نظام إدارة فائق الذكاء</p>
                  <p className="text-xs text-text-secondary">تحديث فوري وتنبيهات فورية للمرضى</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-extrabold text-text-primary md:text-4xl">
              كل ما تحتاجه لإدارة عيادتك بأعلى حيوية
            </h2>
            <p className="mt-3 text-sm text-text-secondary max-w-md mx-auto">
              أنظمة متكاملة تجمع بين السرعة الفائقة والجمال البصري الرائع
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} hover glass vibrant className="group flex flex-col justify-between gap-5 p-7">
                <div className="flex items-center justify-between">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary-soft p-3 transition-transform duration-450 ease-silky group-hover:scale-110">
                    {f.icon}
                  </div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">
                    {f.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {f.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Secondary Showcase Section */}
        <section className="grid items-center gap-12 py-16 md:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-accent/20 bg-surface shadow-2xl md:order-2 transition-transform duration-600 ease-silky hover:scale-[1.015]">
            <Image
              src="/images/hero-clinic-2.jpg"
              alt="فريق طبي في مكان العمل"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-800 ease-silky hover:scale-105"
            />
          </div>
          <div className="md:order-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-accent">
              تجربة مستخدم حيوية وناعمة
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-snug text-text-primary md:text-4xl">
              تفاعلات حريرية، وألوان تنبض بالحياة
            </h2>
            <p className="mt-4 leading-relaxed text-text-secondary text-base">
              كل انتقالة تم ضبطها بعناية فائقة لتكون ناعمة وبطيئة بانسيابية تامة. لا يوجد أي تقطيع أو قفزات مفاجئة، مع التبديل السلس بين الفاتح والداكن بألوان متناسقة ومريحة للعين.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                استجابة فائقة السرعة بدون أي تأخير
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                تدرجات حية تمنح الواجهة طابعًا مريحًا وواضحًا
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
