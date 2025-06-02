'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { eventosApi } from '@/lib/api';
import { Evento, EventoUpdate } from '@/types';
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
import { ChevronLeft } from 'lucide-react';

const editEventSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  data_inicio: z.string().min(1, 'A data de início é obrigatória'),
  data_fim: z.string().min(1, 'A data de fim é obrigatória'),
  local: z.string().min(3, 'O local deve ter pelo menos 3 caracteres'),
  is_published: z.boolean().default(false),
});

type EditEventFormValues = z.infer<typeof editEventSchema>;

interface EditEventClientProps {
  eventId: string;
}

export function EditEventClient({ eventId }: EditEventClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<Evento | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      data_inicio: '',
      data_fim: '',
      local: '',
      is_published: false,
    },
  });
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isAuthenticated || user?.role !== 'organizer') return;
      
      try {
        setIsLoading(true);
        const response = await eventosApi.obterEvento(parseInt(eventId));
        const eventData = response.data;
        
        setEvent(eventData);
        
        // Format dates for the form (YYYY-MM-DD)
        const startDate = new Date(eventData.data_inicio);
        const endDate = new Date(eventData.data_fim);
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        form.reset({
          nome: eventData.nome,
          descricao: eventData.descricao,
          data_inicio: formattedStartDate,
          data_fim: formattedEndDate,
          local: eventData.local,
          is_published: eventData.is_published,
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do evento.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [isAuthenticated, user, eventId, form, toast]);
  
  // If not authenticated or not an organizer, redirect to login
  if (!isAuthenticated || !user.roles.includes('ORGANIZER')) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-8">
            Você precisa estar logado como organizador para editar eventos.
          </p>
          <Link href="/login">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const onSubmit = async (data: EditEventFormValues) => {
    setIsLoading(true);
    
    try {
      const eventData: EventoUpdate = {
        nome: data.nome,
        descricao: data.descricao,
        data_inicio: new Date(data.data_inicio).toISOString(),
        data_fim: new Date(data.data_fim).toISOString(),
        local: data.local,
        is_published: data.is_published,
      };
      
      await eventosApi.atualizarEvento(parseInt(eventId), eventData);
      
      toast({
        title: 'Evento atualizado com sucesso',
        description: 'As alterações foram salvas.',
        variant: 'success',
      });
      
      router.push('/dashboard/events');
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast({
        title: 'Erro ao atualizar evento',
        description: error.response?.data?.message || 'Ocorreu um erro ao atualizar o evento. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // No longer needed as we don't have categories in the new API
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/events" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Editar Evento</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Conferência de Adoração" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          {...field}
                          disabled={isLoading}
                        >
                          <option value="">Selecione uma categoria</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                        placeholder="Descreva seu evento em detalhes..."
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Igreja Batista Central" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availableTickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingressos Disponíveis</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (separadas por vírgula)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: adoração, música, jovens" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Destacar evento na página inicial</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard/events">
                  <Button type="button" className="bg-gray-100 text-gray-800 hover:bg-gray-200" disabled={isLoading}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
