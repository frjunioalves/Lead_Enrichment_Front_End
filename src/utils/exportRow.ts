import type { LeadEnrichedResponse } from '@/types/company';

// Estrutura plana usada por exportCsv e exportPdf — sem aninhamento para facilitar a serialização
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
  telefoneEmpresa: string;
  emailEmpresa: string;
}

export const EXPORT_HEADERS: Record<keyof ExportRow, string> = {
  nome: 'Nome',
  emailLead: 'E-mail do Lead',
  telefoneLead: 'Telefone do Lead',
  cnpj: 'CNPJ',
  razaoSocial: 'Razão Social',
  nomeFantasia: 'Nome Fantasia',
  situacaoCadastral: 'Situação Cadastral',
  dataAbertura: 'Data de Abertura',
  cnaeCodigo: 'CNAE Código',
  cnaeDescricao: 'CNAE Descrição',
  segmento: 'Segmento',
  faixaFuncionarios: 'Faixa de Funcionários',
  logradouro: 'Logradouro',
  bairro: 'Bairro',
  municipio: 'Município',
  uf: 'UF',
  cep: 'CEP',
  telefoneEmpresa: 'Telefone da Empresa',
  emailEmpresa: 'E-mail da Empresa',
};

// Converte qualquer valor para string; null/undefined vira string vazia para evitar "null" no CSV/PDF
const str = (v: string | number | null | undefined): string =>
  v != null ? String(v) : '';

// Achata a estrutura aninhada de LeadEnrichedResponse em uma linha tabular exportável
export function mapToExportRow(lead: LeadEnrichedResponse): ExportRow {
  const { empresa } = lead;
  return {
    nome: str(lead.nome),
    emailLead: str(lead.email),
    telefoneLead: str(lead.telefone),
    cnpj: str(empresa.cnpj),
    razaoSocial: str(empresa.razaoSocial),
    nomeFantasia: str(empresa.nomeFantasia),
    situacaoCadastral: str(empresa.situacaoCadastral),
    dataAbertura: str(empresa.dataAbertura),
    cnaeCodigo: str(empresa.cnae.codigo),
    cnaeDescricao: str(empresa.cnae.descricao),
    segmento: str(empresa.segmento),
    faixaFuncionarios: str(empresa.faixaFuncionarios),
    logradouro: str(empresa.endereco.logradouro),
    bairro: str(empresa.endereco.bairro),
    municipio: str(empresa.endereco.municipio),
    uf: str(empresa.endereco.uf),
    cep: str(empresa.endereco.cep),
    telefoneEmpresa: str(empresa.telefone),
    emailEmpresa: str(empresa.email),
  };
}
