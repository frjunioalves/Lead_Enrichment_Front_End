export function buildWhatsAppUrl(telefone: string): string {
  const digits = telefone.replace(/\D/g, '');
  const number = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${number}`;
}
