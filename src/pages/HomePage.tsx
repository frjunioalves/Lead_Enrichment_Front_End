import { LeadForm } from "@/components/LeadForm";
import type { LeadFormData } from "@/schemas/leadSchema";

export function HomePage() {
  function handleSearch(cnpj: string, data: LeadFormData) {
    // FE-05 substituirá este log pelo hook useCompanyQuery
    console.log("CNPJ limpo:", cnpj);
    console.log("Dados do lead:", data);
  }

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

      <LeadForm onSubmit={handleSearch} />
    </div>
  );
}
