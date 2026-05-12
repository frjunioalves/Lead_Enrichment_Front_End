import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { Layout } from '@/components/Layout';

function App() {
  return (
    <Routes>
      {/* Rotas públicas — acessíveis sem autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas — Layout redireciona para /login se não houver token */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/history/:id" element={<HistoryPage />} />
      </Route>

      {/* Qualquer rota desconhecida cai na home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
