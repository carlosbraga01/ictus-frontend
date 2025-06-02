'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Ticket } from '@/types';
import { ticketsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, Clock, MapPin, Check, X, Download } from 'lucide-react';

export function TicketsClient() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'valid' | 'used' | 'cancelled' | 'all'>('valid');
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    const fetchTickets = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        const params: any = {};
        if (activeTab !== 'all') {
          params.status = activeTab;
        }
        
        const response = await ticketsApi.getUserTickets(params);
        setTickets(response.data.tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus ingressos.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTickets();
  }, [isAuthenticated, activeTab, toast]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Autenticação Necessária</h1>
          <p className="text-gray-600 mb-8">
            Você precisa estar logado para visualizar seus ingressos.
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return (
          <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            <Check className="h-3 w-3 mr-1" />
            Válido
          </span>
        );
      case 'used':
        return (
          <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            <Check className="h-3 w-3 mr-1" />
            Utilizado
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            <X className="h-3 w-3 mr-1" />
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meus Ingressos</h1>
        
        {/* Tabs */}
        <div className="border-b mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('valid')}
              className={`pb-4 font-medium ${
                activeTab === 'valid'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Válidos
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={`pb-4 font-medium ${
                activeTab === 'used'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Utilizados
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-4 font-medium ${
                activeTab === 'cancelled'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cancelados
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-4 font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhum ingresso encontrado</h2>
            <p className="text-gray-600 mb-8">
              {activeTab === 'valid'
                ? 'Você não possui ingressos válidos no momento.'
                : activeTab === 'used'
                ? 'Você não possui ingressos utilizados.'
                : activeTab === 'cancelled'
                ? 'Você não possui ingressos cancelados.'
                : 'Você não possui ingressos.'}
            </p>
            <Link href="/events">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Explorar Eventos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Event Image */}
                  <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                    <Image
                      src={ticket.event?.imageUrl || '/images/event-placeholder.jpg'}
                      alt={ticket.event?.title || 'Evento'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Ticket Details */}
                  <div className="p-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(ticket.status)}
                          <span className="text-sm text-gray-500">
                            Comprado em {formatDate(ticket.purchaseDate, 'dd/MM/yyyy')}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-semibold mb-2">
                          {ticket.event?.title || 'Evento não disponível'}
                        </h2>
                        
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {ticket.event?.date
                                ? formatDate(ticket.event.date, 'dd/MM/yyyy')
                                : 'Data não disponível'}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{ticket.event?.time || 'Horário não disponível'}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{ticket.event?.location || 'Local não disponível'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Tipo:</span>
                          <span>{ticket.ticketType}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Quantidade:</span>
                          <span>{ticket.quantity}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Valor:</span>
                          <span>{formatCurrency(ticket.price * ticket.quantity)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {ticket.status === 'valid' && (
                          <>
                            <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center">
                              <Download className="h-4 w-4 mr-2" />
                              Baixar Ingresso
                            </Button>
                            
                            <Link href={`/events/${ticket.eventId}`}>
                              <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                                Ver Evento
                              </Button>
                            </Link>
                          </>
                        )}
                        
                        {ticket.status === 'used' && (
                          <Link href={`/events/${ticket.eventId}`}>
                            <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                              Ver Evento
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
