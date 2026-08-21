// Types derived from the clinic-saas Postman collection
// Groups: auth, doctor, admin, appointment, patient, medical-record

export type Role = "Admin" | "Doctor" | "Patient";

export interface ApiEnvelope<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface WorkingDay {
  day:
    | "saturday"
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday";
  from: string; // ISO time
  to: string; // ISO time
}

export interface Clinic {
  _id: string;
  doctorId: string | { _id: string; role: Role; firstName: string; lastName: string };
  name: string;
  description?: string;
  phoneNumber: string;
  email: string;
  street?: string;
  governorate: string;
  city: string;
  specialization: string;
  consultationPrice: number;
  workingDays: WorkingDay[];
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  _id: string;
  userName: string;
  email: string;
  role: "Doctor";
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isPaid: boolean;
  paidExpired: string;
  createdAt: string;
  updatedAt: string;
  clinicId?: string | Clinic;
}

export interface Admin {
  _id: string;
  userName: string;
  email: string;
  role: "Admin";
  phoneNumber: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  userName?: string;
  email: string;
  nationalId?: string;
  role: "Patient";
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  _id: string;
  patientId: string | Patient;
  doctorId: string | Doctor;
  clinicId: string | Clinic;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  name: string;
  dosage: string | null;
  frequency: string;
  duration: string;
}

export interface ExtractedPrescription {
  diagnosis: string;
  medications: Medication[];
  notes: string;
}

export interface MedicalRecord {
  _id: string;
  appointmentId: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  prescriptionImageUrl?: string;
  visibility: "private" | "shared";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalDoctor: number;
  activeDoctors: number;
  expiredSubscriptions: number;
  totalPatients: number;
  totalClinics: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  role: Role;
  iat: number;
  exp: number;
}

// ---- Request payload shapes ----

export interface RegisterDoctorPayload {
  nationalId: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface RegisterPatientPayload {
  nationalId: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface LoginPayload {
  nationalId: string;
  password: string;
}

export interface SendOtpPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface CreateClinicPayload {
  name: string;
  description?: string;
  phoneNumber: string;
  email: string;
  governorate: string;
  city: string;
  street?: string;
  specialization: string;
  consultationPrice: number;
  workingDays: WorkingDay[];
  slotDuration?: number; // minutes per appointment slot, e.g. 30
}

export interface CreateAppointmentByPatientPayload {
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
}

// Path is /appointment/doctor/:patientId — the patient is identified in the
// URL; the body only carries which doctor + date (confirmed against the
// Postman collection's saved example, 2026-08-19 pass).
export interface CreateAppointmentByDoctorPayload {
  doctorId: string;
  date: string;
  startTime?: string;
}

// Confirmed against the collection: the only field ever shown in the saved
// example body is `status`. Treating date/notes as unsupported until the
// backend team confirms otherwise — sending them may simply be ignored, or
// may 400; don't rely on it.
export interface UpdateAppointmentPayload {
  status: AppointmentStatus;
}

export interface CreateMedicalRecordPayload {
  appointmentId: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  prescriptionImageUrl?: string;
  visibility: "private" | "shared";
}

export interface RenewDoctorSubscriptionPayload {
  monthNumber: number;
}

// ---- notification ----
// Doctor-created, patient-facing notifications. Doctor and patient each have
// their own mirrored set of endpoints (get/delete by id, get/delete all).

export interface Notification {
  _id: string;
  patientId: string | Patient;
  title: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationPayload {
  patientId: string;
  title: string;
  message: string;
}

export interface UpdateNotificationPayload {
  title?: string;
  message: string;
}
