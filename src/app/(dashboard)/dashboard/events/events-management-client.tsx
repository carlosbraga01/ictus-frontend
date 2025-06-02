'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { eventosApi } from '@/lib/api';
import { Evento } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  BarChart,
  Users
} from 'lucide-react';

export function EventsManagementClient() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated || user?.role !== 'organizer') return;
      
      try {
        setIsLoading(true);
        
        // Fetch only the organizer's events
        const response = await eventosApi.listarMeusEventos();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus eventos.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [isAuthenticated, user, toast]);
  
  // If not authenticated or not an organizer, redirect to login
  if (!isAuthenticated || !user.roles.includes('ORGANIZER')) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-8">
            Você precisa estar logado como organizador para gerenciar eventos.
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
  
  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    
    try {
      await eventosApi.excluirEvento(eventId);
      
      setEvents(events.filter(event => event.id !== eventId));
      
      toast({
        title: 'Evento excluído',
        description: 'O evento foi excluído com sucesso.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o evento.',
        variant: 'destructive',
      });
    }
  };
  
  // Filter events based on search query and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.local.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedStatus === 'all') return matchesSearch;
    
    const eventStartDate = new Date(event.data_inicio);
    const today = new Date();
    
    if (selectedStatus === 'upcoming' && eventStartDate > today) return matchesSearch;
    if (selectedStatus === 'past' && eventStartDate < today) return matchesSearch;
    
    return false;
  });
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Eventos</h1>
        <Link href="/dashboard/events/new">
          <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Novo Evento
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os eventos</option>
              <option value="upcoming">Próximos eventos</option>
              <option value="past">Eventos passados</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 h-20 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum evento encontrado.</p>
            <Link href="/dashboard/events/new">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Criar Novo Evento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ingressos</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => {
                  const eventStartDate = new Date(event.data_inicio);
                  const eventEndDate = new Date(event.data_fim);
                  const today = new Date();
                  const isPast = eventEndDate < today;
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">{event.nome}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{event.descricao}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{formatDate(event.data_inicio)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{new Date(event.data_inicio).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{event.local}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {formatCurrency(0)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span>Ilimitados</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!event.is_published ? 'bg-gray-100 text-gray-800' : isPast ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {!event.is_published ? 'Rascunho' : isPast ? 'Encerrado' : 'Publicado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/events/${event.id}`} className="text-purple-600 hover:text-purple-900" title="Ver evento">
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link href={`/dashboard/events/${event.id}/edit`} className="text-blue-600 hover:text-blue-900" title="Editar evento">
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir evento"
                            onClick={() => handleDeleteEvent(event.id)} 
                            className="text-red-500 hover:text-red-700"
                            title="Excluir"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
