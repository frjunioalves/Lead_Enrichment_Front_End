# FE-05 — Requisição, Cache e Apresentação dos Dados da Empresa

**Branch:** `feat/lead-form` (branch atual)  
**Depende de:** FE-03 (LeadForm com validação Zod concluído)  
**Endpoint real:** `POST /api/leads/enrich` (ver `back-end/src/routes/lead.routes.ts`)

---

## Objetivo

Conectar o formulário já existente ao backend, gerenciar estado assíncrono com React Query e renderizar os dados da empresa em cards estruturados. Feature vertical: validação → requisição → cache → UI.

---

## Por que `useMutation` e não `useQuery`

O endpoint é `POST /api/leads/enrich` — uma chamada com efeito colateral (o backend pode persistir o lead). `useQuery` é para leitura idempotente (GET); `useMutation` é a escolha correta para POST.

O cache por CNPJ é implementado manualmente com `useRef<Map>` no `HomePage`: antes de chamar a mutation, verifica se o mesmo CNPJ já foi consultado nos últimos 5 minutos. Se sim, usa o resultado armazenado sem nova requisição HTTP.

```
form.submit → handleSearch(cnpj, formData)
                │
          cache hit? ──► setResult(cached) — sem HTTP
                │
          cache miss?
                │
                ▼
        mutation.mutate({ ...formData })
                │
          isError ──► mensagem de erro
                │
          isSuccess ──► armazena no cache + setResult(data)
```

---

## Contrato com o Backend

### Endpoint

```
POST /api/leads/enrich
```

**Body** (campos obrigatórios, CNPJ aceita com ou sem máscara):

```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "(11) 98765-4321",
  "cnpj": "45.973.431/0001-72"
}
```

> O backend sanitiza o CNPJ internamente (`sanitizeCNPJ`), então enviar com máscara é seguro.

### Resposta de sucesso — `200 OK`

```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "(11) 98765-4321",
  "empresa": {
    "cnpj": "45.973.431/0001-72",
    "razaoSocial": "EMPRESA EXEMPLO LTDA",
    "nomeFantasia": "EXEMPLO",
    "situacaoCadastral": "Ativa",
    "dataAbertura": "15/03/2010",
    "cnae": {
      "codigo": 6201501,
      "descricao": "Desenvolvimento de programas de computador sob encomenda"
    },
    "segmento": "Tecnologia da Informação",
    "faixaFuncionarios": "Microempresa (até 9 funcionários)",
    "endereco": {
      "logradouro": "RUA DAS FLORES",
      "municipio": "SÃO PAULO",
      "uf": "SP",
      "cep": "01310100"
    },
    "telefone": "(11) 3000-0000",
    "email": "contato@exemplo.com.br"
  }
}
```

### Respostas de erro

O `errorHandler` do backend retorna formatos distintos por tipo de erro:

| Status | `code` | Formato do body |
|---|---|---|
| `400` (Zod) | `VALIDATION_ERROR` | `{ code, errors: [{ field, message }] }` |
| `400` | `INVALID_CNPJ` | `{ code, error: string }` |
| `404` | `CNPJ_NOT_FOUND` | `{ code, error: string }` |
| `429` | `EXTERNAL_RATE_LIMIT` | `{ code, error: string }` |
| `502` | `EXTERNAL_API_ERROR` | `{ code, error: string }` |
| `500` | `INTERNAL_ERROR` | `{ code, error: string }` |

O interceptor do Axios normaliza todos para `{ code, message }` antes de chegarem ao hook.

---

## Tipos TypeScript

```ts
// src/types/company.ts — espelha back-end/src/types/enriched.types.ts

export interface EnrichedCompany {
  cnpj: string;                  // já formatado: XX.XXX.XXX/XXXX-XX
  razaoSocial: string;
  nomeFantasia: string | null;
  situacaoCadastral: string;     // ex.: "Ativa", "Baixada", "Suspensa"
  dataAbertura: string | null;   // já formatado: "dd/MM/yyyy"
  cnae: {
    codigo: number;
    descricao: string;
  };
  segmento: string;
  faixaFuncionarios: string;
  endereco: {
    logradouro: string | null;
    municipio: string | null;
    uf: string | null;
    cep: string | null;
  };
  telefone: string | null;
  email: string | null;
}

export interface LeadEnrichedResponse {
  nome: string;
  email: string;
  telefone: string;
  empresa: EnrichedCompany;
}
```

> Campos importantes que **não existem** no response: `status`, `porte`, `naturezaJuridica`, `cnaesSecundarios`, array de telefones — todos esses eram invenção. O tipo acima é exato.

---

## Arquivos a criar / modificar

```
src/
├── api/
│   ├── client.ts             ← CRIAR — instância Axios + interceptor de erro
│   └── leads.ts              ← CRIAR — postEnrichLead(body)
│
├── hooks/
│   └── useEnrichLead.ts      ← CRIAR — useMutation encapsulado
│
├── types/
│   └── company.ts            ← CRIAR — LeadEnrichedResponse + EnrichedCompany
│
├── components/
│   └── CompanyResult/
│       ├── index.tsx         ← CRIAR — orquestra os cards
│       ├── CompanyCard.tsx   ← CRIAR — razão social, situação, CNAE, segmento
│       ├── LocationCard.tsx  ← CRIAR — endereço (4 campos)
│       ├── ContactCard.tsx   ← CRIAR — telefone e email da empresa
│       └── LeadCard.tsx      ← CRIAR — dados preenchidos pelo usuário
│
└── pages/
    └── HomePage.tsx          ← MODIFICAR — integrar mutation + cache manual + resultado
```

---

## Passo 1 — Cliente HTTP (`src/api/client.ts`)

```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 0;
    // Backend usa "error" para AppError e "errors" (array) para ZodError
    const message =
      error.response?.data?.error ??
      error.response?.data?.errors?.[0]?.message ??
      "Erro inesperado. Tente novamente.";
    return Promise.reject({ status, message });
  }
);
```

---

## Passo 2 — Função de Acesso (`src/api/leads.ts`)

```ts
import { apiClient } from "./client";
import type { LeadEnrichedResponse } from "@/types/company";
import type { LeadFormData } from "@/schemas/leadSchema";

export async function postEnrichLead(
  body: LeadFormData
): Promise<LeadEnrichedResponse> {
  const { data } = await apiClient.post<LeadEnrichedResponse>(
    "/api/leads/enrich",
    body
  );
  return data;
}
```

---

## Passo 3 — Hook React Query (`src/hooks/useEnrichLead.ts`)

```ts
import { useMutation } from "@tanstack/react-query";
import { postEnrichLead } from "@/api/leads";

export function useEnrichLead() {
  return useMutation({
    mutationFn: postEnrichLead,
    retry: 1,
  });
}
```

A lógica de cache por CNPJ fica no `HomePage` (próximo passo), não no hook — o hook só encapsula a chamada HTTP e os estados de `isPending` / `isError` / `isSuccess`.

---

## Passo 4 — `QueryClientProvider` (`src/main.tsx`)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
```

---

## Passo 5 — Integração no `HomePage` (`src/pages/HomePage.tsx`)

Cache manual por CNPJ com `useRef<Map>`. Antes de cada submit, verifica se o CNPJ já foi consultado nos últimos 5 minutos.

```tsx
import { useRef, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { CompanyResult } from "@/components/CompanyResult";
import { useEnrichLead } from "@/hooks/useEnrichLead";
import type { LeadFormData } from "@/schemas/leadSchema";
import type { LeadEnrichedResponse } from "@/types/company";

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: LeadEnrichedResponse;
  timestamp: number;
}

export function HomePage() {
  const [result, setResult] = useState<LeadEnrichedResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const cache = useRef<Map<string, CacheEntry>>(new Map());

  const { mutate, isPending } = useEnrichLead();

  function handleSearch(cnpj: string, formData: LeadFormData) {
    setApiError(null);

    const cached = cache.current.get(cnpj);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setResult(cached.data);
      return;
    }

    mutate(formData, {
      onSuccess: (data) => {
        cache.current.set(cnpj, { data, timestamp: Date.now() });
        setResult(data);
      },
      onError: (error) => {
        setApiError((error as { message: string }).message);
      },
    });
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Busca de Enriquecimento de CNPJ
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          Insira os detalhes da empresa para recuperar instantaneamente
          inteligência corporativa completa.
        </p>
      </div>

      <LeadForm onSubmit={handleSearch} isLoading={isPending} />

      {apiError && (
        <p className="text-sm text-destructive">{apiError}</p>
      )}

      {result && <CompanyResult data={result} />}
    </div>
  );
}
```

---

## Passo 6 — Componente de Resultado (`src/components/CompanyResult/index.tsx`)

```tsx
import type { LeadEnrichedResponse } from "@/types/company";
import { CompanyCard } from "./CompanyCard";
import { LocationCard } from "./LocationCard";
import { ContactCard } from "./ContactCard";
import { LeadCard } from "./LeadCard";

interface CompanyResultProps {
  data: LeadEnrichedResponse;
}

export function CompanyResult({ data }: CompanyResultProps) {
  const { empresa, nome, email, telefone } = data;

  return (
    <div className="w-full max-w-2xl grid gap-4">
      <CompanyCard empresa={empresa} />
      <LocationCard endereco={empresa.endereco} />
      <ContactCard telefone={empresa.telefone} email={empresa.email} />
      <LeadCard nome={nome} email={email} telefone={telefone} />
    </div>
  );
}
```

---

## Passo 7 — Cards individuais

### `CompanyCard.tsx`

Campos: `razaoSocial`, `nomeFantasia`, `cnpj` (já formatado), `situacaoCadastral` (badge), `dataAbertura`, `faixaFuncionarios`, `segmento`, `cnae.descricao`.

Badge de `situacaoCadastral`:
| Valor | Variante |
|---|---|
| `"Ativa"` | `default` (verde) |
| `"Baixada"` / `"Inativa"` | `destructive` (vermelho) |
| `"Suspensa"` / `"Inapta"` | `secondary` (amarelo) |

### `LocationCard.tsx`

Apenas os 4 campos que o backend retorna: `logradouro`, `municipio`, `uf`, `cep`. Não exibe número, complemento ou bairro — esses campos não existem no `EnrichedCompany`.

### `ContactCard.tsx`

`telefone` é `string | null` (não é array). `email` é `string | null`. Oculta o card se ambos forem `null`.

### `LeadCard.tsx`

Exibe os dados que o usuário preencheu no formulário (`nome`, `email`, `telefone` do `LeadEnrichedResponse`), para contraste com os dados da Receita Federal.

---

## Estados da UI mapeados

| Estado | Comportamento |
|---|---|
| Sem submit ainda | Nada renderizado abaixo do formulário |
| `isPending` | Botão desabilitado + texto "Buscando..." |
| Erro da mutation | Mensagem de texto abaixo do formulário |
| Cache hit | `result` atualizado sem spinner (instantâneo) |
| Sucesso | `<CompanyResult>` renderizado |

---

## Dependência a instalar

```bash
npm install @tanstack/react-query axios
```

### Componentes Shadcn/ui a adicionar

```bash
npx shadcn@latest add badge separator
```

---

## Variável de Ambiente

```env
# .env.local
VITE_API_URL=http://localhost:3000
```

Porta padrão do backend: `3000` (ver `back-end/.env.example` e `back-end/src/server.ts`).

---

## Fluxo completo

```
Usuário preenche formulário
        │
        ▼
Zod valida (client-side)
        │
   inválido ──► Erro inline, sem HTTP
        │
      válido
        │
        ▼
handleSearch(cnpj, formData)
        │
   cache hit (<5min)? ──► setResult(cached) — sem HTTP
        │
   cache miss?
        │
        ▼
mutation.mutate(formData)
POST /api/leads/enrich
        │
   isPending ──► botão "Buscando...", desabilitado
        │
   isError ──► mensagem de erro inline
        │
   isSuccess
        │
        ├── armazena em cache (Map, timestamp)
        │
        ▼
   setResult(data) ──► CompanyResult renderiza 4 cards
```

---

## Critérios de Aceitação

- [ ] `@tanstack/react-query` e `axios` instalados
- [ ] `QueryClientProvider` envolve a árvore no `main.tsx`
- [ ] Submit válido chama `POST /api/leads/enrich` com todos os campos do formulário
- [ ] Botão exibe "Buscando..." e fica desabilitado durante `isPending`
- [ ] Segundo submit com o **mesmo** CNPJ dentro de 5 min não dispara nova requisição HTTP
- [ ] Segundo submit com **outro** CNPJ dispara nova requisição normalmente
- [ ] Erro `404` exibe mensagem "CNPJ não encontrado" abaixo do formulário
- [ ] Erro de rede exibe mensagem "Erro inesperado. Tente novamente."
- [ ] Cards renderizam corretamente com dados reais do backend local
- [ ] `ContactCard` é omitido se `telefone` e `email` forem ambos `null`

---

## O que esta feature NÃO faz

- Não consome `GET /cnpj/:cnpj` diretamente (esse endpoint existe, mas o formulário usa `/api/leads/enrich`)
- Não persiste histórico no `localStorage`
- Não implementa listagem de leads (`GET /api/leads` — escopo de FE-06)
- Não valida se a empresa está ativa (exibe `situacaoCadastral` como recebido)
