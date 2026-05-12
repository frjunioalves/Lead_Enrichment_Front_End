import { apiClient } from './client';

// Espelha o select do LeadHistoryService.listByUser — estrutura plana para facilitar serialização no banco
export interface LeadHistoryItem {
  id: string;
  leadNome: string;
  leadEmail: string;
  leadTelefone: string;
  empresaCnpj: string;
  empresaRazaoSocial: string;
  empresaNomeFantasia: string | null;
  empresaSituacaoCadastral: string;
  empresaDataAbertura: string | null;
  empresaCnaeCodigo: number;
  empresaCnaeDescricao: string;
  empresaSegmento: string;
  empresaFaixaFuncionarios: string;
  empresaLogradouro: string | null;
  empresaBairro: string | null;
  empresaMunicipio: string | null;
  empresaUf: string | null;
  empresaCep: string | null;
  empresaFuso: string | null;
  empresaTelefone: string | null;
  empresaEmail: string | null;
  criadoEm: string;
}

// Retorna o histórico do usuário autenticado, ordenado do mais recente ao mais antigo
export async function getLeadHistory(): Promise<LeadHistoryItem[]> {
  const res = await apiClient.get<LeadHistoryItem[]>('/api/leads/history');
  return res.data;
}
