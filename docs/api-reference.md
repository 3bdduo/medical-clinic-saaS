# API Reference — clinic-saas

Base URL: `https://multi-tenant-saas-ten.vercel.app`
All responses: `{ message, success, data }`. Auth: `Authorization: <accessToken>` header (no `Bearer` prefix, per the collection's examples).

## auth
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | /auth/register/doctor | nationalId, password, firstName, lastName, phoneNumber, email | Public. Creates the clinic-owner account. |
| POST | /auth/register/patient | nationalId, password, firstName, lastName, phoneNumber, email | Requires **doctor's** Authorization header — a doctor registers their patient. |
| POST | /auth/login | nationalId, password | Returns `{ accessToken, refreshToken }`. Works for all 3 roles. |
| POST | /auth/refresh-token | refreshToken | Returns `{ result: { accessToken, refreshToken } }`. |
| POST | /auth/send-otp | email | Step 1 of password reset. |
| POST | /auth/reset-password | email, otp, newPassword | Step 2 of password reset. |

## doctor (Authorization required)
| Method | Path | Body | Notes |
|---|---|---|---|
| GET | /doctor | — | Current doctor profile, includes populated `clinicId`. |
| PUT | /doctor | any doctor field | Partial update. |
| DELETE | /doctor | — | Deletes own account. |
| POST | /doctor/register/clinic | name, description, phoneNumber, email, governorate, city, street, specialization, consultationPrice, workingDays[] | Creates the doctor's one clinic. |
| PUT | /doctor/clinic | any clinic field | Updates the doctor's clinic. |
| GET | /doctor/clinic | — | Fetch own clinic. |

## admin (Authorization required)
| Method | Path | Notes |
|---|---|---|
| GET | /admin/dash-board | Returns `{ result: { totalDoctor, activeDoctors, expiredSubscriptions, totalPatients, totalClinics } }` |
| PUT | /admin | Partial update of own admin profile. |
| GET | /admin/profile | Own admin profile. |
| GET | /admin/doctors | All doctors (note: response includes hashed `password` and `otp` fields — **strip before rendering**). |
| GET | /admin/doctors/:id | Single doctor + populated clinic. |
| GET | /admin/clinics | All clinics. |
| GET | /admin/clinics/:id | Single clinic. |
| PATCH | /admin/doctors/:id/active | Toggles/renews a doctor's subscription (`isPaid`). |
| DELETE | /admin/doctors/:id | Deletes a doctor. |
| DELETE | /admin/patients/:id | Deletes a patient. |

## appointment (Authorization required)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | /appointment/patient | doctorId, date (YYYY-MM-DD) | Patient books with a doctor. |
| POST | /appointment/doctor/:patientId | date | Doctor books on behalf of a known patient. |
| DELETE | /appointment/:id | — | Cancels/deletes. |
| GET | /appointment | — | Role-scoped list (doctor → clinic's appointments; patient → own). |
| GET | /appointment/:id | — | Single appointment, populated patient/clinic. |
| PUT | /appointment/:id | date?, status?, notes? | status ∈ pending / confirmed / completed / cancelled. |

## patient (Authorization required)
| Method | Path | Notes |
|---|---|---|
| GET | /patient | Own profile (patient role). |
| GET | /patient/lookup/:nationalId | Doctor checks if a patient already exists before creating a new one. |
| GET | /patient/my-patients | Doctor's patient list. |
| GET | /patient/my-patient/:id | Doctor viewing one patient. |
| PUT | /patient | Patient updates own profile. |
| PUT | /patient/:id | Doctor updates a patient's record. |

## medical-record (Authorization required)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | /medical-record/extract | multipart `image` | AI-extracts diagnosis/medications/notes from a prescription photo. Returns a **draft** — doctor must review before saving. |
| POST | /medical-record | appointmentId, diagnosis, medications[], notes, prescriptionImageUrl, visibility | `visibility` ∈ `private` (doctor-only) / `shared` (visible to patient). |
| GET | /medical-record/patient/:patientId | — | Doctor viewing a patient's records. |
| GET | /medical-record/:id | — | Single record. |
| GET | /medical-record | — | Patient's own shared records. |

## notification (Authorization required)
Doctor and patient each have their own mirrored set of routes — doctor routes
have no `/patient` segment, patient routes do.

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | /notification | patientId, title, message | Doctor sends a notification to one of their patients. |
| PUT | /notification/:id | message | Doctor edits a sent notification. |
| GET | /notification | — | Doctor: every notification they've sent. |
| GET | /notification/:id | — | Doctor: single notification. |
| DELETE | /notification/:id | — | Doctor: delete one. |
| DELETE | /notification | — | Doctor: delete all they've sent. |
| GET | /notification/patient | — | Patient: their notification inbox. |
| GET | /notification/patient/:id | — | Patient: single notification. |
| DELETE | /notification/patient/:id | — | Patient: delete one. |
| DELETE | /notification/patient | — | Patient: clear their inbox. |

## Corrections made on the 2026-08-19 pass (second Postman export)
The collection you shared changed/grew between the first `.mhtml` export and
this `.pdf` export. Fixed to match the newer, more complete version:
- **`PATCH /admin/doctors/:id/active`** does take a body: `{ "monthNumber": 2 }`.
  The frontend was calling it with no body — fixed, and the admin doctors
  page now prompts for a month count before renewing.
- **`POST /appointment/doctor/:patientId`** — confirmed the body is
  `{ doctorId, date }` (not `{ patientId, date }` — patientId only lives in
  the URL). The frontend had the payload type wrong — fixed.
- **`PUT /appointment/:id`** — the collection's only confirmed example body
  is `{ "status": "confirmed" }`. The frontend previously also offered
  `date`/`notes` on this payload with no confirmed example backing them —
  narrowed the type to `status` only until the backend team confirms more.
- Added the entire **notification** module (10 endpoints, table above) —
  it didn't exist in the first export at all.

## Known gaps to confirm with the backend team
- No endpoint for **listing a doctor's own appointments by date/availability**
  (needed for a real booking calendar) — likely `GET /appointment` needs
  date-range query params, unconfirmed.
- No image upload endpoint for clinic/doctor profile photos — only
  prescription images (`/medical-record/extract`).
- `admin/doctors` responses currently leak hashed passwords/OTP fields —
  flagged for the backend team, and stripped defensively in the frontend
  types/usage.
- `DELETE /appointment/:id` showed a leftover example body
  (`{doctorId, clinicId, date}`) in the collection, which is unusual for a
  DELETE — the frontend sends no body for this call; flag to the backend
  team if deletion behaves unexpectedly.
