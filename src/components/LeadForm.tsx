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
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base " +
  "transition-colors outline-none placeholder:text-muted-foreground " +
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm " +
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

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
                        onAccept={(value: string) => field.onChange(value)}
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
                        onAccept={(value: string) => field.onChange(value)}
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

            {/* Botão alinhado à direita */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isLoading}
                className="gap-2"
              >
                <Search className="size-4" />
                {isLoading ? "Buscando..." : "Buscar Dados"}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
