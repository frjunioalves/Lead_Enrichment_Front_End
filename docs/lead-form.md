# FE-03 — Formulário de Captura de Dados

**Branch:** `feature/FE-03-lead-form`  
**Depende de:** FE-01 (Tailwind + Shadcn/ui instalados), FE-02 (api-client)  
**Requisito:** REQ-02 do BRANCHES.md

---

## Design de referência

O formulário segue o layout de `images/1.png`:

- **Página inteira:** sidebar esquerda com navegação + header com logo e botão "Enriquecer Lead"
- **Área central:**
  - Ícone de rede + título "Busca de Enriquecimento de CNPJ" + subtítulo
  - Card com o formulário em **grade 2×2**:
    ```
    [ Nome          ]  [ CNPJ *        ]
    [ Email         ]  [ Telefone      ]
                    [ 🔍 Buscar Dados ]
    ```
  - CNPJ inválido → borda vermelha + ícone de erro + mensagem inline abaixo do campo
  - Botão "Buscar Dados" alinhado à direita, com ícone de lupa, azul
- **Abaixo do card:** tabela "Buscas Recentes" (fora do escopo desta branch, implementada em FE-05)

---

## Dependências a instalar

```bash
npm install react-hook-form zod @hookform/resolvers react-imask
```

| Pacote | Papel |
|---|---|
| `react-hook-form` | Controle de estado do formulário sem re-renders desnecessários |
| `zod` | Schema de validação com mensagens tipadas |
| `@hookform/resolvers` | Ponte entre React Hook Form e Zod (`zodResolver`) |
| `react-imask` | Máscaras de Telefone e CNPJ |

### Componentes Shadcn/ui a adicionar

```bash
npx shadcn@latest add form input button card
```

---

## Arquivos a criar / modificar

```
src/
├── utils/
│   └── validateCNPJ.ts      ← CRIAR — lógica pura de validação de CNPJ
├── schemas/
│   └── leadSchema.ts        ← CRIAR — schema Zod (importa de validateCNPJ)
├── components/
│   └── LeadForm.tsx         ← CRIAR — formulário com grid 2×2
└── App.tsx                  ← MODIFICAR — substituir conteúdo padrão Vite
```

---

## Passo 1 — Validador de CNPJ (`src/utils/validateCNPJ.ts`)

Arquivo de lógica pura, sem dependência de framework. Pode ser importado pelo schema, por testes unitários ou por qualquer outro ponto da aplicação.

```ts
export const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export function validateCNPJ(cnpj: string): boolean {
  const nums = cnpj.replace(/\D/g, "");

  if (nums.length !== 14) return false;
  if (/^(\d)\1+$/.test(nums)) return false; // sequências inválidas: 00000000000000

  const calcDigit = (length: number): number => {
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(nums[length - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  return (
    calcDigit(12) === parseInt(nums[12]) &&
    calcDigit(13) === parseInt(nums[13])
  );
}
```

---

## Passo 2 — Schema Zod (`src/schemas/leadSchema.ts`)

O schema importa a função de validação — não duplica a lógica.

```ts
import { z } from "zod";
import { validateCNPJ, CNPJ_REGEX } from "@/utils/validateCNPJ";

export const leadSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres"),

  email: z
    .string()
    .email("Formato de e-mail inválido"),

  telefone: z
    .string()
    .min(14, "Telefone inválido"),

  cnpj: z
    .string()
    .regex(CNPJ_REGEX, "Formato de CNPJ inválido")
    .refine(validateCNPJ, "CNPJ inválido (dígitos verificadores)"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
```

**Decisões:**
- `CNPJ_REGEX` valida o formato da máscara antes do `refine` verificar os dígitos — duas etapas de validação em sequência.
- O campo `cnpj` guarda o valor **com máscara**. O CNPJ limpo (só dígitos) é gerado no submit do componente.
- `telefone` valida comprimento mínimo: máscara aplicada = 14 chars (fixo) ou 15 chars (celular).

---

## Passo 3 — Componente do Formulário (`src/components/LeadForm.tsx`)

Layout em grade 2×2 conforme o design de referência. CNPJ marcado como obrigatório com `*`.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMaskInput } from "react-imask";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { leadSchema, type LeadFormData } from "@/schemas/leadSchema";

const maskedInputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
  "aria-invalid:border-destructive";

interface LeadFormProps {
  onSubmit: (cnpj: string, data: LeadFormData) => void;
  isLoading?: boolean;
}

export function LeadForm({ onSubmit, isLoading = false }: LeadFormProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { nome: "", email: "", telefone: "", cnpj: "" },
    mode: "onTouched",
  });

  function handleSubmit(data: LeadFormData) {
    onSubmit(data.cnpj.replace(/\D/g, ""), data);
  }

  return (
    <Card className="w-full max-w-2xl shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            {/* Linha 1: Nome | CNPJ */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da Empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      CNPJ <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <IMaskInput
                        mask="00.000.000/0000-00"
                        unmask={false}
                        onAccept={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        value={field.value}
                        placeholder="00.000.000/0001-00"
                        aria-invalid={fieldState.invalid}
                        className={maskedInputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Linha 2: Email | Telefone */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <IMaskInput
                        mask={[
                          { mask: "(00) 0000-0000" },
                          { mask: "(00) 0 0000-0000" },
                        ]}
                        unmask={false}
                        onAccept={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        value={field.value}
                        placeholder="(00) 00000-0000"
                        aria-invalid={fieldState.invalid}
                        className={maskedInputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botão — alinhado à direita */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isLoading}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                {isLoading ? "Buscando..." : "Buscar Dados"}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

**Decisões:**
- `aria-invalid={fieldState.invalid}` ativa a borda vermelha via classe `aria-invalid:border-destructive` sem CSS extra.
- `IMaskInput` recebe as classes de estilo diretamente — não usa `asChild` porque não encaminha `ref` corretamente para o `Input` do Shadcn/ui.
- `mode: "onTouched"` — erros aparecem campo a campo ao sair do foco, sem bloquear o usuário antes de ele interagir.
- O botão usa `form.formState.isValid` — desabilitado enquanto qualquer campo falhar no schema.
- `isLoading` é controlado pelo pai; nesta branch sempre será `false` (FE-05 passa o estado real).

---

## Passo 4 — Página com layout (`src/App.tsx`)

```tsx
import { LeadForm, type LeadFormData } from "@/components/LeadForm";

function App() {
  function handleSearch(cnpj: string, data: LeadFormData) {
    // FE-05 substituirá este log pelo hook useCompanyQuery
    console.log("CNPJ limpo:", cnpj);
    console.log("Dados do lead:", data);
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Busca de Enriquecimento de CNPJ
        </h1>
        <p className="text-muted-foreground max-w-md">
          Insira os detalhes da empresa para recuperar instantaneamente
          inteligência corporativa completa.
        </p>
      </div>

      <LeadForm onSubmit={handleSearch} />
    </div>
  );
}

export default App;
```

> O sidebar e o header de navegação serão implementados em uma branch de layout separada, fora do escopo do FE-03.

---

## Passo 5 — Alias `@` (se ainda não configurado)

```json
// tsconfig.json — compilerOptions
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

```ts
// vite.config.ts
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

---

## Critérios de aceitação

- [ ] Formulário renderiza em grade 2×2: Nome/CNPJ na primeira linha, Email/Telefone na segunda
- [ ] Campo CNPJ exibe `*` na label
- [ ] Máscara de CNPJ aplica `99.999.999/9999-99` automaticamente
- [ ] CNPJ inválido → borda vermelha + mensagem de erro inline
- [ ] CNPJ com dígitos verificadores errados exibe mensagem de erro (ex.: `00.000.000/0000-00`)
- [ ] Máscara de telefone aceita fixo `(11) 3333-4444` e celular `(11) 9 9999-9999`
- [ ] Botão "Buscar Dados" com ícone de lupa, alinhado à direita
- [ ] Botão desabilitado enquanto algum campo for inválido
- [ ] Submit chama `onSubmit` com CNPJ limpo (apenas dígitos)
- [ ] Nenhuma chamada HTTP nesta branch (apenas `console.log`)

---

## O que esta branch NÃO faz

- Não chama o backend (FE-05)
- Não exibe resultados da empresa (FE-04)
- Não trata erros HTTP (FE-06)
- Não implementa a tabela "Buscas Recentes" (FE-05)
- Não implementa sidebar nem header de navegação
