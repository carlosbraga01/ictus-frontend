'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      await authApi.forgotPassword({ email: data.email });
      
      setIsSubmitted(true);
      
      toast({
        title: 'E-mail enviado',
        description: 'Verifique seu e-mail para instruções de recuperação de senha.',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao processar solicitação',
        description: error.response?.data?.message || 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verifique seu e-mail</h1>
          <p className="text-gray-500">
            Enviamos instruções de recuperação de senha para o seu e-mail.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-500">
            Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.
          </p>
          
          <Button 
            onClick={() => setIsSubmitted(false)} 
            variant="outline" 
            className="w-full"
          >
            Tentar novamente
          </Button>
          
          <div className="text-center">
            <Link href="/login" className="text-purple-600 hover:text-purple-800 text-sm">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Esqueceu sua senha?</h1>
        <p className="text-gray-500">
          Digite seu e-mail para receber instruções de recuperação
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="seu@email.com" 
                    type="email" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar instruções'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Lembrou sua senha?{' '}
          <Link href="/login" className="text-purple-600 hover:text-purple-800">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
