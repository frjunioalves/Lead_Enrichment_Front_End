import type { LeadHistoryItem } from '@/api/history';
import type { LeadEnrichedResponse } from '@/types/company';

export function mapHistoryToResponse(item: LeadHistoryItem): LeadEnrichedResponse {
  return {
    nome: item.leadNome,
    email: item.leadEmail,
    telefone: item.leadTelefone,
    empresa: {
      cnpj: item.empresaCnpj,
      razaoSocial: item.empresaRazaoSocial,
      nomeFantasia: item.empresaNomeFantasia,
      situacaoCadastral: item.empresaSituacaoCadastral,
      dataAbertura: item.empresaDataAbertura,
      cnae: { codigo: item.empresaCnaeCodigo, descricao: item.empresaCnaeDescricao },
      segmento: item.empresaSegmento,
      faixaFuncionarios: item.empresaFaixaFuncionarios,
      endereco: {
        logradouro: item.empresaLogradouro,
        bairro: item.empresaBairro,
        municipio: item.empresaMunicipio,
        uf: item.empresaUf,
        cep: item.empresaCep,
        fuso: item.empresaFuso,
      },
      telefone: item.empresaTelefone,
      email: item.empresaEmail,
    },
  };
}
