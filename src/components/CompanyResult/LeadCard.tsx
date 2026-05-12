import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

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
          {/* Telefone do lead sempre presente — abre WhatsApp Web diretamente */}
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
      </CardContent>
    </Card>
  );
}
