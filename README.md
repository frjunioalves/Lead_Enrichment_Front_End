# Enriquecedor de Leads — Frontend

Interface web para consulta e enriquecimento de dados de leads via CNPJ. O usuário informa nome, e-mail, telefone e CNPJ; o frontend valida os dados, chama o backend e exibe as informações da empresa de forma estruturada.

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19 | Base da aplicação |
| TypeScript | ~6.0 | Tipagem estática |
| Vite | 8 | Build e dev server |
| ESLint | 10 | Linting |

> As dependências planejadas (React Query, Zod, React Hook Form, Shadcn/ui, Tailwind CSS, Axios) estão documentadas em [`docs/frontend-features.md`](docs/frontend-features.md).

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
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
front-end/
├── src/
│   ├── api/          # Camada HTTP (Axios client + funções por endpoint)
│   ├── components/   # Componentes React (formulário, cards de resultado)
│   ├── hooks/        # Hooks customizados (React Query encapsulado)
│   ├── schemas/      # Schemas de validação Zod
│   ├── types/        # Tipos TypeScript dos responses do backend
│   └── utils/        # Utilitários (formatadores, cn())
├── docs/
│   └── frontend-features.md   # Especificação completa de funcionalidades
└── public/
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3333
```

## Documentação

- [Funcionalidades e arquitetura detalhada](docs/frontend-features.md)
