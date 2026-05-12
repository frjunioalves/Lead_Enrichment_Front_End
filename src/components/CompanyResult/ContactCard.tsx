import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

interface ContactCardProps {
  telefone: string | null;
  email: string | null;
}

export function ContactCard({ telefone, email }: ContactCardProps) {
  // Contato da empresa é opcional na BrasilAPI — oculta o card inteiro se ambos estiverem ausentes
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
            <a
              href={buildWhatsAppUrl(telefone)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              <MessageCircle className="size-3.5" />
              {telefone}
            </a>
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
