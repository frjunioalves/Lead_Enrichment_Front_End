import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LeadForm } from "@/components/LeadForm";
import { CompanyResult } from "@/components/CompanyResult";
import { useEnrichLead } from "@/hooks/useEnrichLead";
import type { LeadFormData } from "@/schemas/leadSchema";

export function HomePage() {
  const [formData, setFormData] = useState<LeadFormData | null>(null);
  const queryClient = useQueryClient();

  const { data: result, error, isFetching } = useEnrichLead(formData);

  useEffect(() => {
    if (result) queryClient.invalidateQueries({ queryKey: ['history'] });
  }, [result, queryClient]);

  const apiError = error ? (error as { message: string }).message : null;

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Busca de Enriquecimento de CNPJ
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          Insira os detalhes da empresa para recuperar instantaneamente
          inteligência corporativa completa.
        </p>
      </div>

      <LeadForm onSubmit={(data) => setFormData(data)} isLoading={isFetching} />

      {apiError && (
        <p className="text-sm text-destructive">{apiError}</p>
      )}

      {result && <CompanyResult data={result} />}
    </div>
  );
}
