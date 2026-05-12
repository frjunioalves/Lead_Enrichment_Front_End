import { LogOut, User, Clock, Building2, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';
import { useLeadHistory } from '@/hooks/useLeadHistory';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: history = [], isLoading } = useLeadHistory();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Usuário logado */}
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user?.nome}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Buscar */}
      <div className="px-3 pt-3">
        <Button
          variant={location.pathname === '/' ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => navigate('/')}
        >
          <Search className="size-4" />
          Buscar
        </Button>
      </div>

      {/* Histórico */}
      <div className="flex flex-1 flex-col overflow-hidden px-3 py-3">
        <div className="mb-2 flex items-center gap-1.5 px-1">
          <Clock className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Histórico
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5">
          {isLoading && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Carregando...
            </p>
          )}

          {!isLoading && history.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Nenhuma busca realizada ainda.
            </p>
          )}

          {history.map((item) => {
            const isActive = location.pathname === `/history/${item.id}`;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/history/${item.id}`)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60'
                )}
              >
                <Building2
                  className={cn(
                    'mt-0.5 size-3.5 shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">
                    {item.empresaNomeFantasia ?? item.empresaRazaoSocial}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.leadNome}</p>
                  <p className="text-xs text-muted-foreground/70">
                    {new Date(item.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
