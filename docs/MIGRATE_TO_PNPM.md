# Migração para pnpm — Front-end

## Por que pnpm?

- Instalações mais rápidas (cache global via hard links)
- `node_modules` menor em disco
- Lockfile mais determinístico (`pnpm-lock.yaml`)
- Suporte nativo a workspaces e monorepos

---

## Pré-requisitos

Instale o pnpm via corepack (recomendado):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Verifique a instalação:

```bash
pnpm --version
```

---

## Passos da migração

### 1. Remova os artefatos anteriores

```bash
rm -rf node_modules package-lock.json
```

### 2. Instale as dependências com pnpm

```bash
pnpm install
```

Isso gera o arquivo `pnpm-lock.yaml` automaticamente.

### 3. Atualize o `.gitignore`

Certifique-se de que o `pnpm-lock.yaml` **não** está ignorado e que o `package-lock.json` está:

```gitignore
# Remova esta linha se existir:
# pnpm-lock.yaml

# Adicione esta linha:
package-lock.json
```

### 4. (Opcional) Adicione um arquivo `.npmrc`

Crie `.npmrc` na raiz do front-end para garantir comportamento consistente:

```ini
shamefully-hoist=true
strict-peer-dependencies=false
```

> `shamefully-hoist=true` é útil para projetos Vite/React que esperam dependências no `node_modules` raiz.

### 5. Comandos pnpm

| Ação                        | Comando pnpm                |
|-----------------------------|-----------------------------|
| Instalar dependências       | `pnpm install`              |
| Adicionar pacote            | `pnpm add <pkg>`            |
| Adicionar pacote dev        | `pnpm add -D <pkg>`         |
| Remover pacote              | `pnpm remove <pkg>`         |
| Rodar dev                   | `pnpm dev`                  |
| Build                       | `pnpm build`                |
| Lint                        | `pnpm lint`                 |
| Preview                     | `pnpm preview`              |

### 6. Commite o lockfile novo

```bash
git add pnpm-lock.yaml
git rm --cached package-lock.json   # se ainda estiver rastreado
git commit -m "chore: migrate to pnpm (front-end)"
```

---

## Verificação final

```bash
pnpm dev     # servidor de desenvolvimento deve subir normalmente
pnpm build   # build de produção deve completar sem erros
pnpm lint    # linter deve rodar sem erros
```

---

## Problemas comuns

| Sintoma | Solução |
|---|---|
| Módulo não encontrado em runtime | Adicione `shamefully-hoist=true` no `.npmrc` |
| Peer dependency warnings | Adicione `strict-peer-dependencies=false` no `.npmrc` |
| Erro de permissão no corepack | Execute `sudo corepack enable` |
| Vite não reconhece variáveis de ambiente | Verifique se o `.env` está na raiz do front-end |
