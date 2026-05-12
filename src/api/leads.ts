import { apiClient } from "./client";
import type { LeadEnrichedResponse } from "@/types/company";
import type { LeadFormData } from "@/schemas/leadSchema";

// Envia dados do lead ao backend, que consulta a BrasilAPI e salva o histórico
export async function postEnrichLead(
  body: LeadFormData
): Promise<LeadEnrichedResponse> {
  const { data } = await apiClient.post<LeadEnrichedResponse>(
    "/api/leads/enrich",
    body
  );
  return data;
}
