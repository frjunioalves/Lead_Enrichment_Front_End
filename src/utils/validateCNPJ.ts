// Aceita apenas o formato com pontuação: XX.XXX.XXX/XXXX-XX
export const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export function validateCNPJ(cnpj: string): boolean {
  const nums = cnpj.replace(/\D/g, "");

  if (nums.length !== 14) return false;
  // CNPJs com todos os dígitos iguais passam na soma mas são inválidos pela Receita Federal
  if (/^(\d)\1+$/.test(nums)) return false;

  // Algoritmo módulo 11 da Receita Federal: pesos de 2 a 9 aplicados ciclicamente da direita para a esquerda
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
