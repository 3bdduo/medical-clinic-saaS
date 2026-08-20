# عيادتي — Clinic SaaS Frontend

Next.js 14 (App Router) + Tailwind CSS frontend for the clinic-saas backend
(`https://multi-tenant-saas-ten.vercel.app`).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # points at the deployed API by default
npm run dev
```

Open http://localhost:3000.

## What's implemented

- **Theming**: full light/dark system using the exact CSS variables from the
  brief, mapped into Tailwind (`bg-primary`, `text-secondary`, etc.). Theme is
  applied via a blocking inline script in `layout.tsx` before hydration — no
  flash of the wrong theme. Toggle persists to `localStorage`.
- **Preloader**: `src/components/Preloader.tsx` — a custom heartbeat-pulse
  loader (concentric breathing circles + heartbeat line, primary teal) that
  preloads every image in `src/lib/assetManifest.ts` and prefetches every
  internal route before revealing the app. Runs once per browser session
  (`sessionStorage` flag), fades/scales out rather than cutting abruptly.
- **Ambient background**: slow, subtle gradient drift (`AmbientBackground.tsx`),
  pure CSS transform/opacity, respects `prefers-reduced-motion`.
- **API layer**: `src/lib/http.ts` is the single fetch wrapper — attaches the
  `Authorization` header, retries once on 401 via `/auth/refresh-token`, and
  normalizes errors into `ApiError`. Every backend resource has its own typed
  module under `src/lib/api/` (`auth`, `doctor`, `admin`, `appointment`,
  `patient`, `medicalRecord`) — see `docs/api-reference.md` for the full
  endpoint map extracted from the Postman collection.
- **Auth**: `src/hooks/useAuth.tsx` decodes the JWT client-side to get
  `role`/`userId`, no extra request needed. `RequireRole` guards each
  role's routes and redirects to `/login` otherwise.
- **Pages built so far**:
  - `/` — landing page (uses the two provided clinic photos)
  - `/login`, `/register` (doctor self-registration), `/forgot-password`
  - `/doctor`, `/doctor/appointments`, `/doctor/patients`, `/doctor/clinic`, `/doctor/notifications`
  - `/admin`, `/admin/doctors`, `/admin/clinics`
  - `/patient`, `/patient/appointments`, `/patient/records`, `/patient/notifications`

## Structure

```
src/
  app/                 route segments (App Router)
  components/
    ui/                Button, Field, Card, icons — no external icon lib
    layout/             DashboardShell (sidebar + topbar, shared by all 3 roles)
  hooks/               useAuth, useTheme (React context)
  lib/
    http.ts            fetch wrapper (auth header, refresh-on-401, ApiError)
    api/               one file per backend resource group
    assetManifest.ts   images to preload on first load — add new images here
    themeInitScript.ts blocking script injected in <head>
  types/api.ts         every request/response shape from the collection
docs/api-reference.md  full endpoint table + known gaps to confirm with backend
public/images/         the two clinic photos you provided
```

## Still to build (not in this pass)

- Patient detail page for doctors (`/doctor/patients/[id]`) with medical
  history + the prescription-image-extract flow (`/medical-record/extract`
  → review → `createMedicalRecord`).
- `/admin/clinics/[id]` and `/admin/doctors/[id]` detail views.
- Working-days picker UI for the clinic form (currently `workingDays` isn't
  editable from the clinic settings form yet — only sent as `[]`).
- A doctor-facing patient registration flow (`registerPatient` from
  `lib/api/auth.ts` is wired but has no page yet).
- A notification bell/badge in the dashboard topbar — the notification
  pages exist (`/doctor/notifications`, `/patient/notifications`) but
  there's no unread-count indicator yet.
- Real logo / brand images — only the two stock photos you uploaded exist
  right now; the "images_clinic" folder came through empty on upload.
- Route-level asset preloading is currently images-only; add PDFs/fonts to
  `assetManifest.ts` if you introduce more static assets.

See `docs/api-reference.md` → "Corrections made on the 2026-08-19 pass" for
what changed when the fuller Postman export (PDF) was compared against the
first one.

## Design tokens (from the brief, unchanged)

| Token | Light | Dark |
|---|---|---|
| bg | #F7F9FA | #12181A |
| surface | #FFFFFF | #1A2124 |
| primary | #0F7C8C | #3FC1D6 |
| accent | #4CAF8A | #6ED9A8 |
| danger | #D9534F | #E77873 |

Fonts: **Cairo** (Arabic + Latin body/UI text) and **Manrope** (Latin display
headings, falls back to Cairo for Arabic), both self-hosted via `next/font`.

The app ships RTL (`dir="rtl"`, `lang="ar"`) since the API data (clinic names,
etc.) is Arabic — flip this in `src/app/layout.tsx` if you need LTR instead.
