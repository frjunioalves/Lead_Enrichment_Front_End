import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { loginSchema, type LoginFormData } from '@/schemas/authSchema';
import { postLogin } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [apiError, setApiError] = useState<string | null>(null);

  // onTouched exibe erros só após o usuário interagir com o campo, evitando mensagens prematuras
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
    mode: 'onTouched',
  });

  async function handleSubmit(data: LoginFormData) {
    setApiError(null);
    try {
      const result = await postLogin(data);
      // Persiste token e dados do usuário no store (localStorage via zustand/persist)
      setAuth(result.token, result.user);
      navigate('/');
    } catch (err) {
      setApiError((err as { message: string }).message);
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="voce@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {apiError && (
                  <p className="text-sm text-destructive">{apiError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
