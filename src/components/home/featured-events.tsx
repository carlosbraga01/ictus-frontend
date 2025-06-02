'use client';

import { useState, useEffect } from 'react';
import { Evento } from '@/types';
import { eventosApi } from '@/lib/api';
import { EventsGrid } from '@/components/events';
import { useToast } from '@/components/ui/use-toast';

export function FeaturedEvents() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setIsLoading(true);
        // Use listarEventos with a filter for featured events
        const response = await eventosApi.listarEventos();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching featured events:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os eventos em destaque.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Eventos em Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Eventos em Destaque</h2>
      <EventsGrid 
        events={events} 
        emptyMessage="Não há eventos em destaque no momento." 
      />
    </div>
  );
}
