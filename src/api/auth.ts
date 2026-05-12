import { apiClient } from './client';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

// Espelha a resposta do endpoint POST /api/auth/login
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// Retorna token JWT + dados do usuário para persistir no authStore
export async function postLogin(body: { email: string; senha: string }): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/api/auth/login', body);
  return res.data;
}

// Após o cadastro, redireciona para /login — não faz login automático
export async function postRegister(body: { nome: string; email: string; senha: string }): Promise<AuthUser> {
  const res = await apiClient.post<AuthUser>('/api/auth/register', body);
  return res.data;
}
