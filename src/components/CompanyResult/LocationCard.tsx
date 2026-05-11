import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnrichedCompany } from "@/types/company";

interface LocationCardProps {
  endereco: EnrichedCompany["endereco"];
}

export function LocationCard({ endereco }: LocationCardProps) {
  const { logradouro, municipio, uf, cep } = endereco;

  const isEmpty = !logradouro && !municipio && !uf && !cep;
  if (isEmpty) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Localização</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {logradouro && <p>{logradouro}</p>}
        <p className="text-muted-foreground">
          {[municipio, uf].filter(Boolean).join(" / ")}
          {cep && ` · CEP ${cep}`}
        </p>
      </CardContent>
    </Card>
  );
}
