import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { useLeadHistory } from '@/hooks/useLeadHistory';
import { CompanyResult } from '@/components/CompanyResult';
import { Button } from '@/components/ui/button';
import { mapHistoryToResponse } from '@/utils/mapHistory';

export function HistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: history = [], isLoading } = useLeadHistory();

  const item = history.find((h) => h.id === id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">Registro não encontrado.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center gap-6 p-6">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="size-4" />
          Nova busca
        </Button>

        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {item.empresaNomeFantasia ?? item.empresaRazaoSocial}
          </h1>
          <p className="text-sm text-muted-foreground">
            Consultado em {new Date(item.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <CompanyResult data={mapHistoryToResponse(item)} />
    </div>
  );
}
