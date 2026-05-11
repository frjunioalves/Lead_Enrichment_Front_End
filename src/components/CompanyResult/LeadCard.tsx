import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadCardProps {
  nome: string;
  email: string;
  telefone: string;
}

export function LeadCard({ nome, email, telefone }: LeadCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Dados do Lead</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Nome</p>
          <p className="font-medium">{nome}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Telefone</p>
          <p className="font-medium">{telefone}</p>
        </div>
      </CardContent>
    </Card>
  );
}
