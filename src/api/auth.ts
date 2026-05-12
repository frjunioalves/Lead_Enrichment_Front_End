import { apiClient } from './client';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function postLogin(body: { email: string; senha: string }): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/api/auth/login', body);
  return res.data;
}

export async function postRegister(body: { nome: string; email: string; senha: string }): Promise<AuthUser> {
  const res = await apiClient.post<AuthUser>('/api/auth/register', body);
  return res.data;
}
