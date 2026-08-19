import { apiFetch } from "@/lib/http";
import type {
  ApiEnvelope,
  CreateMedicalRecordPayload,
  ExtractedPrescription,
  MedicalRecord,
} from "@/types/api";

// POST /medical-record/extract
// Sends a prescription image (multipart) to the AI extractor; returns a
// structured draft the doctor reviews before saving via createMedicalRecord.
export async function extractFromPrescriptionImage(file: File) {
  const form = new FormData();
  form.append("image", file);

  return apiFetch<
    ApiEnvelope<{ imageUrl: { url: string }; extracted: ExtractedPrescription }>
  >("/medical-record/extract", {
    method: "POST",
    body: form,
    headers: {}, // let the browser set multipart boundary; apiFetch adds Authorization
  });
}

// POST /medical-record
// visibility: "private" (doctor-only) | "shared" (visible to the patient)
export function createMedicalRecord(payload: CreateMedicalRecordPayload) {
  return apiFetch<ApiEnvelope<{ createdMedicalRecord: MedicalRecord }>>(
    "/medical-record",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

// GET /medical-record/patient/:patientId  (doctor viewing a patient's records)
export function getMedicalRecordsForPatient(patientId: string) {
  return apiFetch<ApiEnvelope<{ medicalRecords: MedicalRecord[] }>>(
    `/medical-record/patient/${patientId}`
  );
}

// GET /medical-record/:id
export function getMedicalRecordById(id: string) {
  return apiFetch<ApiEnvelope<{ medicalRecord: MedicalRecord }>>(
    `/medical-record/${id}`
  );
}

// GET /medical-record  (patient viewing their own shared records)
export function getMyMedicalRecords() {
  return apiFetch<ApiEnvelope<{ medicalRecords: MedicalRecord[] }>>(
    "/medical-record"
  );
}
