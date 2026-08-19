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

## Known gaps to confirm with the backend team
- No endpoint list was found for **listing a doctor's own appointments by date/availability** (needed for a real booking calendar) — likely `GET /appointment` needs date-range query params, unconfirmed.
- `PATCH /admin/doctors/:id/active` — unclear whether it *toggles* or *renews by N days*; frontend currently treats it as a single "renew" action.
- No image upload endpoint for clinic/doctor profile photos was present in the collection — only prescription images (`/medical-record/extract`).
- `admin/doctors` responses currently leak hashed passwords/OTP fields — flagged for the backend team, and stripped defensively in the frontend types/usage.
