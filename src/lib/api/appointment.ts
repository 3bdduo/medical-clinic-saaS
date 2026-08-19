import { apiFetch } from "@/lib/http";
import type {
  ApiEnvelope,
  Appointment,
  CreateAppointmentByDoctorPayload,
  CreateAppointmentByPatientPayload,
  UpdateAppointmentPayload,
} from "@/types/api";

// POST /appointment/patient  (patient books with a doctor)
export function createAppointmentByPatient(
  payload: CreateAppointmentByPatientPayload
) {
  return apiFetch<ApiEnvelope<{ createdAppointment: Appointment }>>(
    "/appointment/patient",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

// POST /appointment/doctor/:patientId  (doctor books on behalf of a known patient)
export function createAppointmentByDoctor(
  patientId: string,
  payload: CreateAppointmentByDoctorPayload
) {
  return apiFetch<ApiEnvelope<{ createdAppointment: Appointment }>>(
    `/appointment/doctor/${patientId}`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

// DELETE /appointment/:id
export function deleteAppointment(id: string) {
  return apiFetch<ApiEnvelope<null>>(`/appointment/${id}`, {
    method: "DELETE",
  });
}

// GET /appointment  (role-scoped: doctor sees clinic appts, patient sees own)
export function getMyAppointments() {
  return apiFetch<ApiEnvelope<{ appointments: Appointment[] }>>("/appointment");
}

// GET /appointment/:id
export function getAppointmentById(id: string) {
  return apiFetch<ApiEnvelope<{ appointment: Appointment }>>(
    `/appointment/${id}`
  );
}

// PUT /appointment/:id
export function updateAppointment(id: string, payload: UpdateAppointmentPayload) {
  return apiFetch<ApiEnvelope<{ updatedAppointment: Appointment }>>(
    `/appointment/${id}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
}
