# Feature: Exportar Leads — PDF e CSV

## Objetivo

Permitir que o usuário exporte os dados de leads enriquecidos tanto da tela de resultado individual quanto da listagem do histórico, nos formatos PDF e CSV.

---

## Escopo

### Onde o botão de exportação aparece

| Tela | Exporta | Formato |
|------|---------|---------|
| Resultado de enriquecimento (`HomePage` após busca) | Lead atual | PDF, CSV |
| Detalhe de histórico (`HistoryPage`) | Lead do registro | PDF, CSV |
| Listagem do histórico (futura `HistoryListPage`) | Todos os registros / selecionados | PDF, CSV |

---

## Dados exportados

Campos provenientes de `LeadEnrichedResponse` / `LeadHistoryItem`:

| Campo | Label no export |
|-------|----------------|
| `nome` | Nome |
| `email` | E-mail do Lead |
| `telefone` | Telefone do Lead |
| `empresa.cnpj` | CNPJ |
| `empresa.razaoSocial` | Razão Social |
| `empresa.nomeFantasia` | Nome Fantasia |
| `empresa.situacaoCadastral` | Situação Cadastral |
| `empresa.dataAbertura` | Data de Abertura |
| `empresa.cnae.codigo` | CNAE Código |
| `empresa.cnae.descricao` | CNAE Descrição |
| `empresa.segmento` | Segmento |
| `empresa.faixaFuncionarios` | Faixa de Funcionários |
| `empresa.endereco.logradouro` | Logradouro |
| `empresa.endereco.bairro` | Bairro |
| `empresa.endereco.municipio` | Município |
| `empresa.endereco.uf` | UF |
| `empresa.endereco.cep` | CEP |
| `empresa.telefone` | Telefone da Empresa |
| `empresa.email` | E-mail da Empresa |

---

## Comportamento por formato

### CSV

- Separador: `;` (compatível com Excel Brasil).
- Encoding: UTF-8 com BOM (`﻿`) para evitar problema de acentuação no Excel.
- Primeira linha: cabeçalhos em português (tabela acima).
- Valores nulos → célula vazia.
- Nome do arquivo: `leads_export_YYYY-MM-DD.csv`.
- Download direto via `Blob` + `URL.createObjectURL`.

### PDF

- Layout em uma única página (ou multi-página se forem muitos registros).
- Cabeçalho com logo/nome da aplicação e data de geração.
- Tabela com os mesmos campos do CSV.
- Biblioteca: [`jsPDF`](https://github.com/parallax/jsPDF) + [`jspdf-autotable`](https://github.com/simonbengtsson/jsPDF-AutoTable).
- Nome do arquivo: `leads_export_YYYY-MM-DD.pdf`.

---

## Arquitetura de implementação

### Novos arquivos

```
src/
  utils/
    exportCsv.ts       # buildCsvBlob(rows: ExportRow[]): Blob
    exportPdf.ts       # buildPdfBlob(rows: ExportRow[]): Blob
    exportRow.ts       # mapToExportRow(lead: LeadEnrichedResponse): ExportRow
  components/
    ExportMenu.tsx     # Dropdown com botões "Exportar CSV" / "Exportar PDF"
```

### Tipo compartilhado

```ts
// src/utils/exportRow.ts
export interface ExportRow {
  nome: string;
  emailLead: string;
  telefoneLead: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: string;
  dataAbertura: string;
  cnaeCodigo: string;
  cnaeDescricao: string;
  segmento: string;
  faixaFuncionarios: string;
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefonEmpresa: string;
  emailEmpresa: string;
}
```

### Componente ExportMenu

```tsx
// src/components/ExportMenu.tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm">
      <Download className="size-4 mr-2" />
      Exportar
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => handleExport('csv')}>
      Exportar CSV
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => handleExport('pdf')}>
      Exportar PDF
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Recebe `rows: ExportRow[]` como prop para ser reutilizável em todas as telas.

### Integração nas páginas

- `CompanyResult/index.tsx` — adicionar `<ExportMenu rows={[mapToExportRow(data)]} />` no header do card.
- `HistoryPage.tsx` — idem, usando `mapHistoryToResponse(item)` que já existe.

---

## Dependências a instalar

```bash
npm install jspdf jspdf-autotable
npm install -D @types/jspdf
```

> `papaparse` **não** é necessário — o CSV será gerado manualmente para manter controle total sobre encoding e separador.

---

## Critérios de aceite

- [ ] Botão "Exportar" aparece no resultado de enriquecimento e na tela de histórico.
- [ ] Download CSV abre corretamente no Excel sem distorção de acentos.
- [ ] Download PDF contém todos os campos listados na seção "Dados exportados".
- [ ] Campos nulos aparecem como células vazias (CSV) e traço `—` (PDF).
- [ ] O componente `ExportMenu` não depende de nenhuma página específica — recebe apenas `ExportRow[]`.
- [ ] Nenhum dado é enviado ao servidor; a geração ocorre 100% no cliente.

---

## Fora do escopo desta feature

- Exportação em lote da listagem completa do histórico (tarefa separada).
- Personalização de colunas pelo usuário.
- Envio do arquivo por e-mail.
