import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactCardProps {
  telefone: string | null;
  email: string | null;
}

export function ContactCard({ telefone, email }: ContactCardProps) {
  if (!telefone && !email) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Contato</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {telefone && (
          <div>
            <p className="text-muted-foreground">Telefone</p>
            <p className="font-medium">{telefone}</p>
          </div>
        )}
        {email && (
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{email}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
