import { apiClient } from "./client";
import type { LeadEnrichedResponse } from "@/types/company";
import type { LeadFormData } from "@/schemas/leadSchema";

export async function postEnrichLead(
  body: LeadFormData
): Promise<LeadEnrichedResponse> {
  const { data } = await apiClient.post<LeadEnrichedResponse>(
    "/api/leads/enrich",
    body
  );
  return data;
}
