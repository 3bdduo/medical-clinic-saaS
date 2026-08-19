import { apiFetch } from "@/lib/http";
import type {
  ApiEnvelope,
  Clinic,
  CreateClinicPayload,
  Doctor,
} from "@/types/api";

// GET /doctor
export function getMe() {
  return apiFetch<ApiEnvelope<Doctor & { clinicId?: Clinic }>>("/doctor");
}

// PUT /doctor
export function updateMe(payload: Partial<Doctor>) {
  return apiFetch<ApiEnvelope<Doctor>>("/doctor", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE /doctor
export function deleteMyAccount() {
  return apiFetch<ApiEnvelope<null>>("/doctor", { method: "DELETE" });
}

// POST /doctor/register/clinic
export function createClinic(payload: CreateClinicPayload) {
  return apiFetch<ApiEnvelope<Clinic>>("/doctor/register/clinic", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PUT /doctor/clinic
export function updateMyClinic(payload: Partial<CreateClinicPayload>) {
  return apiFetch<ApiEnvelope<Clinic>>("/doctor/clinic", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// GET /doctor/clinic
export function getMyClinic() {
  return apiFetch<ApiEnvelope<Clinic>>("/doctor/clinic");
}
