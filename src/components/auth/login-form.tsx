'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
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

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email: data.email, password: '******' });
      
      // Use the authApi login method which handles the correct format
      const response = await authApi.login({
        email: data.email,
        password: data.password
      });
      
      console.log('Login response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Falha na autenticação');
      }
      
      // Extract token from the response
      const token = response.data.access_token;
      
      if (!token) {
        console.error('No token found in response');
        throw new Error('Token de autenticação não encontrado na resposta');
      }
      
      // Token is already stored in localStorage by the authApi.login method
      
      // Fetch user info using the token
      const userResponse = await authApi.getCurrentUser();
      
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        
        // Store user information in localStorage
        localStorage.setItem('ictus_user', JSON.stringify({
          id: userData.id,
          name: userData.nome,
          email: userData.email,
          role: userData.roles
        }));
        
        toast({
          title: 'Login realizado com sucesso',
          description: 'Você foi autenticado com sucesso.',
          variant: 'success',
        });
        
        // Redirect based on user role
        console.log('User roles:', userData.roles);
        
        // Force redirect to dashboard for all authenticated users for now
        console.log('Redirecting to dashboard');
        
        // Use window.location for a hard redirect instead of the Next.js router
        // This ensures a complete page reload which can help with state initialization
        window.location.href = '/dashboard';
        
        // Uncomment this when role-based redirection is needed
        /*
        if (userData.roles && (
            userData.roles.toUpperCase().includes('ORGANIZER') || 
            userData.roles.toUpperCase().includes('ADMIN')
        )) {
          console.log('Redirecting to dashboard (organizer/admin)');
          window.location.href = '/dashboard';
        } else {
          console.log('Redirecting to home (regular user)');
          window.location.href = '/';
        }
        */
      } else {
        // If we can't get user info, still consider login successful
        toast({
          title: 'Login realizado com sucesso',
          description: 'Você foi autenticado com sucesso.',
          variant: 'success',
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
        <p className="text-gray-500">
          Entre com seu e-mail e senha para acessar sua conta
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
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    placeholder="******" 
                    type="password" 
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
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-purple-600 hover:text-purple-800">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
