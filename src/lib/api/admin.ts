import { apiFetch } from "@/lib/http";
import type { Admin, ApiEnvelope, Clinic, DashboardStats, Doctor } from "@/types/api";

// GET /admin/dash-board
export function getDashboard() {
  return apiFetch<ApiEnvelope<{ result: DashboardStats }>>("/admin/dash-board");
}

// PUT /admin
export function updateAdmin(payload: Partial<Admin>) {
  return apiFetch<ApiEnvelope<{ updatedAdmin: Admin }>>("/admin", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// GET /admin/profile
export function getAdminProfile() {
  return apiFetch<ApiEnvelope<{ admin: Admin }>>("/admin/profile");
}

// GET /admin/doctors
export function getDoctors() {
  return apiFetch<ApiEnvelope<{ doctors: Doctor[] }>>("/admin/doctors");
}

// GET /admin/doctors/:id
export function getDoctorById(id: string) {
  return apiFetch<ApiEnvelope<{ doctor: Doctor & { clinicId?: Clinic } }>>(
    `/admin/doctors/${id}`
  );
}

// GET /admin/clinics
export function getClinics() {
  return apiFetch<ApiEnvelope<{ clinics: Clinic[] }>>("/admin/clinics");
}

// GET /admin/clinics/:id
export function getClinicById(id: string) {
  return apiFetch<ApiEnvelope<{ clinic: Clinic }>>(`/admin/clinics/${id}`);
}

// PATCH /admin/doctors/:id/active  (renew / toggle subscription)
export function toggleDoctorSubscription(id: string) {
  return apiFetch<ApiEnvelope<{ doctor: Doctor }>>(
    `/admin/doctors/${id}/active`,
    { method: "PATCH" }
  );
}

// DELETE /admin/doctors/:id
export function deleteDoctor(id: string) {
  return apiFetch<ApiEnvelope<null>>(`/admin/doctors/${id}`, {
    method: "DELETE",
  });
}

// DELETE /admin/patients/:id
export function deletePatient(id: string) {
  return apiFetch<ApiEnvelope<null>>(`/admin/patients/${id}`, {
    method: "DELETE",
  });
}
