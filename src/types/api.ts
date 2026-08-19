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
}

export interface CreateAppointmentByPatientPayload {
  doctorId: string;
  date: string; // YYYY-MM-DD
}

export interface CreateAppointmentByDoctorPayload {
  patientId: string;
  date: string;
}

export interface UpdateAppointmentPayload {
  date?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface CreateMedicalRecordPayload {
  appointmentId: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  prescriptionImageUrl?: string;
  visibility: "private" | "shared";
}
