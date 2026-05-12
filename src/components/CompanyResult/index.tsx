import type { LeadEnrichedResponse } from "@/types/company";
import { CompanyCard } from "./CompanyCard";
import { LocationCard } from "./LocationCard";
import { ContactCard } from "./ContactCard";
import { LeadCard } from "./LeadCard";
import { ExportMenu } from "@/components/ExportMenu";
import { mapToExportRow } from "@/utils/exportRow";

interface CompanyResultProps {
  data: LeadEnrichedResponse;
}

export function CompanyResult({ data }: CompanyResultProps) {
  const { empresa, nome, email, telefone } = data;

  return (
    <div className="w-full max-w-2xl grid gap-4">
      {/* ExportMenu recebe um único elemento — o resultado atual — permitindo exportar apenas este lead */}
      <div className="flex justify-end">
        <ExportMenu rows={[mapToExportRow(data)]} />
      </div>
      <CompanyCard empresa={empresa} />
      <LocationCard endereco={empresa.endereco} />
      <ContactCard telefone={empresa.telefone} email={empresa.email} />
      <LeadCard nome={nome} email={email} telefone={telefone} />
    </div>
  );
}
