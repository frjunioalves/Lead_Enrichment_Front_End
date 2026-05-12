# Enriquecedor de Leads — Frontend

SPA React que permite enriquecer dados de leads via CNPJ. O usuário faz login, preenche o formulário com nome, e-mail, telefone e CNPJ, e recebe dados estruturados da empresa (segmento, faixa de funcionários, endereço, fuso horário). O histórico de buscas fica disponível na barra lateral.

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19 | Base da aplicação |
| TypeScript | ~6.0 | Tipagem estática |
| Vite | 8 | Build e dev server |
| TailwindCSS | 4 | Estilização utilitária |
| shadcn/ui | 4 | Componentes acessíveis (Button, Card, Input, Badge, Form) |
| React Hook Form | 7 | Gerenciamento de formulário |
| Zod | 4 | Validação de schema |
| React Query | 5 | Cache e estado de requisições |
| Axios | 1 | Cliente HTTP |
| Zustand | 5 | Estado global de autenticação |
| react-router-dom | 7 | Roteamento SPA |
| react-imask | 7 | Máscara de CNPJ e telefone |

## Pré-requisitos

- Node.js 20+
- npm 10+
- Backend rodando em `http://localhost:3000`

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie `.env.local` na raiz:

```env
VITE_API_URL=http://localhost:3000
```

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (HMR) |
| `npm run build` | Compila TypeScript e gera o bundle de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint |

## Estrutura do projeto

```
src/
├── api/
│   ├── client.ts        # Axios instance + interceptor JWT
│   ├── auth.ts          # register, login
│   ├── leads.ts         # postEnrichLead
│   └── history.ts       # getLeadHistory
├── components/
│   ├── CompanyResult/
│   │   ├── CompanyCard.tsx   # Dados cadastrais
│   │   ├── ContactCard.tsx   # Telefone e e-mail
│   │   ├── LocationCard.tsx  # Endereço + fuso
│   │   ├── LeadCard.tsx      # Dados do lead
│   │   └── index.tsx
│   ├── ui/              # shadcn/ui primitivos
│   ├── Layout.tsx       # Shell com sidebar
│   ├── LeadForm.tsx     # Formulário principal
│   └── Sidebar.tsx      # Histórico + logout
├── hooks/
│   ├── useEnrichLead.ts # React Query — POST enrich
│   └── useLeadHistory.ts # React Query — GET history
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   └── HistoryPage.tsx
├── schemas/
│   ├── leadSchema.ts    # Zod — validação do formulário
│   └── authSchema.ts    # Zod — login e registro
├── store/
│   └── authStore.ts     # Zustand — token + user (persiste em localStorage)
├── types/
│   └── company.ts       # EnrichedCompany e tipos do domínio
└── utils/
    ├── mapHistory.ts    # Transforma LeadHistory para EnrichedCompany
    └── validateCNPJ.ts  # Validação do dígito verificador
```

## Rotas

| Rota | Página | Protegida |
|---|---|---|
| `/login` | LoginPage | Não |
| `/register` | RegisterPage | Não |
| `/` | HomePage | Sim (Layout) |
| `/history/:id` | HistoryPage | Sim (Layout) |

## Fluxo de autenticação

O token JWT é armazenado via Zustand + `persist` (localStorage). O Axios client injeta o header `Authorization: Bearer <token>` automaticamente em todas as requisições. Ao fazer logout, o store é limpo e o usuário é redirecionado para `/login`.
