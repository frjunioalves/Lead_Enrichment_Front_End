import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Normaliza erros de rede e de API em um objeto {status, message} uniforme.
// A cadeia de fallback cobre: campo `error` (erros simples) → `errors[0].message`
// (erros de validação em array) → mensagem genérica (timeout, rede, etc).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.error ??
      error.response?.data?.errors?.[0]?.message ??
      "Erro inesperado. Tente novamente.";
    return Promise.reject({ status, message });
  }
);
