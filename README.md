# 🩺 نبض | Nabd — Medical Clinic SaaS Frontend

تطبيق SaaS متطور وفائق السرعة لإدارة العيادات الطبية، المرضى، المواعيد، والسجلات الصحية الذكية.
مبني بأحدث تقنيات Next.js 14 (App Router) + Tailwind CSS ومربوط بالكامل مع البرمجيات الخلفية (`https://multi-tenant-saas-ten.vercel.app`).

---

## 🚀 النشر والرفع المباشر (Deployment Guide)

### 1. الرفع على Vercel (مباشر بضغطة زر)
1. قم بربط مستودع GitHub التالي بحسابك على Vercel:
   `https://github.com/3bdduo/medical-clinic-saaS.git`
2. إضافة متغير البيئة التالي في إعدادات Vercel:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://multi-tenant-saas-ten.vercel.app
   ```
3. اضغط على **Deploy** — المشروع مهيأ بملف `vercel.json` ليعمل فورياً وبدون أي خطأ.

---

### 2. الرفع على GitHub (Push to Remote)
تم إعداد المستودع المحلي بالكامل، يمكنك رفعه فورياً باستخدام الأوامر التالية:

```bash
git init
git add .
git commit -m "feat: Nabd SaaS ready for production deployment"
git branch -M main
git remote add origin https://github.com/3bdduo/medical-clinic-saaS.git
git push -u origin main --force
```

---

## 🛠️ التشغيل المحلي (Local Setup)

```bash
npm install
npm run dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000).

---

## 🌟 مميزات الهوية والتصميم

- **الهوية البصرية اللوجو الشفاف المزدوج (`Nabd Logo`)**: يتغير الشعار تلقائياً حسب الوضع الليلي والنهاري (شعار نيون السايان للوضع الليلي وزمردي طبي للوضع الفاتح).
- **إطار الشعار التفاعلي (`Interactive Frame Modal`)**: يعرض الشعار بالكامل في منتصف الشاشة مع إمكانية الإغلاق من أي مكان بالضغط الخارجي.
- **تحقق مصري شامل (Validation)**: فحص الرقم القومي المصري (14 رقم)، أرقام التليفونات، والأسماء بشكل فوري.
- **إلغاء التكرار**: زر تغيير الوضع الليلي/النهاري متاح بشكل منظم وأنيق في أعلى كافة الصفحات.
