'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Evento } from '@/types';
import { eventosApi } from '@/lib/api';
import { EventsGrid, EventFilters, type EventFilters as EventFiltersType } from '@/components/events';
import { useToast } from '@/components/ui/use-toast';

export function EventsListingClient() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([
    'Conferências', 'Louvor', 'Estudos', 'Retiros', 'Jovens', 'Especiais'
  ]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // Get initial filters from URL
  const initialFilters: EventFiltersType = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : null,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null,
  };
  
  const [filters, setFilters] = useState<EventFiltersType>(initialFilters);
  
  // Fetch events when filters or page changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Convert filters to API query params
        const queryParams: any = {
          skip: (currentPage - 1) * 12,
          limit: 12,
        };
        
        if (filters.search) queryParams.nome = filters.search;
        if (filters.startDate) queryParams.data_inicio = filters.startDate;
        if (filters.endDate) queryParams.data_fim = filters.endDate;
        
        const response = await eventosApi.listarEventos(queryParams);
        setEvents(response.data);
        setTotalEvents(response.data.length);
        // Calculate total pages based on the number of events and page size
        setTotalPages(Math.ceil(response.data.length / 12));
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os eventos. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [filters, currentPage, toast]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.priceMin !== null) params.set('priceMin', filters.priceMin.toString());
    if (filters.priceMax !== null) params.set('priceMax', filters.priceMax.toString());
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/events?${queryString}` : '/events';
    
    router.push(url, { scroll: false });
  }, [filters, currentPage, router]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="space-y-8">
      <EventFilters onFilterChange={handleFilterChange} categories={categories} />
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {totalEvents === 0 
                ? 'Nenhum evento encontrado' 
                : `Mostrando ${events.length} de ${totalEvents} eventos`}
            </p>
          </div>
          
          <EventsGrid 
            events={events} 
            emptyMessage="Nenhum evento encontrado com os filtros selecionados." 
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
                >
                  Anterior
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
                >
                  Próxima
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
