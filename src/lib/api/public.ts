import { apiFetch } from "@/lib/http";
import type { ApiEnvelope, Clinic } from "@/types/api";

// GET /public/clinics
export async function getPublicClinics() {
  try {
    return await apiFetch<ApiEnvelope<{ clinics: Clinic[] }>>("/public/clinics");
  } catch (err) {
    console.warn("Public /clinics endpoint not found or failed.");
    return {
      success: true,
      message: "No clinics found",
      data: {
        clinics: [],
      },
    };
  }
}

// GET /public/clinics/:id
export async function getPublicClinicById(id: string) {
  try {
    return await apiFetch<ApiEnvelope<{ clinic: Clinic }>>(`/public/clinics/${id}`);
  } catch (err) {
    console.warn(`Public /clinics/${id} endpoint not found.`);
    throw new Error("لم يتم العثور على العيادة المطلوبة");
  }
}
