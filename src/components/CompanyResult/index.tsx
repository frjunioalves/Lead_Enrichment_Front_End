import type { LeadEnrichedResponse } from "@/types/company";
import { CompanyCard } from "./CompanyCard";
import { LocationCard } from "./LocationCard";
import { ContactCard } from "./ContactCard";
import { LeadCard } from "./LeadCard";

interface CompanyResultProps {
  data: LeadEnrichedResponse;
}

export function CompanyResult({ data }: CompanyResultProps) {
  const { empresa, nome, email, telefone } = data;

  return (
    <div className="w-full max-w-2xl grid gap-4">
      <CompanyCard empresa={empresa} />
      <LocationCard endereco={empresa.endereco} />
      <ContactCard telefone={empresa.telefone} email={empresa.email} />
      <LeadCard nome={nome} email={email} telefone={telefone} />
    </div>
  );
}
