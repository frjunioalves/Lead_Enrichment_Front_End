import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EnrichedCompany } from "@/types/company";

// Mapeia os valores de situacaoCadastral da Receita Federal para variantes visuais do Badge.
// Statuses não mapeados (ex: "Em Liquidação") caem no fallback "secondary".
const statusVariant: Record<string, "default" | "destructive" | "secondary"> = {
  Ativa: "default",
  Baixada: "destructive",
  Inativa: "destructive",
  Suspensa: "secondary",
  Inapta: "secondary",
};

interface CompanyCardProps {
  empresa: EnrichedCompany;
}

export function CompanyCard({ empresa }: CompanyCardProps) {
  const variant = statusVariant[empresa.situacaoCadastral] ?? "secondary";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{empresa.razaoSocial}</CardTitle>
            {empresa.nomeFantasia && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {empresa.nomeFantasia}
              </p>
            )}
          </div>
          <Badge variant={variant}>{empresa.situacaoCadastral}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">CNPJ</p>
          <p className="font-medium">{empresa.cnpj}</p>
        </div>
        {empresa.dataAbertura && (
          <div>
            <p className="text-muted-foreground">Abertura</p>
            <p className="font-medium">{empresa.dataAbertura}</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground">Porte</p>
          <p className="font-medium">{empresa.faixaFuncionarios}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Segmento</p>
          <p className="font-medium">{empresa.segmento}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground">CNAE</p>
          <p className="font-medium">
            {empresa.cnae.codigo} — {empresa.cnae.descricao}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
