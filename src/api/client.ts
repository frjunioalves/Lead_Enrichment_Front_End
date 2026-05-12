import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Injeta o Bearer token em todas as requisições autenticadas
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado ou inválido: limpa o estado e redireciona para login
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    // Normaliza o erro para um objeto simples { status, message } consumido pelas páginas
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.error ??
      error.response?.data?.errors?.[0]?.message ??
      "Erro inesperado. Tente novamente.";
    return Promise.reject({ status, message });
  }
);
