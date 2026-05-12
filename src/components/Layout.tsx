import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from './Sidebar';

export function Layout() {
  const token = useAuthStore((s) => s.token);

  // Guard de rota: redireciona sem adicionar entrada no histórico (replace) para não quebrar o botão voltar
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
