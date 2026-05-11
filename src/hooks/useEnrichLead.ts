import { useQuery } from "@tanstack/react-query";
import { postEnrichLead } from "@/api/leads";
import type { LeadFormData } from "@/schemas/leadSchema";

export function useEnrichLead(formData: LeadFormData | null) {
  return useQuery({
    queryKey: ["lead", formData?.cnpj.replace(/\D/g, "")],
    queryFn: () => postEnrichLead(formData!),
    // Só dispara quando o usuário submeter o formulário
    enabled: !!formData,
    // Substitui o cache manual de 5 min que existia em HomePage
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
