# Enriquecedor de Leads — Frontend

SPA React que permite enriquecer dados de leads via CNPJ. O usuário faz login, preenche o formulário com nome, e-mail, telefone e CNPJ, e recebe dados estruturados da empresa (segmento, faixa de funcionários, endereço, fuso horário). O histórico de buscas fica disponível na barra lateral.

## Demo

A aplicação está disponível em produção, com deploy realizado na **Azure Web Service** e banco de dados PostgreSQL hospedado na **Hetzner**:

**[https://lead-enricher-f9hrb2fee6asdpa6.canadacentral-01.azurewebsites.net/](https://lead-enricher-f9hrb2fee6asdpa6.canadacentral-01.azurewebsites.net/)**

O pipeline de CI/CD está configurado e funcionando via GitHub Actions — qualquer push na branch `main` dispara o build e o deploy automático na Azure Web Service.

## Screenshots

**Login**

![Login](images/1.png)

**Formulário de busca**

![Formulário](images/2.png)

**Resultado do enriquecimento**

![Resultado](images/3.png)

---

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

- Docker e Docker Compose (opção A)
- Node.js 20+ e npm 10+ (opção B)
- Backend rodando em `http://localhost:3000`

## Como rodar

### Opção A — Docker (recomendado)

O `VITE_API_URL` já tem `http://localhost:3000` como valor padrão no `dockercompose.yml`, então basta subir:

```bash
docker compose up --build
```

Para apontar para outra URL (ex: API em produção), passe a variável explicitamente:

```bash
VITE_API_URL=https://sua-api.exemplo.com docker compose up --build
```

| Serviço | Porta no host |
|---|---|
| Frontend (nginx) | `8080` |

Acesse `http://localhost:8080`.

### Opção B — Desenvolvimento local

```bash
npm install
```

Crie `.env.local` na raiz:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Acesse `http://localhost:5173`.

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

---

## Decisões de projeto e justificativas

Escolhi React + Vite pois acho simples sua implementação. Desde o princípio queria que o front-end e o back-end fossem separados, por isso não escolhi um framework fullstack. Fiz esse projeto de ponta a ponta e me diverti muito: desde a concepção da arquitetura até a aplicação de conceitos de DevOps como CI/CD, Docker, Gitflow e deploy na Azure Web Service.

---

## Como a IA te ajudou a construir essa solução

A IA foi utilizada principalmente para tirar dúvidas sobre features e discutir melhores formas de implementação.

No início do projeto ela não foi usada com frequência para geração de código, pois a fase inicial envolveu definir a arquitetura e experimentar bibliotecas novas como Zod e React Query. Essa exploração foi feita de forma autônoma para consolidar o entendimento antes de delegar qualquer implementação.

Após essa etapa, adotei um fluxo estruturado de desenvolvimento com IA:

1. **Descrição completa da feature** — escopo, limitações, padrões a seguir e comportamento esperado eram documentados antes de qualquer código.
2. **Geração de um arquivo `.md`** — a IA produzia um documento descrevendo a implementação proposta, que eu revisava e corrigia conforme necessário.
3. **Implementação** — somente após o `.md` estar aprovado a IA gerava o código, e eu verificava se o resultado estava alinhado com o que havia sido especificado.

Todas as decisões de arquitetura, revisão de código e validação dos resultados foram feitas por mim ao longo de todo o processo.

---

## Tempo gasto na execução do desafio

Entre 10 e 15 horas.

---

## Se você tivesse mais tempo, o que teria feito?

- Teria feito uma documentação melhor, listando os requisitos, e aplicado de forma mais adequada os conceitos de Gitflow.
- **Testes automatizados**: testes de componente com Vitest + Testing Library.
- **Refresh token**: o JWT expira em 7 dias sem renovação automática; implementaria um fluxo de refresh para manter a sessão ativa de forma segura.
