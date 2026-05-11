import { z } from "zod";
import { validateCNPJ, CNPJ_REGEX } from "@/utils/validateCNPJ";

export const leadSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  cnpj: z
    .string()
    .regex(CNPJ_REGEX, "Formato de CNPJ inválido")
    .refine(validateCNPJ, "CNPJ inválido (dígitos verificadores)"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
