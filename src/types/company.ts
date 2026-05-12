// Espelha o tipo EnrichedCompany retornado pelo backend após consulta à BrasilAPI
export interface EnrichedCompany {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  situacaoCadastral: string;
  dataAbertura: string | null;
  cnae: {
    codigo: number;
    descricao: string;
  };
  segmento: string;
  faixaFuncionarios: string;
  endereco: {
    logradouro: string | null;
    bairro: string | null;
    municipio: string | null;
    uf: string | null;
    cep: string | null;
    // Fuso horário IANA derivado do CEP via BrasilAPI (ex: "America/Sao_Paulo")
    fuso: string | null;
  };
  telefone: string | null;
  email: string | null;
}

// Resposta completa do endpoint POST /api/leads/enrich: dados do lead + empresa enriquecida
export interface LeadEnrichedResponse {
  nome: string;
  email: string;
  telefone: string;
  empresa: EnrichedCompany;
}
