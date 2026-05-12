# Sistema de Autenticação — Frontend

## Visão geral

Autenticação persistida no `localStorage` via Zustand. O token JWT é injetado automaticamente em todas as requisições Axios. Rotas privadas redirecionam para `/login` se não houver token.

## Dependências a instalar

```bash
npm install zustand react-router-dom
```

## Variáveis de ambiente (`.env`)

```env
VITE_API_URL=http://localhost:3000
```

## Arquivos a criar

### `src/store/authStore.ts`
Zustand com `persist` middleware (localStorage):

```ts
// Shape do store
{
  token: string | null;
  user: { id: string; nome: string; email: string } | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}
```

`setAuth` é chamado após login/registro bem-sucedido.  
`logout` limpa o store e navega para `/login`.

### `src/api/auth.ts`
| Função | Endpoint | Descrição |
|--------|----------|-----------|
| `postRegister(body)` | `POST /api/auth/register` | Cria conta, retorna `{ id, nome, email }` |
| `postLogin(body)` | `POST /api/auth/login` | Retorna `{ token, user }` |

### `src/api/history.ts`
| Função | Endpoint | Descrição |
|--------|----------|-----------|
| `getLeadHistory()` | `GET /api/leads/history` | Lista histórico do usuário autenticado |

### `src/schemas/authSchema.ts`
- `loginSchema` — `{ email, senha }`
- `registerSchema` — `{ nome, email, senha, confirmarSenha }` com `.refine` para checar senhas iguais

### `src/hooks/useLeadHistory.ts`
React Query hook que busca `GET /api/leads/history`.  
Query key: `["history"]`.  
Após enrich bem-sucedido em `HomePage`, invalidar essa query para atualizar a sidebar automaticamente.

### `src/pages/LoginPage.tsx`
- Formulário: e-mail + senha (React Hook Form + `loginSchema`)
- Submit → `postLogin` → `setAuth(token, user)` → navegar para `/`
- Link para `/register`

### `src/pages/RegisterPage.tsx`
- Formulário: nome + e-mail + senha + confirmar senha
- Submit → `postRegister` → navegar para `/login`
- Link para `/login`

### `src/components/Layout.tsx`
Wrapper das rotas autenticadas:
- Lê `token` do authStore; se ausente → `<Navigate to="/login" replace />`
- Renderiza `<Sidebar />` ao lado de `<Outlet />`

### `src/components/Sidebar.tsx`
| Seção | Conteúdo |
|-------|----------|
| Topo | Avatar + nome + e-mail do usuário logado |
| Meio | Lista de histórico de leads (usa `useLeadHistory`) — cada item mostra razão social + data |
| Rodapé | Botão "Sair" → `logout()` |

## Arquivos a modificar

### `src/api/client.ts`
Adicionar dois interceptors:

**Request** — injeta o token:
```ts
config.headers.Authorization = `Bearer ${useAuthStore.getState().token}`;
```

**Response** — trata 401:
```ts
if (error.response?.status === 401) {
  useAuthStore.getState().logout();
  window.location.href = '/login';
}
```

### `src/main.tsx`
Envolver o `<App />` com `<BrowserRouter>`.

### `src/App.tsx`
Definir as rotas com React Router:

```tsx
<Routes>
  {/* Públicas */}
  <Route path="/login"    element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Privadas — dentro do Layout (redireciona se sem token) */}
  <Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />
  </Route>
</Routes>
```

## Fluxo de navegação

```
Sem token → /login
  ↓ login ok → setAuth(token, user) → /

/register → cadastro → /login

/ (autenticado)
└── Layout
    ├── Sidebar
    │   ├── Nome + e-mail do usuário
    │   ├── Lista do histórico de leads
    │   └── Botão Sair → logout() → /login
    └── HomePage
        ├── LeadForm
        └── CompanyResult
            └── após enrich → invalida query ["history"] → sidebar atualiza
```

## Estado de autenticação — ciclo de vida

```
1. Usuário abre o app
   └── Zustand lê token do localStorage
       ├── token presente → acessa / normalmente
       └── token ausente → redirect /login

2. Login
   └── postLogin() → token + user → setAuth() → persist no localStorage

3. Requisição protegida
   └── Axios interceptor lê token do store → header Authorization

4. Token expirado (backend retorna 401)
   └── Axios interceptor → logout() → limpa localStorage → redirect /login

5. Logout manual
   └── logout() → limpa store → redirect /login
```
