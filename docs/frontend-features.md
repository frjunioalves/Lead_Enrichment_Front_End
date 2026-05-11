# 🖥️ Frontend Features — Enriquecedor de Leads

## Visão Geral

O frontend é a camada de apresentação da aplicação. Sua única missão é ser a "cara" do produto: capturar dados do usuário, chamar o backend e renderizar o resultado de forma visualmente clara. Nenhuma regra de negócio reside aqui.

---

## Stack

| Tecnologia | Papel |
|---|---|
| React 18 + TypeScript | Base da aplicação |
| React Query (TanStack Query v5) | Gerenciamento de estado assíncrono |
| Zod | Schema de validação de formulário |
| React Hook Form | Controle de formulário |
| Shadcn/ui + Radix UI | Componentes acessíveis e customizáveis |
| Tailwind CSS | Estilização utilitária |

---

## Funcionalidades

### 1. Formulário de Captura de Dados

Campos obrigatórios:

- **Nome** — texto livre, mínimo 2 caracteres
- **Email** — validação de formato via Zod (`z.string().email()`)
- **Telefone** — máscara `(99) 9 9999-9999`, aceita celular e fixo
- **CNPJ** — máscara `99.999.999/9999-99`, validação de dígitos verificadores

O botão de busca só é habilitado quando todos os campos passam pela validação do Zod.

### 2. Validação de Entrada (Client-Side)

Responsabilidades do frontend antes de qualquer chamada HTTP:

- Impedir envio com campos vazios
- Rejeitar CNPJ com letras ou quantidade de dígitos incorreta
- Validar formato de email
- Exibir mensagens de erro inline abaixo de cada campo com feedback imediato

O que **não** é validado aqui:
- Se o CNPJ existe na Receita Federal (isso é responsabilidade do backend)
- Se o CNPJ pertence a uma empresa ativa

### 3. Gerenciamento de Estado Assíncrono (React Query)

A chamada ao backend é feita com `useQuery` (ou `useMutation`, dependendo se o trigger é manual via botão).

Estados gerenciados automaticamente pelo React Query:

| Estado | Comportamento na UI |
|---|---|
| `isPending` | Spinner centralizado + botão desabilitado |
| `isError` | Toast de erro com a mensagem retornada pelo backend |
| `isSuccess` | Renderiza o painel de resultado com os dados da empresa |
| `isFetching` (refetch) | Indicador sutil de atualização sem bloquear a UI |

Cache: os dados de um CNPJ já consultado ficam em cache por `5 minutos` (`staleTime`). Uma segunda busca pelo mesmo CNPJ não dispara nova requisição.

### 4. Apresentação dos Dados (UI)

Os dados retornados pelo backend (JSON já limpo e estruturado) são exibidos em seções:

#### Card: Dados da Empresa
- Razão Social e Nome Fantasia
- CNPJ formatado
- Badge de status: `Ativa` (verde) / `Inativa` (vermelho) / `Suspensa` (amarelo)
- Data de abertura formatada (`dd/MM/yyyy`)
- Porte da empresa (badge neutro)
- Natureza Jurídica

#### Card: Localização
- Logradouro, Número, Complemento
- Bairro, Município, UF, CEP

#### Card: Atividade Econômica
- CNAE principal com código e descrição
- Lista de CNAEs secundários (colapsável se mais de 3)

#### Card: Contato
- Telefone(s)
- Email (se disponível)

#### Card: Dados do Lead (preenchidos pelo usuário)
- Nome, Email, Telefone — exibidos ao lado dos dados da empresa para contexto

### 5. Componentes Shadcn/ui Utilizados

> Shadcn/ui copia os componentes para dentro do repositório, dando controle total sobre o código e garantindo acessibilidade via Radix UI.

| Componente | Uso |
|---|---|
| `<Form>` + `<FormField>` | Integração React Hook Form + Zod |
| `<Input>` | Campos do formulário |
| `<Button>` | Ação de busca, estados `disabled` e `loading` |
| `<Card>` / `<CardContent>` | Seções do resultado |
| `<Badge>` | Status da empresa, porte, CNAE |
| `<Separator>` | Divisão visual entre seções |
| `<Skeleton>` | Placeholder enquanto `isPending` |
| `<Sonner>` (toast) | Feedback de erro e sucesso |
| `<Tooltip>` | Explicação de campos técnicos (ex.: CNAE) |

### 6. Tratamento de Erros

| Cenário | Resposta na UI |
|---|---|
| CNPJ inválido (formato) | Erro inline no campo, sem chamada HTTP |
| CNPJ não encontrado (404 do backend) | Toast: "CNPJ não encontrado na base da Receita Federal" |
| Erro de rede / timeout | Toast: "Erro ao consultar. Tente novamente." + botão de retry |
| Erro 500 do backend | Toast com mensagem genérica, log no console |

---

## O que o Frontend NÃO faz

- Não consome a BrasilAPI diretamente
- Não filtra ou transforma o JSON retornado pela BrasilAPI
- Não decide se a empresa é matriz ou filial
- Não contém lógica de cálculo de dígitos verificadores do CNPJ (apenas máscara e contagem de dígitos)
- Não armazena dados em banco ou localStorage

---

## Fluxo de Usuário

```
Usuário preenche formulário
        │
        ▼
Zod valida campos (client-side)
        │
   inválido ──► Erro inline no campo
        │
      válido
        │
        ▼
React Query dispara GET /api/company/:cnpj
        │
     isPending ──► Skeleton + botão desabilitado
        │
     isError ──► Toast de erro
        │
     isSuccess
        │
        ▼
Renderiza Cards com dados da empresa
```

---

## Camada HTTP

A camada HTTP é separada em dois níveis: o **cliente base** (configuração do Axios) e as **funções de acesso** (uma por recurso). Os hooks do React Query consomem essas funções — nunca fazem `fetch` diretamente.

### `api/client.ts` — Instância do Axios

```ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex: http://localhost:3333
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de resposta: normaliza erros para um formato previsível
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? "Erro inesperado. Tente novamente.";
    return Promise.reject({ status, message });
  }
);
```

> **Por que interceptor?** Centraliza o tratamento de erros HTTP. Os hooks recebem sempre um objeto `{ status, message }` tipado, sem precisar inspecionar `error.response` em cada `catch`.

### `api/company.ts` — Funções de Acesso

```ts
import { apiClient } from "./client";
import type { CompanyResponse } from "@/types/company";

export async function fetchCompany(cnpj: string): Promise<CompanyResponse> {
  const { data } = await apiClient.get<CompanyResponse>(`/company/${cnpj}`);
  return data;
}
```

Uma função por endpoint. Retorna o tipo já inferido pelo TypeScript — o hook não precisa fazer cast.

### `hooks/useCompanyQuery.ts` — React Query sobre a função de acesso

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchCompany } from "@/api/company";

export function useCompanyQuery(cnpj: string | null) {
  return useQuery({
    queryKey: ["company", cnpj],
    queryFn: () => fetchCompany(cnpj!),
    enabled: !!cnpj,           // só dispara quando o CNPJ for definido
    staleTime: 5 * 60 * 1000,  // 5 min de cache
    retry: 1,                  // 1 retentativa antes de marcar isError
  });
}
```

O componente usa apenas o hook — desconhece Axios, URLs e status codes.

---

## Estrutura de Pastas (Frontend)

```
src/
├── api/
│   ├── client.ts             # Instância do Axios + interceptors
│   └── company.ts            # fetchCompany() — acesso ao endpoint /company/:cnpj
│
├── components/
│   ├── ui/                   # Componentes Shadcn/ui (copiados)
│   ├── LeadForm.tsx          # Formulário principal
│   └── CompanyResult/
│       ├── index.tsx         # Orquestra os cards abaixo
│       ├── CompanyCard.tsx
│       ├── LocationCard.tsx
│       ├── ActivityCard.tsx
│       └── ContactCard.tsx
│
├── hooks/
│   └── useCompanyQuery.ts    # useQuery encapsulado, consome api/company.ts
│
├── schemas/
│   └── leadSchema.ts         # Schemas Zod (leadSchema, cnpjSchema)
│
├── utils/
│   └── index.ts              # cn(), formatCNPJ(), formatPhone()
│
└── types/
    └── company.ts            # Tipos TypeScript do response do backend
```

### Fluxo de dependência entre camadas

```
Componente (LeadForm / CompanyResult)
        │  usa
        ▼
     Hook (useCompanyQuery)
        │  chama
        ▼
  Função de acesso (api/company.ts → fetchCompany)
        │  usa
        ▼
  Cliente base (api/client.ts → apiClient)
        │  HTTP
        ▼
     Backend (GET /company/:cnpj)
```

Cada camada conhece apenas a imediatamente abaixo. O componente nunca vê Axios; o hook nunca vê a URL.
